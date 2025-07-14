import type { ChatMessageType } from "../types";

async function runMessageStream(
  sessionId: string | null, 
  message: ChatMessageType, 
  signal: AbortSignal,
  dispatch: (event: string, data: string) => void
): Promise<void> {

  const res = await fetch(`/.netlify/functions/streamMessage`, {
    method: "POST",
    headers: { accept: "text/event-stream" },
    body: JSON.stringify({ sessionId, message }),
    signal
  });

  const decoder = new TextDecoder();
  const reader = res!.body!.getReader();

  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buf += decoder.decode(value, { stream: true });
    const chunks = buf.split("\n\n");
    buf = chunks.pop()!;

    for (const chunk of chunks) {
      let event = "";
      let data  = "";

      for (const line of chunk.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) data += line.slice(5);
      }

      dispatch(event, data);
    }
  }
}

export { runMessageStream };
