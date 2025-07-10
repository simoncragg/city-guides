import type { ChatMessage } from "../types";

async function sendMessageAsync(sessionId: string | null, message: ChatMessage): Promise<ChatMessage> {

  const response = await fetch(`/.netlify/functions/processMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message }),
  });

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`HTTP ${response.status} ${response.statusText}: ${errText}`);
  }

  return response.json();
}

export { sendMessageAsync };
