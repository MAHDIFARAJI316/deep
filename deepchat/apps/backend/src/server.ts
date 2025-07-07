import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import mainRouter from '@backend/routes';
import { connectDB } from '@backend/config/database';
import { initWhatsApp } from '@backend/services/whatsappService';
import { logger as appLogger } from 'utils';
import { config } from '@backend/config';

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: config.cors.origin,
        credentials: config.cors.credentials,
    }
});

// Initialize WhatsApp Service with socket.io instance
initWhatsApp(io);

app.use(express.json());
app.use(cookieParser());
app.use('/api', mainRouter);

io.on('connection', (socket) => {
    appLogger.info('a user connected to socket');
    
    // Join a room based on user ID for targeted communication
    const userId = socket.handshake.query.userId as string;
    if (userId) {
        socket.join(userId);
        appLogger.info(`Socket user ${userId} joined their room.`);
    }

    socket.on('disconnect', () => {
        appLogger.info('user disconnected from socket');
    });
});

server.listen(config.port, () => {
    console.log(`🚀 Server is running on port ${config.port} in ${config.nodeEnv} mode`);
});

export default app; 