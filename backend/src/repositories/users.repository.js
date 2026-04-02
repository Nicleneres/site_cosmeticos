import { query } from '../db/pool.js';

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at
  };
}

export async function findUserByEmail(email) {
  const result = await query(
    `SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    ...mapUser(row),
    passwordHash: row.password_hash
  };
}

export async function findUserById(userId) {
  const result = await query(
    `SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  return mapUser(result.rows[0]);
}

export async function insertUser({ id, name, email, passwordHash }) {
  const result = await query(
    `
      INSERT INTO users (id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, created_at
    `,
    [id, name, email, passwordHash]
  );
  return mapUser(result.rows[0]);
}
