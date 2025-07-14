import { Schema, model } from 'mongoose';

export interface IWhatsappSession {
    sessionId: string; // Format: 'userId-lineId'
    sessionData: string;
}

const WhatsappSessionSchema = new Schema<IWhatsappSession>({
    sessionId: { type: String, required: true, unique: true },
    sessionData: { type: String, required: true },
});

const WhatsappSession = model<IWhatsappSession>('WhatsappSession', WhatsappSessionSchema);

export default WhatsappSession; 