import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mainRouter from '@backend/routes';
import { connectDB } from '@backend/config/database';
import { initWhatsApp } from '@backend/services/whatsappService';
import { logger as appLogger } from 'utils';
import { config } from '@backend/config';

// Connect to database
connectDB();

const app = express();

// Production security middleware
if (config.isProduction) {
    app.set('trust proxy', 1); // Trust first proxy
    app.use(helmet()); // Security headers
    app.use(compression()); // Compress responses
}

// Rate limiting
app.use(rateLimit(config.rateLimit));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors(config.cors));

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
    cors: config.cors
});

// Initialize WhatsApp Service
initWhatsApp(io);

// API routes
app.use('/api', mainRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    appLogger.error('Error:', err);
    res.status(err.status || 500).json({
        error: config.isDevelopment ? err.message : 'Internal Server Error'
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    appLogger.info('Socket connected:', socket.id);
    
    const userId = socket.handshake.query.userId as string;
    if (userId) {
        socket.join(userId);
        appLogger.info(`Socket user ${userId} joined their room`);
    }

    socket.on('disconnect', () => {
        appLogger.info('Socket disconnected:', socket.id);
    });

    // Handle errors
    socket.on('error', (error) => {
        appLogger.error('Socket error:', error);
    });
});

// Start server
server.listen(config.port, () => {
    console.log(`
🚀 Server is running!
📝 Mode: ${config.nodeEnv}
🌐 HTTP: ${config.isDevelopment ? 'http://localhost:' : 'https://your-domain:'}${config.port}
🔌 WebSocket: ${config.isDevelopment ? 'ws://localhost:' : 'wss://your-domain:'}${config.port}
    `);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    appLogger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    appLogger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

export default app;
