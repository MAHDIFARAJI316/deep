import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { config } from '@backend/config';
import { IUser } from '@backend/models/User';

export const generateToken = (user: IUser) => {
    const payload = { id: user._id, role: user.role };
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });
};

export const sendTokenCookie = (res: Response, token: string) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });
}; 