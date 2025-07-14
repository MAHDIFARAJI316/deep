import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncRequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            if (error instanceof ZodError) {
                // Handle validation errors
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }

            // Log the error but don't expose internal details to client
            console.error('Request error:', error);
            
            res.status(500).json({
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' 
                    ? error instanceof Error ? error.message : String(error)
                    : 'An unexpected error occurred'
            });
        }
    };
}; 