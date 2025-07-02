import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    openaiApiKey: process.env.OPENAI_API_KEY,
    jwtSecret: process.env.JWT_SECRET || 'a-super-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
}; 