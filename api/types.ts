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
  getFunctionCallCount: (fn: string) => number,
  setFunctionCallCount: (fn: string, value: number) => void,
  enqueue: (chunk: string) => void;
};

export type MessageStreamCompletedCallback = (history: AgentInputItem[], lastAgent: string) => Promise<void>;

/* Google Places API */

export type PlaceType = {
  id: string;
  name: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  photos: PhotoType[];
};

export type PhotoType = {
  name: string;
  widthPx?: number;
  heightPx?: number;
};
