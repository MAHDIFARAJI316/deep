import express from 'express';
import cors from 'cors';
import { config } from '@deepchat/config';
import { logger } from './utils/logger';
import { aiRoutes } from './routes/ai';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.AGENT_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'deepchat-agent', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🍄 Mario AI Agent running on port ${PORT}`);
  logger.info(`🤖 OpenAI API configured: ${!!config.openai.apiKey}`);
  logger.info(`📊 Pinecone configured: ${!!config.pinecone.apiKey}`);
});

export default app;