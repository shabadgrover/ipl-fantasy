import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import leagueRoutes from './leagueRoutes.js';
import authRoutes from './authRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/leagues', leagueRoutes);

export default router;
