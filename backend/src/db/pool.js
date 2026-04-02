import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 8_000
});

export async function query(text, params = []) {
  return pool.query(text, params);
}
