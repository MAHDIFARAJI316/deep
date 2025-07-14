import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import User from '../models/User';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                [key: string]: any;
            };
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;

        // Get token from Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Or from cookie
        else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                error: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload;

            // Check if user still exists
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(401).json({
                    error: 'User no longer exists'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    error: 'User account is deactivated'
                });
            }

            // Add user to request object
            req.user = {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                isActive: user.isActive
            };

            next();
        } catch (error) {
            return res.status(401).json({
                error: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        next(error);
    }
};

// Optional: Add role-based authorization
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Not authorized to access this route'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Not authorized to perform this action'
            });
        }

        next();
    };
}; 