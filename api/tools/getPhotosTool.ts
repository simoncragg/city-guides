import { tool } from "@openai/agents";
import { z } from "zod";
import { getPhotosAsync } from "../services/photos";

const getPhotosTool = tool({
  name: "get_photos",
  description:
    "Given one or more Google Place photo resource names, return a mapping from each name to its signed image URL.",
  parameters: z.object({
    names: z
      .array(z.string())
      .min(1, "You must supply at least one photo resource name")
      .describe("Array of photo resource names, e.g. ['places/ChIJK…/photos/ATJK…', 'places/ChIJK…/photos/BLMN…']"),
  }),

  async execute({ names }) {
    return await getPhotosAsync(names);
  },
});

export default getPhotosTool;
