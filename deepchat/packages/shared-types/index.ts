// Example shared interface
export interface Message {
    id: string;
    text: string;
    timestamp: number;
    channel: 'WhatsApp' | 'Telegram';
}

export interface UserProfile {
    id: string;
    name: string;
    avatarUrl?: string;
} 