import { Response } from 'express';
import { z } from 'zod';

const tokenSchema = z.object({ token: z.string().length(6, 'Token must be 6 digits') });

export const verifyTwoFactorToken = async (req: any, res: Response) => {
    try {
        const { token } = tokenSchema.parse(req.body);
        // TODO: implement real two-factor token verification logic
        res.status(200).json({ message: 'Token verified', token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
