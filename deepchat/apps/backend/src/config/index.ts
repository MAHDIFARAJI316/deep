import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Validates that a required environment variable exists
 * @param name - The name of the environment variable
 * @param value - The value of the environment variable
 * @returns The validated value
 * @throws Error if the variable is missing or empty
 */
function validateRequiredEnvVar(name: string, value: string | undefined): string {
    if (!value || value.trim() === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value.trim();
}

/**
 * Gets an optional environment variable with a default value
 * @param name - The name of the environment variable
 * @param defaultValue - The default value to use if the variable is not set
 * @returns The environment variable value or the default value
 */
function getOptionalEnvVar(name: string, defaultValue: string): string {
    return process.env[name]?.trim() || defaultValue;
}

/**
 * Application configuration object
 * All configuration values are validated and immutable
 */
export const config = Object.freeze({
    // Server configuration
    port: parseInt(getOptionalEnvVar('PORT', '5000'), 10),
    nodeEnv: getOptionalEnvVar('NODE_ENV', 'development'),
    
    // Database configuration
    database: {
        url: validateRequiredEnvVar('DATABASE_URL', process.env.DATABASE_URL),
    },
    
    // External API keys
    openai: {
        apiKey: validateRequiredEnvVar('OPENAI_API_KEY', process.env.OPENAI_API_KEY),
    },
    
    // JWT configuration
    jwt: {
        secret: getOptionalEnvVar('JWT_SECRET', 'a-super-secret-key'),
        expiresIn: getOptionalEnvVar('JWT_EXPIRES_IN', '1d'),
    },
    
    // CORS configuration
    cors: {
        origin: getOptionalEnvVar('CORS_ORIGIN', 'http://localhost:3000'),
        credentials: true,
    },
    
    // Development mode check
    isDevelopment: getOptionalEnvVar('NODE_ENV', 'development') === 'development',
    isProduction: getOptionalEnvVar('NODE_ENV', 'development') === 'production',
    isTest: getOptionalEnvVar('NODE_ENV', 'development') === 'test',
} as const);

// Validate configuration on module load
if (isNaN(config.port) || config.port <= 0) {
    throw new Error('PORT must be a valid positive number');
}

// Log configuration in development (without sensitive data)
if (config.isDevelopment) {
    console.log('🔧 Configuration loaded:', {
        port: config.port,
        nodeEnv: config.nodeEnv,
        isDevelopment: config.isDevelopment,
        corsOrigin: config.cors.origin,
        // Never log sensitive data like API keys or database URLs
    });
} 