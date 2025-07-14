import { Schema, model, Document, Types } from 'mongoose';

type MessageStatus = 'sent' | 'delivered' | 'read';

export interface IMessage extends Document {
    lineId: string;
    customerId: Types.ObjectId; // Reference to CustomerProfile
    chatId: string; // The contact's phone number (e.g., '1234567890@s.whatsapp.net')
    senderId: string; // Who sent the message (our number or contact's)
    messageId: string; // The unique ID from WhatsApp
    text: string;
    timestamp: Date;
    status: MessageStatus;
}

const MessageSchema = new Schema<IMessage>({
    lineId: { type: String, required: true, index: true },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'CustomerProfile',
        required: true,
        index: true,
    },
    chatId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    messageId: { type: String, required: true, unique: true },
    text: { type: String, required: true },
    timestamp: { type: Date, required: true },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
    },
});

const Message = model<IMessage>('Message', MessageSchema);

export default Message; 