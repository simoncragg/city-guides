import { neon } from '@netlify/neon';
import type { AgentInputItem } from '@openai/agents';
import type { ChatSession } from '../types';
import { assert } from '../utils/assert';

const sql = neon();

export async function getSession(sessionId: string): Promise<ChatSession | null> {
  const result = await sql`
    SELECT id, messages, last_agent, created_at
    FROM chat_session
    WHERE id = ${sessionId}
    LIMIT 1;
  `;

  return result.length > 0 ? result[0] as ChatSession : null;
}

export async function createSession(sessionId: string, messages: AgentInputItem[] = []): Promise<ChatSession> {
  const [session] = await sql`
    INSERT INTO chat_session (id, messages, last_agent)
    VALUES (${sessionId}, ${JSON.stringify(messages)}, ${""})
    ON CONFLICT DO NOTHING
    RETURNING id, messages, last_agent, created_at;
  `;

  assert(session, "Session could not be created", 500);
  return session as ChatSession;
}

export async function updateSession(sessionId: string, messages: AgentInputItem[], lastAgent: string | undefined): Promise<void> {
  await sql`
    UPDATE chat_session
    SET messages = ${JSON.stringify(messages)},
        last_agent = ${lastAgent || ""}
    WHERE id = ${sessionId};
  `;
}
