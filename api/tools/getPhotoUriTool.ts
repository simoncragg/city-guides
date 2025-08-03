import { tool } from "@openai/agents";
import { z } from "zod";
import { getPhotoUriAsync } from "../services/photos";

const getPhotoUriTool = tool({
  name: "get_photo_uri",
  description:
    "Return a signed image URL for a Google Place photo. Input must be a photoName from place.photos[].name returned by get_place.",
  parameters: z.object({
    photoName: z
      .string()
      .describe("Photo resource name from place.photos[].name, e.g. 'places/ChIJ.../photos/ATJ...'."),
  }),
  async execute({ photoName }) {
    return await getPhotoUriAsync(photoName);
  },
});

export default getPhotoUriTool;
