export type RoleType = "system" | "user" | "assistant";

export type ChatMessage = {
  role: RoleType;
  content: string;
};

export type AgentMessage = ChatMessage & {
  agent: string;
};
