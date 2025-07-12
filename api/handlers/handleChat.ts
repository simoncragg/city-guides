import { InputGuardrailTripwireTriggered, run, type AgentInputItem } from "@openai/agents";

import type { AgentMessage, ChatMessage, ChatSession } from "../types";

import silentRouter from "../agents/silentRouter";
import { assert } from "../utils/assert";
import { createSession, getSession, updateSession } from "../db/session";

async function handleChat(sessionId: string, userMessage: ChatMessage): Promise<AgentMessage> {
  
  const session = await getChatSession(sessionId);
  const thread = [...session.messages, userMessage] as AgentInputItem[];

  try {
    const result = await run(silentRouter, thread);
    assert(result.finalOutput, "Agent couldn't generate a reply", 500);
    await updateSession(session.id, result.history, result.lastAgent?.name);

    return { 
      role: "assistant",
      content: result.finalOutput,
      agent: result.lastAgent?.name
    };
  }
  catch (error: unknown) {
    return handleError(error);
  }
};

async function getChatSession(sessionId: string): Promise<ChatSession> {
  const session = await getSession(sessionId);
  return (session)
    ? session
    : await createSession(sessionId);
}

function handleError(error: unknown): AgentMessage {
  
  if (error instanceof InputGuardrailTripwireTriggered) {
    return { 
      role: "assistant",
      content: "Sorry, we can only assist with city breaks.",
      agent: "Victoria",
    };
  }

  throw error;
}

export default handleChat;
