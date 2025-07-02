import { Request, Response, NextFunction } from 'express';

// This is a sample middleware function.
// Middlewares are used for tasks like logging, authentication, etc.
export const sampleMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('Sample middleware executed');
    next();
}; 