import { Agent, run } from '@openai/agents';

import { buildAgentMessage } from "../../src/builders/messageBuilder";

const processMessage = async (request: Request): Promise<Response> => {

  if (request.method !== "POST") {
    return createResponse({ message: "Method Not Allowed" }, 405);
  }

  const body = await request.text();
  const userMessage = JSON.parse(body);

  const agent = new Agent({
    name: 'Assistant',
    model: "gpt-4o",
    instructions: 'You are a helpful assistant',
  });

  const result = await run(
    agent,
    userMessage.text,
  );

  if (!result.finalOutput) {
    console.error("Agent returned no output:", result);
    const errorMessage = buildAgentMessage("Sorry, I couldn't generate a reply—please try again.");
    return createResponse(errorMessage, 500);
  }

  const agentMessage = buildAgentMessage(result.finalOutput);
  return createResponse(agentMessage, 200);
}

const createResponse = (body: Record<string, unknown>, status: number): Response => {
  return new Response(JSON.stringify(body), { status });
}

export default processMessage;
