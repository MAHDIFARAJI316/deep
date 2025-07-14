import { Router } from 'express';
import authRouter from './auth';
import { protect } from '../middleware/auth';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
router.use('/auth', authRouter);

// Protected routes
router.use(protect); // All routes below this line require authentication

// Add other route groups here
// router.use('/chats', chatRouter);
// router.use('/messages', messageRouter);

export default router; 