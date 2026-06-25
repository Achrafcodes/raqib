import { Router } from 'express';
import { register, login, logout, getMe, verifyEmail, resendVerification } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', authMiddleware, resendVerification);

export default router;
