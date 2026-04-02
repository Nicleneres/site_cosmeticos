import { Router } from 'express';
import { postAnalysis } from '../controllers/analysis.controller.js';

const router = Router();

router.post('/analysis', postAnalysis);

export default router;
