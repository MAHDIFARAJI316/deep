import { Request, Response } from 'express';
import * as authService from '@backend/services/authService';
import { sendTokenCookie } from '@backend/utils/token';
import { z } from 'zod';

const phoneSchema = z.object({
    phone: z.string().regex(/^09\d{9}$/, 'Invalid Iranian phone number format.'),
});

const otpSchema = phoneSchema.extend({
    otp: z.string().length(6, 'OTP must be 6 digits.'),
    twoFactorToken: z.string().length(6).optional(),
});


export const requestOtpHandler = async (req: Request, res: Response) => {
    try {
        const { phone } = phoneSchema.parse(req.body);
        const result = await authService.requestOtp(phone);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        if (error instanceof Error) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyOtpHandler = async (req: Request, res: Response) => {
    try {
        const { phone, otp } = otpSchema.parse(req.body);
        const { token, user } = await authService.verifyOtp(phone, otp);

        sendTokenCookie(res, token);

        res.status(200).json({ message: 'Login successful.', user });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        if (error instanceof Error) {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const logoutHandler = (req: Request, res: Response) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully.' });
}; 