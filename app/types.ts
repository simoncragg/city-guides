export type RoleType = "system" | "user" | "assistant";

export type ChatMessageType = {
  role: RoleType;
  content: string;
};

export type AgentMessageType = ChatMessageType & {
  agent?: string;
  thinkingStatus?: string;
  status: "pending" | "thinking" | "outputting" | "deferring" | "done";
};
