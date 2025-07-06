import { buildAgentMessage } from "../../src/builders/messageBuilder";

const echoMessage = async (request: Request): Promise<Response> => {

  if (request.method !== "POST") {
    return createResponse({ message: "Method Not Allowed" }, 405);
  }

  const body = await request.text();
  const userMessage = JSON.parse(body);
  const agentMessage = buildAgentMessage(userMessage.text);
  return createResponse(agentMessage, 200);
}

const createResponse = (body: Record<string, unknown>, status: number): Response => {
  return new Response(JSON.stringify(body), { status });
}

export default echoMessage;
