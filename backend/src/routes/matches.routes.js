import { Router } from 'express';
import { getMatches } from '../controllers/matches.controller.js';

const router = Router();

router.get('/matches', getMatches);

export default router;
