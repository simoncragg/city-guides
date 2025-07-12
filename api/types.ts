import { AgentInputItem } from "@openai/agents";

type RoleType = "system" | "user" | "assistant";

export type ChatMessage = {
  role: RoleType;
  content: string;
};

export type AgentMessage = ChatMessage & {
  agent?: string;
};

export type ProcessMessagePayload = {
  sessionId: string;
  message: ChatMessage;
};

export type ChatSession = {
  id: string;
  messages: AgentInputItem[];
  last_agent: string;
  created_at: string;
};
