import type { ChatMessage } from "../types";

async function sendMessageAsync(message: ChatMessage): Promise<ChatMessage> {

  const res = await fetch("/.netlify/functions/echoMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${errText}`);
  }

  return res.json();
}

export { sendMessageAsync };
