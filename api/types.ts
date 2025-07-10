import { AgentInputItem } from "@openai/agents";

type RoleType = "system" | "user" | "assistant";

export type ChatMessage = {
  role: RoleType;
  content: string;
};

export type ProcessMessagePayload = {
  sessionId: string;
  message: ChatMessage;
};

export type ChatSession = {
  id: string;
  name: string;
  messages: AgentInputItem[];
  created_at: string;
};
