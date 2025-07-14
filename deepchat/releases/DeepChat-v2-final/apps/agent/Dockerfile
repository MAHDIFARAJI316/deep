FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/agent/package*.json ./apps/agent/
COPY packages/*/package*.json ./packages/*/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/agent ./apps/agent
COPY packages ./packages

# Build the application
WORKDIR /app/apps/agent
RUN npm run build

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/api/ai/status || exit 1

# Start the application
CMD ["npm", "start"]