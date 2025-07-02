import { Router } from 'express';
import { initiateConnectionHandler, getLinesStatusHandler } from '@backend/controllers/whatsappController';
import { protect } from '@backend/middlewares/authMiddleware';

const router = Router();

router.post('/connect', protect, initiateConnectionHandler);
router.get('/status', protect, getLinesStatusHandler);

export default router; 