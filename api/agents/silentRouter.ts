import { Agent } from "@openai/agents";
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions';

import cityGuideAgents from "./cityGuideAgents";
import travelTopicGuardrail from "../guardrails/travelTopicGuardrail";

const instructions = `${RECOMMENDED_PROMPT_PREFIX}

Handoff to the appropriate agent based on the user's latest message.

## Routing Rules
- London → Victoria
- Paris → Claude
- Rome → Augustus
- Berlin → Otto
- Barcelona → Marina

If no supported city is mentioned → route to Victoria so she can explain the coverage.

NEVER respond to the user directly.

ALWAYS Handoff
`;

const silentRouter = new Agent({
  name: "Silent Router",
  model: "gpt-4o",
  modelSettings: { temperature: 0, toolChoice: "required" },
  instructions,
  inputGuardrails: [travelTopicGuardrail],
  handoffs: cityGuideAgents,
});

export default silentRouter;
