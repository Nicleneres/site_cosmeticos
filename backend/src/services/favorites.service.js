import { AppError } from '../lib/errors.js';
import {
  deleteFavoriteByMatchId,
  listFavoritesByUser,
  upsertFavorite
} from '../repositories/favorites.repository.js';

export async function getFavorites(userId) {
  return listFavoritesByUser(userId);
}

export async function addFavorite({ userId, matchId, match, aiSnapshot }) {
  if (!matchId) {
    throw new AppError(400, 'Campo matchId e obrigatorio.');
  }
  if (!match || typeof match !== 'object') {
    throw new AppError(400, 'Payload match invalido.');
  }

  return upsertFavorite({ userId, matchId, match, aiSnapshot });
}

export async function removeFavorite({ userId, matchId }) {
  if (!matchId) {
    throw new AppError(400, 'matchId e obrigatorio.');
  }
  return deleteFavoriteByMatchId({ userId, matchId });
}
