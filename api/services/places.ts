import type { PlaceType } from "../types";
import { getByKey, upsertCacheItem } from "../db/cacheItem";

const API_BASEURL = process.env.GOOGLE_PLACES_API_BASEURL;
const API_KEY = process.env.GOOGLE_PLACES_API_KEY as string;
const CACHE_DURATION_MS = 1000 * 60 * 60 * 24 * 30;
const MAX_PHOTOS = 3;

interface PlaceDto {
  id: string;
  name: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  photos: PhotoDto[];
}

interface PhotoDto {
  name: string;
  widthPx: number;
  heightPx: number;
  googleMapsUri: string;
  flagContentUri: string;
  authorAttributions: AuthorAttributionDto[];
}

interface AuthorAttributionDto {
  uri: string;
  photoUri: string;
  displayName: string;
}

export async function findPlacesAsync(textQueries: string[]): Promise<Record<string, PlaceType | null>> {

  const cacheEntries = await Promise.all(
    textQueries.map(async (textQuery) => ({
      textQuery,
      place: await getFromCache(textQuery),
    }))
  );

  const toFetch = cacheEntries
    .filter(({ place }) => place === null)
    .map(({ textQuery }) => textQuery);

  const fetchedEntries = await Promise.all(
    toFetch.map(async (textQuery) => ({
      textQuery,
      place: await fetchAndCache(textQuery),
    }))
  );

  const result: Record<string, PlaceType | null> = {};

  cacheEntries.forEach(({ textQuery, place }) => {
    if (place !== null) result[textQuery] = place;
  });

  fetchedEntries.forEach(({ textQuery, place }) => {
    result[textQuery] = place;
  });

  return result;
}

async function getFromCache(textQuery: string): Promise<PlaceType | null> {
  const cacheKey = buildCacheKey(textQuery);
  const cacheItem = await getByKey(cacheKey);
  const isValid = cacheItem && Date.now() < cacheItem.staleAt.getTime();

  return isValid ? (cacheItem.value as PlaceType) : null;
}

async function fetchAndCache(textQuery: string): Promise<PlaceType | null> {
  const res = await fetch(`${API_BASEURL}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.photos",
      ].join(","),
    },
    body: JSON.stringify({ textQuery, pageSize: 1 }),
  });

  const { places: placeDtos } = await res.json();
  const place = placeDtos?.length > 0 ? mapToPlace(placeDtos[0]) : null;

  if (place) {
    await upsertCacheItem({
      key: buildCacheKey(textQuery),
      value: place,
      staleAt: new Date(Date.now() + CACHE_DURATION_MS),
    });
  }

  return place;
}

function buildCacheKey(textQuery: string): string {
  return "place::" + textQuery;
}

function mapToPlace(place: PlaceDto): PlaceType {
  const photos = (place.photos ?? [])
    .slice(0, MAX_PHOTOS)
    .map(({ name, widthPx, heightPx, googleMapsUri }) => ({
      name,
      widthPx,
      heightPx,
      googleMapsUri,
    }));

  return { ...place, photos };
}
