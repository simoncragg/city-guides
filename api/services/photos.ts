const apiBaseUrl = process.env.GOOGLE_PLACES_API_BASEURL;
const apiKey = process.env.GOOGLE_PLACES_API_KEY as string;

export async function getPhotoUriAsync(photoName: string): Promise<string | null> {
  
  const mediaUrl =
    `${apiBaseUrl}/${photoName}/media` +
    `?maxHeightPx=400&maxWidthPx=400&skipHttpRedirect=true`;

  const res = await fetch(mediaUrl, {
    headers: {
      "X-Goog-Api-Key": apiKey,
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
