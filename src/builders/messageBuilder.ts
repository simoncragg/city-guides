import { v4 as uuidv4 } from "uuid";
import type { RoleType } from "../types";

function buildUserMessage(text: string) {
  return buildMessage("user", text);
}

function buildAgentMessage(text: string) {
  return buildMessage("agent", text);
}

function buildMessage(role: RoleType, text: string) {
  return { 
    id: uuidv4(), 
    role: role, 
    text,
  };
}

export { buildUserMessage, buildAgentMessage };
