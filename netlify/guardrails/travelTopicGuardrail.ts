
import { Agent, run } from "@openai/agents";
import z from "zod";

const GUARDRAIL_INSTRUCTIONS = `
You are a binary classifier.

Respond **only** with valid JSON:
{
  "isTravelTopic": <true | false>
}

Return **true** when the user's last message is EITHER:
• About planning or discussing a city trip (e.g. destination choices, transport, accommodation, sightseeing, food, budgeting, travel tips)
• A brief greeting (e.g. "hi", "hello", "good morning", "hey there") **or** a short farewell (e.g. "bye", "good-bye", "see you", "catch you later")

Return **false** when the message is **neither** travel-related **nor** a greeting/farewell (e.g. coding help, fitness advice, finance).
`;

const guardrailAgent = new Agent({
  name: "Guardrail agent",
  instructions: GUARDRAIL_INSTRUCTIONS,
  outputType: z.object({ isTravelTopic: z.boolean() }),
});

const travelTopicGuardrail = {
  name: "Travel Topic Guardrail",
  execute: async ({ input, context }) => {
    const result = await run(guardrailAgent, input, { context });
    return {
      tripwireTriggered: result.finalOutput?.isTravelTopic === false,
      outputInfo: result.finalOutput,
    };
  },
};

export default travelTopicGuardrail;
