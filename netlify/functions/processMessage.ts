import type { ProcessMessagePayload } from "../types";
import createResponse from "../utils/createResponse";
import { HttpError, assert } from "../utils/assert";
import handleChat from "../handlers/handleChat";

async function processMessage(request: Request): Promise<Response> {

  try {
    assert(request.method === "POST", "Method Not Allowed", 405);
    const { sessionId, message } = await parseBody(request);
    const agentMessage = await handleChat(sessionId, message);
    return createResponse(agentMessage);
  }
  catch (error: unknown) {
    return handleError(error);
  }
}

async function parseBody(request: Request): Promise<ProcessMessagePayload> {
  const text = await request.text();
  try {
    return JSON.parse(text);
  } 
  catch {
    throw new HttpError(400, "Invalid JSON");
  }
}

function handleError(error: unknown): Response | PromiseLike<Response> {
  console.error(error);

  if (error instanceof HttpError) {
    return createResponse({ message: error.message }, error.status);
  }
  
  const msg = error instanceof Error ? error.message : "Internal error";
  return createResponse({ message: msg }, 500);
}

export default processMessage;
