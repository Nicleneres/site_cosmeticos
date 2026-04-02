import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import matchesRoutes from './matches.routes.js';
import analysisRoutes from './analysis.routes.js';
import favoritesRoutes from './favorites.routes.js';

const router = Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(matchesRoutes);
router.use(analysisRoutes);
router.use(favoritesRoutes);

export default router;
