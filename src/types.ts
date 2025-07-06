export type RoleType = "user" | "agent";

export interface ChatMessage {
  id: string;
  role: RoleType;
  text: string;
}

