const apiBaseUrl = process.env.GOOGLE_PLACES_API_BASEURL;
const apiKey = process.env.GOOGLE_PLACES_API_KEY as string;

const mediaQuery = new URLSearchParams({
  maxHeightPx: "400",
  maxWidthPx: "400",
  skipHttpRedirect: "true",
}).toString();

export async function getPhotoUriAsync(photoName: string): Promise<string | null> {
  
  const mediaUrl = buildMediaUrl(photoName);
  let res: Response;

  try {
    res = await fetch(mediaUrl.href, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "photoUri",
      },
    });
  }
  catch (err: unknown) {
    throw new Error(
      `Network error fetching ${mediaUrl}: ${(err as Error)?.message ?? err}`,
      { cause: err }
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Image retrieval failed (${res.status}): ${body}`);
  }

  const { photoUri } = (await res.json()) as { photoUri?: string };
  return photoUri ?? null;
}

function buildMediaUrl(photoName: string): URL {
  return new URL(`${apiBaseUrl}/${photoName}/media?${mediaQuery}`);
}
