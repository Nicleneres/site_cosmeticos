import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDb } from '../middleware/requireDb.js';

const router = Router();

router.post('/auth/register', requireDb, register);
router.post('/auth/login', requireDb, login);
router.get('/auth/me', requireDb, requireAuth, me);

export default router;
