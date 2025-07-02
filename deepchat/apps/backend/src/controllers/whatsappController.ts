import { Response } from 'express';
import * as whatsappService from '@backend/services/whatsappService';
import { IAuthRequest } from '@backend/middlewares/authMiddleware';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const lineSchema = z.object({
    lineId: z.string().optional(),
});

export const initiateConnectionHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.whatsappLines.length >= 2) {
            return res.status(400).json({ message: 'You have reached the maximum number of 2 lines.' });
        }
        
        const lineId = uuidv4();
        user.whatsappLines.push({ lineId, isconnected: false, phoneNumber: null });
        await user.save();
        
        const result = await whatsappService.startWhatsAppSession(req, lineId);
        res.status(200).json({ ...result, lineId });

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const getLinesStatusHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const statuses = await whatsappService.getLinesStatus(req);
        res.status(200).json(statuses);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
}; 