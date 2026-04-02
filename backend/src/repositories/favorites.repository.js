import { query } from '../db/pool.js';

function mapFavorite(row) {
  return {
    matchId: row.match_id,
    match: row.match_data,
    aiSnapshot: row.ai_snapshot,
    savedAt: row.saved_at
  };
}

export async function listFavoritesByUser(userId) {
  const result = await query(
    `
      SELECT match_id, match_data, ai_snapshot, saved_at
      FROM favorites
      WHERE user_id = $1
      ORDER BY saved_at DESC
    `,
    [userId]
  );
  return result.rows.map(mapFavorite);
}

export async function upsertFavorite({ userId, matchId, match, aiSnapshot }) {
  const result = await query(
    `
      INSERT INTO favorites (user_id, match_id, match_data, ai_snapshot, saved_at)
      VALUES ($1, $2, $3::jsonb, $4, NOW())
      ON CONFLICT (user_id, match_id)
      DO UPDATE SET
        match_data = EXCLUDED.match_data,
        ai_snapshot = EXCLUDED.ai_snapshot,
        saved_at = NOW()
      RETURNING match_id, match_data, ai_snapshot, saved_at
    `,
    [userId, matchId, JSON.stringify(match), aiSnapshot || null]
  );
  return mapFavorite(result.rows[0]);
}

export async function deleteFavoriteByMatchId({ userId, matchId }) {
  const result = await query(`DELETE FROM favorites WHERE user_id = $1 AND match_id = $2`, [
    userId,
    matchId
  ]);
  return result.rowCount > 0;
}
