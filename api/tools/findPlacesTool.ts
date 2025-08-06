import { tool } from "@openai/agents";
import { z } from "zod";
import { findPlacesAsync } from "../services/places";

const findPlacesTool = tool({
  name: "find_places",
  description:
    "Look up a real-world places from free text and return id, canonical name, address, and photo references for each place. Call this before fetching a photo.",
  parameters: z.object({
    queries: z
      .array(z.string())
      .min(1, "You must supply at least one query")
      .describe("An array of natural-language place descriptions, e.g. ['Eiffel Tower, Paris', 'Louvre Museum, Paris, France']"),
  }),
  async execute({ queries }) {
    return await findPlacesAsync(queries);
  },
});

export default findPlacesTool;
