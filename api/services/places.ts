import type { PlaceType } from "../types";

const API_ROOT = "https://places.googleapis.com/v1";
const API_KEY = process.env.GOOGLE_API_KEY as string;

export async function getPlaceAsync(textQuery: string): Promise<PlaceType | null> {

  const res = await fetch(`${API_ROOT}/places:searchText`, {
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

  const { places } = await res.json();
  
  return (places && places.length > 0)
    ? places[0]
    : null;
}

export async function getPhotoUriAsync(photoName: string): Promise<string | null> {
  
  const mediaUrl =
    `${API_ROOT}/${photoName}/media` +
    `?maxHeightPx=400&maxWidthPx=400&skipHttpRedirect=true`;

  const res = await fetch(mediaUrl, {
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "photoUri",
    },
  });

  if (!res.ok) {
    const msg = "Image retrieval failed";
    console.error(msg, await res.text());
    throw new Error(`${msg}: ${res.status}`);
  }

  const { photoUri } = await res.json() as { photoUri: string };

  return photoUri
    ? photoUri
    : null;
}
