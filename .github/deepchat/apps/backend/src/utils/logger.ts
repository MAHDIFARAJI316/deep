import pino from 'pino';
import { config } from '../config';

// Configure logger based on environment
const logger = pino({
    level: config.isDevelopment ? 'debug' : 'info',
    transport: config.isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers["set-cookie"]',
            '*.password',
            '*.apiKey',
        ],
        remove: true,
    },
});

// Export a wrapper around pino logger with additional methods
export const customLogger = {
    debug: (message: string, ...args: any[]) => logger.debug(message, ...args),
    info: (message: string, ...args: any[]) => logger.info(message, ...args),
    warn: (message: string, ...args: any[]) => logger.warn(message, ...args),
    error: (message: string | Error, ...args: any[]) => {
        if (message instanceof Error) {
            logger.error({
                err: {
                    message: message.message,
                    stack: message.stack,
                    ...message,
                },
                ...args,
            });
        } else {
            logger.error(message, ...args);
        }
    },
    // Add request logging
    request: (req: any, message = 'Incoming request') => {
        logger.debug({
            msg: message,
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            // Don't log body in production to avoid logging sensitive data
            ...(config.isDevelopment && { body: req.body }),
        });
    },
    // Add response logging
    response: (res: any, message = 'Outgoing response') => {
        logger.debug({
            msg: message,
            statusCode: res.statusCode,
            // Don't log body in production
            ...(config.isDevelopment && { body: res.body }),
        });
    },
};

export { customLogger as logger }; 