import mongoose from 'mongoose';
import { config } from './index';
import { logger } from 'utils';

export const connectDB = async () => {
    try {
        if (!config.mongoUri) {
            logger.error('MONGO_URI is not defined in the environment variables.');
            process.exit(1);
        }
        await mongoose.connect(config.mongoUri);
        logger.info('MongoDB connected successfully.');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
}; 