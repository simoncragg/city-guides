import { neon } from '@netlify/neon';

import type { CacheItem, CacheItemRow } from '../types';
import assert from '../utils/assert';

const sql = neon();

export async function getByKey<T = unknown>(key: string): Promise<CacheItem<T> | null> {
  const rows = await sql`
    SELECT key, value, stale_at
    FROM cache_item
    WHERE key = ${key}
    LIMIT 1;
  `;

  return rows.length ? toCacheItem(rows[0] as CacheItemRow<T>) : null;
}

export async function upsertCacheItem<T = unknown>({ key, value, staleAt }: CacheItem<T>): Promise<CacheItem<T>> {
  const [row] = await sql`
    INSERT INTO cache_item (key, value, stale_at)
    VALUES (${key}, ${JSON.stringify(value)}, ${staleAt.toISOString()})
    ON CONFLICT (key) DO UPDATE
      SET value    = EXCLUDED.value,
          stale_at = EXCLUDED.stale_at
    RETURNING key, value, stale_at;
  `;

  assert(row, 'CacheItemRow could not be created', 500);
  return toCacheItem(row as CacheItemRow<T>);
}

function toCacheItem<T>(row: CacheItemRow<T>): CacheItem<T> {
  return { 
    ...row, 
    staleAt: new Date(row.stale_at)
  };
}
