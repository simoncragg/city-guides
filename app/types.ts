export type RoleType = "system" | "user" | "assistant";

export type ChatMessageType = {
  role: RoleType;
  content: string;
};

export type ThinkingStatusType = "Fetching location info" | "Getting photos";

export type AgentMessageType = ChatMessageType & {
  agent?: string;
  thinkingStatus?: ThinkingStatusType;
  status: "pending" | "thinking" | "outputting" | "deferring" | "done";
};
