FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/*/package*.json ./packages/*/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/frontend ./apps/frontend
COPY packages ./packages

# Build the application
WORKDIR /app/apps/frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]