import { Response } from 'express';
import { IAuthRequest } from '@backend/middlewares/authMiddleware';
import User from '@backend/models/User';
import Message from '@backend/models/Message';
import { getAIReply } from '@backend/services/aiService';
import * as whatsappService from '@backend/services/whatsappService';
import { z } from 'zod';

export const getAIOnboardingQuestionsHandler = (req: IAuthRequest, res: Response) => {
    // This would import the questions from the config file
    res.status(200).json({ questions: "A list of 20 questions will be sent here."});
};

const onboardingAnswersSchema = z.record(z.string());

export const submitAIOnboardingAnswersHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const validation = onboardingAnswersSchema.safeParse(req.body.answers);
        if (!validation.success) {
            return res.status(400).json({ message: 'Invalid data', errors: validation.error.errors });
        }
        
        const user = req.user!;
        user.aiProfile.onboardingAnswers = new Map(Object.entries(validation.data));
        user.aiProfile.isTrained = true;
        await user.save();
        
        res.status(200).json({ message: 'AI profile updated successfully.' });
    } catch (error) {
         res.status(500).json({ message: 'Server error' });
    }
};

export const toggleAIHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const { lineId } = req.params;
        const { isEnabled } = req.body;
        
        const user = req.user!;
        const line = user.whatsappLines.find(l => l.lineId === lineId);

        if (!line) {
            return res.status(404).json({ message: 'Line not found.' });
        }

        line.isAiEnabled = !!isEnabled;
        await user.save();
        
        res.status(200).json({ message: `AI for line ${lineId} has been ${line.isAiEnabled ? 'enabled' : 'disabled'}.` });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAIReplyHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const { lineId, chatId } = req.body;
        const user = req.user!;
        
        const messages = await Message.find({ lineId, chatId }).sort({ timestamp: -1 }).limit(10);
        const messageHistory = messages.map(m => `${m.senderId === user._id.toString() ? 'Me' : 'Customer'}: ${m.text}`);
        const lastMessage = messages[0]?.text || '';

        const reply = await getAIReply(user, messageHistory.reverse(), lastMessage);
        
        if (reply !== 'HANDOVER') {
            const sessionId = `${user._id}-${lineId}`;
            // await whatsappService.sendMessage(sessionId, chatId, reply);
            return res.status(200).json({ reply });
        }

        res.status(200).json({ reply: 'HANDOVER' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}; 