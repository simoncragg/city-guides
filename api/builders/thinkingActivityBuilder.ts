import { FunctionCallItem } from "@openai/agents";

import type { ThinkingActivityType } from "../types";
import pluralize from "../utils/pluralize";

function buildThinkingActivity(fci: FunctionCallItem): ThinkingActivityType {
  switch (fci.name) {
    case "find_places": {
      const { queries } = JSON.parse(fci.arguments) as { queries: string[] };
      return buildFindPlacesActivity(queries);
    }
    case "get_photos": {
      const { names } = JSON.parse(fci.arguments) as { names: string[] };
      return buildGettingPhotosActivity(names);
    }
  }

  throw new Error(`No thinking activity for function name "${fci.name}"`);
}

function buildFindPlacesActivity(queries: string[]): ThinkingActivityType {
  const description = queries.length === 1
    ? `Curating details for ${queries[0]}`
    : `Compiling details for ${queries.length} locations`;
  const actions = queries.length > 1 ? queries : [];
  return {
    status: "FindingPlaces",
    description,
    actions
  };
}

function buildGettingPhotosActivity(names: string[]): ThinkingActivityType {
  return {
    status: "GettingPhotos",
    description: "Getting " + pluralize("photo", names.length),
    actions: []
  };
}

export default buildThinkingActivity;
