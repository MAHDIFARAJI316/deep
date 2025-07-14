import { Router } from 'express';
import { healthCheck } from '@backend/controllers/healthCheck';
import authRoutes from './authRoutes';
import whatsappRoutes from './whatsappRoutes';
import messageRoutes from './messageRoutes';
import customerRoutes from './customerRoutes';
import aiRoutes from './aiRoutes';

const router = Router();

router.get('/health', healthCheck);
router.use('/auth', authRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/messages', messageRoutes);
router.use('/customers', customerRoutes);
router.use('/ai', aiRoutes);

export default router; 