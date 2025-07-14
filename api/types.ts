import { AgentInputItem } from "@openai/agents";

type RoleType = "system" | "user" | "assistant";

export type ChatMessage = {
  role: RoleType;
  content: string;
};

export type AgentMessage = ChatMessage & {
  agent?: string;
};

export type ChatSession = {
  id: string;
  messages: AgentInputItem[];
  last_agent: string;
  created_at: string;
};

export type StreamMessagePayload = {
  sessionId: string;
  message: ChatMessage;
};

export type MessageStreamContext = {
  addToHistory: (item: AgentInputItem) => void;
  getAgent: () => string | undefined;
  setAgent: (name: string) => void;
  enqueue: (chunk: string) => void;
};

export type MessageStreamCompletedCallback = (history: AgentInputItem[], lastAgent: string) => Promise<void>;
