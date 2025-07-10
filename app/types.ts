export type RoleType = "system" | "user" | "assistant";

export interface ChatMessage {
  role: RoleType;
  content: string;
}
