import { Agent } from "@openai/agents";

import barcelonaGuide from "../guides/barcelona";
import berlinGuide from "../guides/berlin";
import londonGuide from "../guides/london";
import parisGuide from "../guides/paris";
import romeGuide from "../guides/rome";

import findPlacesTool from "../tools/findPlacesTool";
import getPhotosTool from "../tools/getPhotosTool";

const guides = [
  barcelonaGuide, berlinGuide, londonGuide, parisGuide, romeGuide
];

const toolUsePolicy = `
## TOOL USE

- **find_places** 
  - Use \`find_places\` to retrieve photo resource names and links for one or more locations.
  - Before calling, gather all required queries so you only use the tool once per response.
  - Never invent place resource names or URLs—always use the tool. 

- **get_photos** 
  - Use \`get_photos\` to obtain signed URLs for one or more photo resource names. 
  - Before calling, gather all required photo names so you only use the tool once per response.
  - By default, include only the first photo name per place. Add more only if the user explicitly requests multiple photos.
  - Embed images in Markdown using the returned signed URLs. 
`;

const cityGuideAgents = guides.map(guide => {
  
  return new Agent({
    name: guide.name,
    model: "gpt-4o",
    instructions: `${guide.instructions}\n\n${toolUsePolicy}`,
    tools: [findPlacesTool, getPhotosTool]
  });
});

export default cityGuideAgents;
