import { 
  Agent,
  AgentInputItem,
  FunctionCallItem,
  InputGuardrailTripwireTriggered,
  RunHandoffCallItem,
  RunItemStreamEvent,
  RunMessageOutputItem,
  RunRawModelStreamEvent,
  RunToolCallItem,
  RunToolCallOutputItem,
  protocol,
  run,
} from "@openai/agents";

import type { 
  ChatMessage, 
  ChatSession, 
  MessageStreamCompletedCallback,
  MessageStreamContext,
  StreamMessagePayload,
  ThinkingStatusType, 
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

function createSseStream(
  thread: AgentInputItem[], 
  onStreamCompleted: MessageStreamCompletedCallback, signal: AbortSignal
) {
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

      const ctx: MessageStreamContext = {
        addToHistory: item => history.push(item),
        setAgent: name => lastAgent = name,
        getAgent: () => lastAgent,
        enqueue: chunk => controller.enqueue(encoder.encode(chunk)),
      };

      try {
        const result = await run(silentRouter, thread, { 
          stream: true, 
          signal
        });

        for await (const event of result) {
          switch (event.type) {
            case "run_item_stream_event": handleRunItemEvent(event, ctx); break;
            case "raw_model_stream_event": handleRawModelEvent(event, ctx);
          }
        }
      } catch (error: unknown) {
        if (error instanceof InputGuardrailTripwireTriggered) {
          handleInputGuardrailTripwireTrigger(ctx);
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
  switch (item.type) {
    case "handoff_call_item": handleHandoffCallItem(item, ctx); break;
    case "handoff_output_item": handleHandoffOutputItem(item, ctx); break;
    case "tool_call_item": handleToolCallItem(item, ctx); break;
    case "tool_call_output_item": handleToolCallOutputItem(item, ctx); break;
    case "message_output_item": handleMessageOutputItem(item, ctx); break;
  }
}

function handleHandoffCallItem(item: RunHandoffCallItem, ctx: MessageStreamContext) {
  if (item.rawItem.status === "completed") {
    ctx.addToHistory(item.rawItem);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RunHandoffOutputItem = { rawItem: protocol.FunctionCallResultItem, targetAgent: Agent<any, any> };

function handleHandoffOutputItem(item: RunHandoffOutputItem, ctx: MessageStreamContext) {
  if (item.rawItem.status === "completed") {
    ctx.addToHistory(item.rawItem);
    ctx.setAgent(item.targetAgent.name);
    ctx.enqueue(`event:message_agent\ndata:${item.targetAgent.name}\n\n`);
  }
}

function handleToolCallItem({ rawItem }: RunToolCallItem, ctx: MessageStreamContext) {
  if (rawItem.type === "function_call") {
    handleFunctionCall(rawItem, ctx);
  }
  
  if (rawItem.status === "completed") {
    ctx.addToHistory(rawItem);
  }
}

function handleToolCallOutputItem({ rawItem }: RunToolCallOutputItem, ctx: MessageStreamContext) {
  if (rawItem.type === "function_call_result" && rawItem.status === "completed") {
    ctx.addToHistory(rawItem);
  }
}

function handleFunctionCall({ name }: FunctionCallItem, ctx: MessageStreamContext) {
  const enqueue = (data: string) => ctx.enqueue(`event:message_thinking_status\ndata:${data}\n\n`);
  switch (name) {
    case "find_places": 
      enqueue("Fetching location info" as ThinkingStatusType);
      break;
    case "get_photo_uri":
      enqueue("Getting photos" as ThinkingStatusType);
      break;
  }
}

function handleMessageOutputItem({ rawItem }: RunMessageOutputItem, ctx: MessageStreamContext) {
  if (rawItem.type === "message" && rawItem.status === "completed") {
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

function handleInputGuardrailTripwireTrigger(ctx: MessageStreamContext) {
  const data = {
    content: "Sorry, we can only assist with city breaks.",
    agent: ctx.getAgent() ?? "Victoria"
  };
  ctx.enqueue(`event:message_delta\ndata:${JSON.stringify(data)}\n\n`);
}

export default streamMessage;
