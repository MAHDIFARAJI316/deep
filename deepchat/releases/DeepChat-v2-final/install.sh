#!/bin/bash
echo "🍄 Installing DeepChat 2.0 - Mario AI Marketing Platform"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed"
    exit 1
fi

# Copy environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys"
fi

# Create directories
mkdir -p apps/frontend/public/sounds
mkdir -p apps/backend/logs
mkdir -p apps/backend/uploads
mkdir -p apps/agent/logs

# Build and start
echo "🚀 Building and starting DeepChat 2.0..."
docker-compose up --build -d

echo "✅ DeepChat 2.0 installed successfully!"
echo "�� Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🤖 AI Agent: http://localhost:3002"
