import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

// Schema validation for environment variables
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  
  // Server Configuration
  PORT: Joi.number().default(3000),
  AGENT_PORT: Joi.number().default(3002),
  
  // Database
  MONGODB_URI: Joi.string().required(),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),
  
  // Authentication
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  
  // AI Services
  OPENAI_API_KEY: Joi.string().required(),
  PINECONE_API_KEY: Joi.string().required(),
  PINECONE_ENVIRONMENT: Joi.string().required(),
  PINECONE_INDEX_NAME: Joi.string().required(),
  
  // Messaging Services
  WHATSAPP_API_KEY: Joi.string().required(),
  TELEGRAM_BOT_TOKEN: Joi.string().required(),
  
  // Payment (Iran)
  ZARINPAL_MERCHANT_ID: Joi.string().required(),
  ZARINPAL_CALLBACK_URL: Joi.string().required(),
  
  // Proxy Support
  PROXY_HOST: Joi.string().optional(),
  PROXY_PORT: Joi.number().optional(),
  PROXY_USERNAME: Joi.string().optional(),
  PROXY_PASSWORD: Joi.string().optional(),
  
  // Logging
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
});

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  agentPort: envVars.AGENT_PORT,
  
  database: {
    mongodb: envVars.MONGODB_URI,
    redis: envVars.REDIS_URL,
  },
  
  auth: {
    jwtSecret: envVars.JWT_SECRET,
    jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  },
  
  ai: {
    openaiApiKey: envVars.OPENAI_API_KEY,
    pinecone: {
      apiKey: envVars.PINECONE_API_KEY,
      environment: envVars.PINECONE_ENVIRONMENT,
      indexName: envVars.PINECONE_INDEX_NAME,
    },
  },
  
  messaging: {
    whatsapp: {
      apiKey: envVars.WHATSAPP_API_KEY,
    },
    telegram: {
      botToken: envVars.TELEGRAM_BOT_TOKEN,
    },
  },
  
  payment: {
    zarinpal: {
      merchantId: envVars.ZARINPAL_MERCHANT_ID,
      callbackUrl: envVars.ZARINPAL_CALLBACK_URL,
    },
  },
  
  proxy: {
    host: envVars.PROXY_HOST,
    port: envVars.PROXY_PORT,
    username: envVars.PROXY_USERNAME,
    password: envVars.PROXY_PASSWORD,
  },
  
  logging: {
    level: envVars.LOG_LEVEL,
  },
  
  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
  },
  
  // Mario Theme Configuration
  theme: {
    name: 'mario',
    colors: {
      primary: '#E53E3E', // Mario Red
      secondary: '#3182CE', // Mario Blue
      accent: '#F6E05E', // Mario Yellow
      success: '#38A169', // Mario Green
    },
    sounds: {
      jump: '/sounds/mario-jump.wav',
      coin: '/sounds/mario-coin.wav',
      levelUp: '/sounds/mario-level-up.wav',
      powerUp: '/sounds/mario-power-up.wav',
    },
  },
  
  // Iran-specific Configuration
  localization: {
    defaultLanguage: 'fa',
    supportedLanguages: ['fa', 'en', 'ar', 'es'],
    calendar: 'persian',
    currency: 'IRR',
    timezone: 'Asia/Tehran',
  },
  
  // Gamification Settings
  gamification: {
    xp: {
      campaignSuccess: 10,
      customerInteraction: 5,
      messagesSent: 1,
    },
    levels: {
      max: 100,
      xpPerLevel: 100,
    },
    badges: {
      campaignMaster: { requirement: 100, icon: '🏆' },
      customerWhisperer: { requirement: 500, icon: '💬' },
      marioExpert: { requirement: 1000, icon: '🍄' },
    },
  },
};

export default config;