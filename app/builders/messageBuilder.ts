import type { RoleType } from "../types";

function buildUserMessage(content: string) {
  return buildMessage("user", content);
}

function buildMessage(role: RoleType, content: string) {
  return { 
    role: role, 
    content,
  };
}

export { buildUserMessage };
