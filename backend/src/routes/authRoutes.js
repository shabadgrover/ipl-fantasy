import { Router } from 'express';
import { postRegister, postLogin, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', postRegister);
router.post('/login', postLogin);
router.get('/me', authenticate, getMe);

export default router;
