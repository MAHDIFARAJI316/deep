import { Response } from 'express';
import * as whatsappService from '@backend/services/whatsappService';
import { IAuthRequest } from '@backend/middlewares/authMiddleware';

export const getChatListHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const { lineId } = req.params;
        // const chats = await whatsappService.getChatList(lineId);
        // res.status(200).json(chats);
        res.status(200).json([`chat1-for-${lineId}`, `chat2-for-${lineId}`]); // Mock data
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMessagesHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const { lineId, chatId } = req.params;
        // const messages = await whatsappService.getMessages(lineId, chatId);
        // res.status(200).json(messages);
        res.status(200).json([ // Mock data
            { senderId: 'me', text: 'Hello!', timestamp: new Date() },
            { senderId: chatId, text: 'Hi there!', timestamp: new Date() },
        ]);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const sendMessageHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const { lineId, chatId } = req.params;
        const { text } = req.body;
        const sessionId = `${req.user!._id}-${lineId}`;

        // const message = await whatsappService.sendMessage(sessionId, chatId, text);
        // res.status(201).json(message);
        res.status(201).json({ text, message: 'Message sending functionality is pending service update.' });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
}; 