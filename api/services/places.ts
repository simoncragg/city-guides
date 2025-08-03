import type { PlaceType } from "../types";
import { getByKey, upsertCacheItem } from "../db/cacheItem";

const apiBaseUrl = process.env.GOOGLE_PLACES_API_BASEURL;
const apiKey = process.env.GOOGLE_PLACES_API_KEY as string;
const cacheKeyPrefix = "place::";
const cacheDurationMs = 1000 * 60 * 60 * 24 * 30;

export async function getPlaceAsync(textQuery: string): Promise<PlaceType | null> {

  const place = await getFromCache(textQuery);
  return place
    ? place
    : fetchAndCache(textQuery);
}

async function getFromCache(textQuery: string): Promise<PlaceType | null> {
  const cacheKey = cacheKeyPrefix + textQuery;
  const cacheItem = await getByKey(cacheKey);
  if (cacheItem) {
    console.log({
      cacheItem: { cacheItem }, 
      now: Date.now(), 
      staleAt: cacheItem.staleAt.getTime()
    });
  }

  if (cacheItem && Date.now() < cacheItem.staleAt.getTime()) {
    console.log("USING CACHE ITEM");
    return cacheItem.value as PlaceType;
  }

  return null;
}

async function fetchAndCache(textQuery: string): Promise<PlaceType | null> {
  const res = await fetch(`${apiBaseUrl}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.photos",
      ].join(","),
    },
    body: JSON.stringify({ textQuery, pageSize: 1 }),
  });

  const { places } = await res.json();

  const place = (places?.length > 0)
  ? places[0]
  : null;

  if (place) {
    await upsertCacheItem({ 
      key: cacheKeyPrefix + textQuery, 
      value: place, 
      staleAt: new Date(Date.now() + cacheDurationMs),
    });
  }

  return place;
}
