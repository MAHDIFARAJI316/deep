import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    AuthenticationCreds,
    SignalKeyStore,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { Server as SocketIOServer } from 'socket.io';
import pino from 'pino';
import qrcode from 'qrcode';
import { logger as appLogger } from 'utils';
import User from '@backend/models/User';
import WhatsappSession from '@backend/models/WhatsappSession';
import Message from '@backend/models/Message';
import CustomerProfile from '@backend/models/CustomerProfile';
import { IAuthRequest } from '@backend/middlewares/authMiddleware';

const sessions = new Map<string, any>();
let io: SocketIOServer;

const sessionExists = (sessionId: string) => sessions.has(sessionId);

const createSession = (sessionId: string, socket: any) => {
    sessions.set(sessionId, socket);
};

const getSession = (sessionId: string) => sessions.get(sessionId);

const deleteSession = (sessionId: string) => {
    sessions.delete(sessionId);
};

const replacer = (key: any, value: any) => {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()),
        };
    }
    if (value instanceof Buffer) {
        return {
            dataType: 'Buffer',
            value: value.toString('base64'),
        };
    }
    return value;
};

const reviver = (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
        if (value.dataType === 'Buffer') {
            return Buffer.from(value.value, 'base64');
        }
    }
    return value;
};

const useMongoDBAuthState = async (sessionId: string): Promise<{ state: { creds: AuthenticationCreds; keys: SignalKeyStore }; saveCreds: () => Promise<void> }> => {
    const sessionDoc = await WhatsappSession.findOne({ sessionId });

    let initialData: { creds: any, keys: any };
    if (sessionDoc && sessionDoc.sessionData) {
        initialData = JSON.parse(sessionDoc.sessionData, reviver);
    } else {
        initialData = { creds: null, keys: {} };
    }

    const { state, saveCreds } = await useMultiFileAuthState(initialData as any);

    const customSaveCreds = async () => {
        const sessionData = JSON.stringify({ creds: state.creds, keys: state.keys }, replacer);
        await WhatsappSession.updateOne({ sessionId }, { sessionData }, { upsert: true });
        await saveCreds();
    };

    return { state, saveCreds: customSaveCreds };
};

export const initWhatsApp = (socketIO: SocketIOServer) => {
    io = socketIO;
};

export const startWhatsAppSession = async (req: IAuthRequest, lineId: string) => {
    const user = req.user!;
    const sessionId = `${user._id}-${lineId}`;

    if (sessionExists(sessionId)) {
        throw new Error('Session already exists.');
    }

    const { state, saveCreds } = await useMongoDBAuthState(sessionId);

    const socket = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
    });

    createSession(sessionId, socket);

    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            const qrCodeUrl = await qrcode.toDataURL(qr);
            io.to(user._id.toString()).emit('qr', { lineId, qr: qrCodeUrl });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            appLogger.info(`Connection closed for ${sessionId}, reconnecting: ${shouldReconnect}`);
            deleteSession(sessionId);

            if (shouldReconnect) {
                // Potentially add reconnection logic here
            } else {
                await WhatsappSession.deleteOne({ sessionId });
            }
        } else if (connection === 'open') {
            appLogger.info(`WhatsApp connection opened for ${sessionId}`);
            const line = user.whatsappLines.find(l => l.lineId === lineId);
            if(line){
                line.isconnected = true;
                line.phoneNumber = state.creds.me.id.split(':')[0];
                await user.save();
            }
            io.to(user._id.toString()).emit('whatsapp.status', { lineId, status: 'connected', phoneNumber: line?.phoneNumber });
        }
    });

    socket.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            if (msg.message && !msg.key.fromMe) { // Only process incoming messages
                const chatId = msg.key.remoteJid!;
                const customerPhone = chatId.split('@')[0];

                // Find or create a customer profile
                let customer = await CustomerProfile.findOne({ phone: customerPhone });
                if (!customer) {
                    customer = new CustomerProfile({
                        phone: customerPhone,
                        lineId: lineId,
                        assignedTo: user._id,
                    });
                }
                customer.lastInteraction = new Date();
                await customer.save();
                
                const messageText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
                if (!messageText) continue;

                const newMessage = new Message({
                    lineId,
                    customerId: customer._id,
                    chatId,
                    senderId: chatId, // The customer sent it
                    messageId: msg.key.id,
                    text: messageText,
                    timestamp: new Date(Number(msg.messageTimestamp) * 1000),
                });

                try {
                    await newMessage.save();
                    io.to(user._id.toString()).emit('message.new', newMessage);
                } catch (e) {
                    // Avoid crashing on duplicate messageId
                    if (!(e instanceof Error && e.message.includes('duplicate key'))) {
                       appLogger.error('Failed to save message:', e);
                    }
                }
            }
        }
    });

    socket.ev.on('creds.update', saveCreds);

    return { message: 'WhatsApp session initiated.' };
};

export const getLinesStatus = async (req: IAuthRequest) => {
    return req.user!.whatsappLines.map(line => ({
        lineId: line.lineId,
        isConnected: line.isconnected,
        phoneNumber: line.phoneNumber
    }));
}; 