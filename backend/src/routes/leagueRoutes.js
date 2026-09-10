import { Router } from 'express';
import { postLeague, getLeague } from '../controllers/leagueController.js';

const router = Router();

router.post('/', postLeague);
router.get('/:id', getLeague);

export default router;
