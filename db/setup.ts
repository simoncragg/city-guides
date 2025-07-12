import { config } from 'dotenv';
import { neon } from '@netlify/neon';

config();

const sql = neon();

await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

await sql`
  DROP TABLE chat_session;
`;

await sql`
  CREATE TABLE IF NOT EXISTS chat_session (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    messages   JSONB       NOT NULL DEFAULT '[]',
    last_agent VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

console.log('✅ Tables created');
