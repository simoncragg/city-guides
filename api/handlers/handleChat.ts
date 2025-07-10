import type { AgentInputItem } from "@openai/agents";
import { Agent, InputGuardrailTripwireTriggered, run } from "@openai/agents";

import type { ChatMessage, ChatSession } from "../types";
import travelTopicGuardrail from "../guardrails/travelTopicGuardrail";
import { assert } from "../utils/assert";
import { createSession, getSession, updateSession } from "../db/session";


async function handleChat(sessionId: string, userMessage: ChatMessage): Promise<ChatMessage> {
  
  const session = await getChatSession(sessionId);
  
  const agent = new Agent({
    name: "City Guide",
    model: "gpt-4o",
    instructions: "You are a city guide",
    inputGuardrails: [travelTopicGuardrail]
  });

  const thread = [...session.messages, userMessage] as AgentInputItem[];

  try {
    const result = await run(agent, thread);
    assert(result.finalOutput, "Agent couldn't generate a reply", 500);
    await updateSession(session.id, result.history);

    return { 
      role: "assistant",
        content: result.finalOutput
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

function handleError(error: unknown): ChatMessage {
  if (error instanceof InputGuardrailTripwireTriggered) {
    return { 
      role: "assistant",
      content: "Sorry, I can only assist with city-break questions."
    };
  }

  throw error;
}

export default handleChat;
