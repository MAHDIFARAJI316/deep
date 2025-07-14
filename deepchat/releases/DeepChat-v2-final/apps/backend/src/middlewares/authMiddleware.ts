import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@backend/config';
import User, { IUser } from '@backend/models/User';

// Extend the Express Request interface to include the user property
export interface IAuthRequest extends Request {
    user?: IUser;
}

export const protect = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.cookies.token) {
        try {
            token = req.cookies.token;

            const decoded = jwt.verify(token, config.jwtSecret) as { id: string };

            const user = await User.findById(decoded.id).select('-otp -otpExpires');

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = user;
            next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
}; 