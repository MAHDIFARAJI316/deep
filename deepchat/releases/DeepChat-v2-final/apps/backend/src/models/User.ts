import { Schema, model, Document } from 'mongoose';

export interface IAIProfile {
    onboardingAnswers: Map<string, string>; // question -> answer
    isTrained: boolean;
}

export interface IWhatsAppLine {
    lineId: string;
    isconnected: boolean;
    phoneNumber: string | null;
    isAiEnabled: boolean;
}

export interface IGamificationStats {
    xp: number;
    level: number;
    coins: number;
    streakDays: number;
    badges: string[];
    lastActivityDate: Date;
}

export interface IUser extends Document {
    phone: string;
    role: 'user' | 'admin';
    otp: string | null;
    otpExpires: Date | null;
    isVerified: boolean;
    createdAt: Date;
    whatsappLines: IWhatsAppLine[];
    aiProfile: IAIProfile;
    gamificationStats: IGamificationStats;
}

const AIProfileSchema = new Schema<IAIProfile>({
    onboardingAnswers: { type: Map, of: String },
    isTrained: { type: Boolean, default: false },
});

const GamificationStatsSchema = new Schema<IGamificationStats>({
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    coins: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    lastActivityDate: { type: Date, default: Date.now },
});

const WhatsAppLineSchema = new Schema<IWhatsAppLine>({
    lineId: { type: String, required: true },
    isconnected: { type: Boolean, default: false },
    phoneNumber: { type: String, default: null },
    isAiEnabled: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>({
    phone: {
        type: String,
        required: true,
        unique: true,
        // Simple regex for Iranian phone numbers
        match: [/^09\d{9}$/, 'Please fill a valid Iranian phone number'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    whatsappLines: {
        type: [WhatsAppLineSchema],
        validate: [(v: IWhatsAppLine[]) => v.length <= 2, 'Cannot add more than 2 WhatsApp lines.'],
    },
    aiProfile: {
        type: AIProfileSchema,
        default: () => ({ isTrained: false, onboardingAnswers: new Map() }),
    },
    gamificationStats: {
        type: GamificationStatsSchema,
        default: () => ({ xp: 0, level: 1, coins: 0, streakDays: 0, badges: [], lastActivityDate: new Date() }),
    }
});

const User = model<IUser>('User', UserSchema);

export default User; 