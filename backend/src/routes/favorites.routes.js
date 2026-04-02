import { Router } from 'express';
import {
  deleteUserFavorite,
  listUserFavorites,
  saveUserFavorite
} from '../controllers/favorites.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDb } from '../middleware/requireDb.js';

const router = Router();

router.get('/favorites', requireDb, requireAuth, listUserFavorites);
router.post('/favorites', requireDb, requireAuth, saveUserFavorite);
router.delete('/favorites/:matchId', requireDb, requireAuth, deleteUserFavorite);

export default router;
