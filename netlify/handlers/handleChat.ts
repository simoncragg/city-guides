import type { AgentInputItem } from "@openai/agents";
import { Agent, run } from "@openai/agents";

import type { ChatMessage, ChatSession } from "../types";
import { assert } from "../utils/assert";
import { createSession, getSession, updateSession } from "../db/session";

async function handleChat(sessionId: string, userMessage: ChatMessage): Promise<ChatMessage> {
  
  const session = await getChatSession(sessionId);
  
  const agent = new Agent({
    name: "Assistant",
    model: "gpt-4o",
    instructions: "You are a helpful assistant",
  });

  const thread = [...session.messages, userMessage] as AgentInputItem[];
  const result = await run(agent, thread);
  assert(result.finalOutput, "Agent couldn't generate a reply", 500);
  await updateSession(session.id, result.history);

  return { 
    role: "assistant",
    content: result.finalOutput
  };
};

async function getChatSession(sessionId: string): Promise<ChatSession> {
  const session = await getSession(sessionId);
  return (session)
    ? session
    : await createSession(sessionId);
}

export default handleChat;
