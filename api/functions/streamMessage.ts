import { AgentInputItem, InputGuardrailTripwireTriggered, run, RunItemStreamEvent, RunRawModelStreamEvent } from "@openai/agents";

import type { 
  ChatMessage, 
  ChatSession, 
  StreamMessagePayload, 
  MessageStreamContext,
  MessageStreamCompletedCallback
} from "../types";

import silentRouter from "../agents/silentRouter";
import { HttpError, assert } from "../utils/assert";
import { createSession, getSession, updateSession } from "../db/session";

async function streamMessage(request: Request) {
  assert(request.method === "POST", "Method Not Allowed", 405);
  const { sessionId, message } = await parseBody(request);
  const session = await getChatSession(sessionId);
  const thread = buildThread(session, message);
  const body = createSseStream(thread, (history, lastAgent) => updateSession(session.id, history, lastAgent), request.signal);
  
  return new Response(body, { 
    headers: { 
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  });
}

async function parseBody(request: Request): Promise<StreamMessagePayload> {
  const text = await request.text();
  try { return JSON.parse(text); } 
  catch { throw new HttpError(400, "Invalid JSON"); }
}

async function getChatSession(sessionId: string): Promise<ChatSession> {
  const session = await getSession(sessionId);
  return (session)
    ? session
    : await createSession(sessionId);
}

function buildThread(session: ChatSession, message: ChatMessage): AgentInputItem[] {
  return [...session.messages, message] as AgentInputItem[];
}

function createSseStream(thread: AgentInputItem[], onStreamCompleted: MessageStreamCompletedCallback, signal: AbortSignal) {
  return new ReadableStream({

    async start(controller) {
      const encoder = new TextEncoder();
      const history = [...thread];
      let lastAgent = "";
      let aborted = false;

      signal.addEventListener("abort", async () => {
        aborted = true;
        try { await onStreamCompleted(history, lastAgent); }
        finally { controller.close(); }
      }, { once: true });

      try {
        const ctx: MessageStreamContext = {
          addToHistory: item => history.push(item),
          setAgent: name => lastAgent = name,
          getAgent: () => lastAgent,
          enqueue: chunk => controller.enqueue(encoder.encode(chunk)),
        };

        const result = await run(silentRouter, thread, { 
          stream: true, 
          signal
        });

        for await (const event of result) {
          if (event.type === "run_item_stream_event") {
            handleRunItemEvent(event, ctx);
          }
          if (event.type === "raw_model_stream_event") {
            handleRawModelEvent(event, ctx);
          }
        }
      } catch (error: unknown) {
        if (error instanceof InputGuardrailTripwireTriggered) {
          controller.enqueue(`event:message_delta\ndata:{ "content": "Sorry, we can only assist with city breaks.", "agent": "Victoria" }\n\n`);
        } else {
          controller.error(error);
          console.error(error);
        }
      } finally {
        if (!aborted) {
          await onStreamCompleted(history, lastAgent);
          controller.close();
        }
      }
    }
  });
}

function handleRunItemEvent(event: RunItemStreamEvent, ctx: MessageStreamContext) {
  const { item } = event;
  const { type, rawItem } = item;

  if (type === "handoff_call_item" && rawItem.status === "completed") {
    ctx.addToHistory(event.item.rawItem);
  }

  if (type === "handoff_output_item" && rawItem.status === "completed") {
    ctx.addToHistory(rawItem);
    ctx.setAgent(item.targetAgent.name);
    ctx.enqueue(`event:message_agent\ndata:${item.targetAgent.name}\n\n`);
  }

  if (type === "tool_call_item" && rawItem.status === "completed") {
    ctx.addToHistory(event.item.rawItem);
  }

  if (type === "tool_call_output_item") {
    ctx.addToHistory(event.item.rawItem);
  }

  if (type === "message_output_item" && rawItem.type === "message" && rawItem.status === "completed") {
    ctx.addToHistory(rawItem);
  }
}

function handleRawModelEvent(event: RunRawModelStreamEvent, ctx: MessageStreamContext) {
  if (event.data.type === "output_text_delta") {
    const delta = event.data.delta.replace(/\n/g, "\\n");
    //console.log(`>${delta}<`);
    ctx.enqueue(`event:message_delta\ndata:{ "content": "${delta}", "agent": "${ctx.getAgent()}" }\n\n`);
  }
}

export default streamMessage;
