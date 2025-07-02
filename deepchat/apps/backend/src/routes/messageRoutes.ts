import { Router } from 'express';
import { getChatListHandler, getMessagesHandler, sendMessageHandler } from '@backend/controllers/messageController';
import { protect } from '@backend/middlewares/authMiddleware';

const router = Router();

// All routes are protected
router.use(protect);

router.get('/:lineId/chats', getChatListHandler);
router.get('/:lineId/chats/:chatId', getMessagesHandler);
router.post('/:lineId/chats/:chatId', sendMessageHandler);

export default router; 