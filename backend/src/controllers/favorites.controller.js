import { addFavorite, getFavorites, removeFavorite } from '../services/favorites.service.js';

export async function listUserFavorites(req, res, next) {
  try {
    const favorites = await getFavorites(req.auth.user.id);
    res.json({ favorites });
  } catch (error) {
    next(error);
  }
}

export async function saveUserFavorite(req, res, next) {
  try {
    const favorite = await addFavorite({
      userId: req.auth.user.id,
      matchId: req.body?.matchId,
      match: req.body?.match,
      aiSnapshot: req.body?.aiSnapshot || null
    });
    res.status(201).json({ favorite });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserFavorite(req, res, next) {
  try {
    const removed = await removeFavorite({
      userId: req.auth.user.id,
      matchId: req.params?.matchId
    });
    res.json({ removed });
  } catch (error) {
    next(error);
  }
}
