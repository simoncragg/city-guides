import { tool } from "@openai/agents";
import { z } from "zod";
import { findPlaceAsync } from "../services/places";

const findPlaceTool = tool({
  name: "find_place",
  description:
    "Look up a real-world place from free text and return id, canonical name, address, and photo references. Call this before fetching a photo.",
  parameters: z.object({
    query: z
      .string()
      .describe("Natural-language place description, e.g. 'Eiffel Tower, Paris' or 'Louvre Museum, Paris, France'."),
  }),
  async execute({ query }) {
    return await findPlaceAsync(query);
  },
});

export default findPlaceTool;
