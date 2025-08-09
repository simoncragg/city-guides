import { AgentInputItem } from "@openai/agents";

export type RoleType = "system" | "user" | "assistant";
export type ThinkingStatusType = "FindingPlaces" | "GettingPhotos";

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

export type ThinkingActivityType = {
  status: ThinkingStatusType;
  description: string;
  actions: string[];
};

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
  googleMapsUri: string;
};

/* Cache Item */

export type CacheItemRow<T = unknown> = {
  key: string;
  value: T;
  stale_at: string;
};

export type CacheItem<T = unknown> = {
  key: string;
  value: T;
  staleAt: Date;
};
