import { Router } from 'express';
import { postLeague, getLeague, getLeagues } from '../controllers/leagueController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getLeagues);
router.post('/', postLeague);
router.get('/:id', getLeague);

export default router;
