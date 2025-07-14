import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Environment variable validation schema
const envSchema = z.object({
    // Server
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(val => parseInt(val, 10)).default(5000),
    
    // Database
    DATABASE_URL: z.string().min(1, 'Database URL is required'),
    
    // Authentication
    JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
    JWT_EXPIRES_IN: z.string().default('1d'),
    
    // External Services
    OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
    CUSTOMER_EXTERNAL_API_KEY: z.string().min(1, 'Customer API key is required'),
    
    // CORS
    CORS_ORIGIN: z.string().default('http://localhost:3000'),
    
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.string()
        .transform(val => parseInt(val, 10))
        .default(900000), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: z.string()
        .transform(val => parseInt(val, 10))
        .default(100),
});

// Validate environment variables
const validateEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            ).join('\n');
            throw new Error(`Environment validation failed:\n${issues}`);
        }
        throw error;
    }
};

const env = validateEnv();

/**
 * Application configuration object
 * All configuration values are validated and immutable
 */
export const config = Object.freeze({
    // Environment
    nodeEnv: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',

    // Server configuration
    port: env.PORT,
    
    // Database configuration
    database: {
        url: env.DATABASE_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    
    // External API keys
    openai: {
        apiKey: env.OPENAI_API_KEY,
    },

    // Customer configuration
    customer: {
        externalApiKey: env.CUSTOMER_EXTERNAL_API_KEY,
    },
    
    // JWT configuration
    jwt: {
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
    },
    
    // CORS configuration
    cors: {
        origin: env.CORS_ORIGIN,
        credentials: true,
    },
    
    // Rate limiting
    rateLimit: {
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        max: env.RATE_LIMIT_MAX_REQUESTS,
    },
} as const);

// Log configuration in development (without sensitive data)
if (config.isDevelopment) {
    console.log('🔧 Configuration loaded:', {
        nodeEnv: config.nodeEnv,
        port: config.port,
        isDevelopment: config.isDevelopment,
        corsOrigin: config.cors.origin,
        rateLimit: config.rateLimit,
        // Never log sensitive data like API keys or database URLs
    });
}

// Export configuration types
export type Config = typeof config;
export type EnvSchema = z.infer<typeof envSchema>; 