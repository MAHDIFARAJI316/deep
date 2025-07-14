import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage {
    sender: Types.ObjectId | 'ai';
    content: string;
    timestamp: Date;
    type: 'text' | 'image' | 'file';
    metadata?: {
        fileName?: string;
        fileSize?: number;
        mimeType?: string;
        url?: string;
    };
}

export interface IChat extends Document {
    userId: Types.ObjectId;
    title: string;
    messages: IMessage[];
    isActive: boolean;
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    sender: {
        type: Schema.Types.Mixed,
        required: true,
        validate: {
            validator: function(v: any) {
                return Types.ObjectId.isValid(v) || v === 'ai';
            },
            message: 'Sender must be either a valid ObjectId or "ai"'
        }
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    metadata: {
        fileName: String,
        fileSize: Number,
        mimeType: String,
        url: String
    }
}, { _id: false }); // Disable _id for subdocuments to improve performance

const ChatSchema = new Schema<IChat>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Add index for faster queries
    },
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'New Chat'
    },
    messages: [MessageSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
});

// Update lastMessageAt when a new message is added
ChatSchema.pre<IChat>('save', function(next) {
    if (this.isModified('messages')) {
        this.lastMessageAt = new Date();
    }
    next();
});

// Add indexes for common queries
ChatSchema.index({ userId: 1, lastMessageAt: -1 });
ChatSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IChat>('Chat', ChatSchema); 