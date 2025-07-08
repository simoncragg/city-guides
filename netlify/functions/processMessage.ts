import { Agent, AgentInputItem, run } from "@openai/agents";

import type { ChatMessage, ChatSession, ProcessMessagePayload } from "../types";
import createResponse from "../utils/createResponse";
import { createSession, getSession, updateSession } from "../db/session";
import { HttpError, assert } from "../utils/assert";

async function processMessage(request: Request): Promise<Response> {

  try {
    assert(request.method === "POST", "Method Not Allowed", 405);
    const payload = await parseBody(request);
    const agentMessage = await handleChat(payload);
    return createResponse(agentMessage);
  }
  catch (error: unknown) {
    return handleError(error);
  }
}

async function parseBody(request: Request): Promise<ProcessMessagePayload> {
  const text = await request.text();
  try {
    return JSON.parse(text);
  } 
  catch {
    throw new HttpError(400, "Invalid JSON");
  }
}

async function getChatSession(sessionId: string): Promise<ChatSession> {
  const session = await getSession(sessionId);
  return (session)
    ? session
    : await createSession(sessionId);
}

async function handleChat(payload: ProcessMessagePayload): Promise<ChatMessage> {
  
  const chatSession = await getChatSession(payload.sessionId);
  
  const agent = new Agent({
    name: "Assistant",
    model: "gpt-4o",
    instructions: "You are a helpful assistant",
  });

  const thread = [...chatSession.messages, payload.message] as AgentInputItem[];
  const result = await run(agent, thread);
  assert(result.finalOutput, "Agent couldn't generate a reply", 500);
  await updateSession(chatSession.id, result.history);

  return { 
    role: "assistant",
    content: result.finalOutput
  };
};

function handleError(error: unknown): Response | PromiseLike<Response> {
  console.error(error);

  if (error instanceof HttpError) {
    return createResponse({ message: error.message }, error.status);
  }
  
  const msg = error instanceof Error ? error.message : "Internal error";
  return createResponse({ message: msg }, 500);
}

export default processMessage;
