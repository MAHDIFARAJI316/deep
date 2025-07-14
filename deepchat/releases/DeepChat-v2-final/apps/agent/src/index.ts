import express from 'express';
import dotenv from 'dotenv';
import { AIService } from './services/AIService';
import { RAGService } from './services/RAGService';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.AGENT_PORT || 3002;

// Middleware
app.use(express.json());

// Services
const aiService = new AIService();
const ragService = new RAGService();

// Routes
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userId, context } = req.body;
    
    // Get relevant context from RAG
    const relevantContext = await ragService.getRelevantContext(message, userId);
    
    // Generate AI response
    const response = await aiService.generateResponse(message, {
      ...context,
      ragContext: relevantContext
    });
    
    res.json({ response, context: relevantContext });
  } catch (error) {
    logger.error('AI chat error:', error);
    res.status(500).json({ error: 'خطا در پردازش پیام' });
  }
});

app.post('/api/ai/train', async (req, res) => {
  try {
    const { documents, userId } = req.body;
    
    await ragService.trainModel(documents, userId);
    
    res.json({ success: true, message: 'مدل با موفقیت آموزش داده شد' });
  } catch (error) {
    logger.error('AI training error:', error);
    res.status(500).json({ error: 'خطا در آموزش مدل' });
  }
});

app.get('/api/ai/status', (req, res) => {
  res.json({ 
    status: 'running',
    version: '2.0.0',
    theme: 'mario',
    services: {
      ai: aiService.isReady(),
      rag: ragService.isReady()
    }
  });
});

app.listen(PORT, () => {
  logger.info(`🎮 DeepChat 2.0 AI Agent running on port ${PORT}`);
  logger.info('🍄 Mario theme activated!');
});