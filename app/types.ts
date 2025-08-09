export type RoleType = "system" | "user" | "assistant";
export type ThinkingStatusType = "FindingPlaces" | "GettingPhotos";

export type ChatMessageType = {
  role: RoleType;
  content: string;
};


export type ThinkingActivityType = {
  status: ThinkingStatusType;
  description: string;
  actions: string[];
};

export type AgentMessageType = ChatMessageType & {
  agent?: string;
  thinkingActivity?: ThinkingActivityType;
  status: "pending" | "thinking" | "outputting" | "deferring" | "done";
};
