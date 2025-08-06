import { Agent } from "@openai/agents";

import barcelonaGuide from "../guides/barcelona";
import berlinGuide from "../guides/berlin";
import londonGuide from "../guides/london";
import parisGuide from "../guides/paris";
import romeGuide from "../guides/rome";

import findPlaceTool from "../tools/findPlaceTool";
import getPhotoUriTool from "../tools/getPhotoUriTool";

const guides = [
  barcelonaGuide, berlinGuide, londonGuide, parisGuide, romeGuide
];

const toolUseTemplate = `
## TOOL USE
- Use find_place when the user mentions or asks about a location.
- Include the term {{CITY}} in the query.
- After find_place returns, you can call get_photo_uri with one of place.photos[].name (usually the first).
- Never invent photo names or URLs; always call the tool when you need to include a photo in your response.
- Embed the image in markdown using the photoUri returned by the tool.
`;

const cityGuideAgents = guides.map(guide => {
  
  const toolUsePolicy = `${toolUseTemplate.replace("{{CITY}}", guide.city)}`;

  return new Agent({
    name: guide.name,
    model: "gpt-4o",
    instructions: `${guide.instructions}\n\n${toolUsePolicy}`,
    tools: [findPlaceTool, getPhotoUriTool]
  });
});

export default cityGuideAgents;
