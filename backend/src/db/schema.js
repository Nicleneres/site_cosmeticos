import { query } from './pool.js';

const CREATE_USERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const CREATE_FAVORITES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL,
  match_data JSONB NOT NULL,
  ai_snapshot TEXT,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT favorites_user_match_unique UNIQUE (user_id, match_id)
);
`;

export async function ensureSchema() {
  await query(CREATE_USERS_TABLE_SQL);
  await query(CREATE_FAVORITES_TABLE_SQL);
}
