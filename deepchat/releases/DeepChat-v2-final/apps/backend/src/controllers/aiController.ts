import { Response } from 'express';
import { IAuthRequest } from '@backend/middlewares/authMiddleware';
import User from '@backend/models/User';
import Message from '@backend/models/Message';
import { getAIReply } from '@backend/services/aiService';
import * as whatsappService from '@backend/services/whatsappService';
import { z } from 'zod';
import axios from 'axios';

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
        const { lineId } = req.body;
        const user = req.user!;
        
        const line = user.whatsappLines.find(l => l.lineId === lineId);
        if (!line) {
            return res.status(404).json({ message: 'Line not found' });
        }
        
        line.isAiEnabled = !line.isAiEnabled;
        await user.save();
        
        res.status(200).json({ 
            message: 'AI toggle updated successfully', 
            isAiEnabled: line.isAiEnabled 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAIReplyHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const { lineId, chatId } = req.body;
        const user = req.user!;
        
        const messages = await Message.find({ lineId, chatId }).sort({ timestamp: -1 }).limit(10);
        const messageHistory = messages.map(m => `${m.senderId === (user._id as any).toString() ? 'Me' : 'Customer'}: ${m.text}`);
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

const chatSchema = z.object({
    message: z.string().min(1),
    userId: z.string(),
    lineId: z.string(),
    context: z.object({
        recentMessages: z.array(z.any()).optional()
    }).optional()
});

export const aiChatHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const validation = chatSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ 
                message: 'Invalid request data', 
                errors: validation.error.errors 
            });
        }

        const { message, userId, lineId, context } = validation.data;
        
        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get recent messages for context
        const recentMessages = await Message.find({ 
            lineId, 
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        })
        .sort({ timestamp: -1 })
        .limit(10);

        // Prepare context for AI
        const messageHistory = recentMessages.reverse().map(msg => ({
            sender: msg.senderId === userId ? 'user' : 'other',
            text: msg.text,
            timestamp: msg.timestamp
        }));

        // Call AI Agent service
        try {
            const agentResponse = await axios.post(`${process.env.AGENT_URL || 'http://localhost:3002'}/api/ai/chat`, {
                message,
                userId,
                context: {
                    ...context,
                    messageHistory,
                    userProfile: {
                        phone: user.phone,
                        aiProfile: user.aiProfile,
                        gamificationStats: {
                            xp: user.gamificationStats?.xp || 0,
                            level: user.gamificationStats?.level || 1
                        }
                    }
                }
            });

            const aiResponse = agentResponse.data.response;

            // Save AI response as message
            const aiMessage = new Message({
                messageId: `ai-${Date.now()}`,
                senderId: 'ai-agent',
                receiverId: userId,
                lineId,
                text: aiResponse,
                timestamp: new Date(),
                isAiGenerated: true
            });

            await aiMessage.save();

            // Update user XP for AI interaction
            if (user.gamificationStats) {
                user.gamificationStats.xp += 2; // 2 XP for AI interaction
                
                // Check for level up
                const newLevel = Math.floor(user.gamificationStats.xp / 100) + 1;
                if (newLevel > user.gamificationStats.level) {
                    user.gamificationStats.level = newLevel;
                    user.gamificationStats.coins += 50; // Bonus coins for level up
                }
                
                await user.save();
            }

            res.status(200).json({
                response: aiResponse,
                context: agentResponse.data.context,
                userStats: {
                    xp: user.gamificationStats?.xp || 0,
                    level: user.gamificationStats?.level || 1,
                    coins: user.gamificationStats?.coins || 0
                }
            });

        } catch (agentError) {
            console.error('AI Agent error:', agentError);
            
            // Fallback response if AI agent is not available
            const fallbackResponse = `🍄 سلام! متاسفانه در حال حاضر Mario AI در دسترس نیست. لطفاً بعداً تلاش کنید.`;
            
            res.status(200).json({
                response: fallbackResponse,
                context: null,
                userStats: {
                    xp: user.gamificationStats?.xp || 0,
                    level: user.gamificationStats?.level || 1,
                    coins: user.gamificationStats?.coins || 0
                }
            });
        }

    } catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({ message: 'Server error in AI chat' });
    }
}; 