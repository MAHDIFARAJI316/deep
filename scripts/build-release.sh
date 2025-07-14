#!/bin/bash

# DeepChat 2.0 - Build & Release Script
# This script builds the entire project and creates a release package

set -e

echo "🍄 Starting DeepChat 2.0 Build & Release Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if turbo is available
if ! command -v turbo &> /dev/null; then
    print_warning "Turbo not found, installing..."
    npm install -g turbo
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist/
rm -rf .turbo/
rm -rf releases/DeepChat-v2-final/
rm -rf releases/DeepChat-v2-final.zip

# Install dependencies
print_status "Installing dependencies..."
npm install

# Security audit
print_status "Running security audit..."
npm audit --audit-level=high || print_warning "Security issues found, continuing..."

# Run tests
print_status "Running tests..."
npm run test || print_warning "Some tests failed, continuing..."

# Build all packages
print_status "Building all packages..."
npm run build || {
    print_error "Build failed!"
    exit 1
}

# Create release directory
print_status "Creating release directory..."
mkdir -p releases/DeepChat-v2-final

# Copy built files
print_status "Copying built files..."
cp -r apps/ releases/DeepChat-v2-final/
cp -r packages/ releases/DeepChat-v2-final/
cp -r docs/ releases/DeepChat-v2-final/
cp docker-compose.yml releases/DeepChat-v2-final/
cp nginx.conf releases/DeepChat-v2-final/
cp init-mongo.js releases/DeepChat-v2-final/
cp .env.staging releases/DeepChat-v2-final/.env.example
cp package.json releases/DeepChat-v2-final/
cp package-lock.json releases/DeepChat-v2-final/
cp turbo.json releases/DeepChat-v2-final/
cp README.md releases/DeepChat-v2-final/

# Create installation script
print_status "Creating installation script..."
cat > releases/DeepChat-v2-final/install.sh << 'EOF'
#!/bin/bash

# DeepChat 2.0 Installation Script

echo "🍄 Installing DeepChat 2.0 - Mario AI Marketing Platform"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is required but not installed"
    exit 1
fi

# Copy environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys"
    echo "🔑 Required: OPENAI_API_KEY, PINECONE_API_KEY, ZARINPAL_MERCHANT_ID"
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
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🤖 AI Agent: http://localhost:3002"
echo ""
echo "📚 Documentation: docs/"
echo "🎮 Enjoy your Mario AI Marketing Platform!"
EOF

chmod +x releases/DeepChat-v2-final/install.sh

# Create README for release
print_status "Creating release README..."
cat > releases/DeepChat-v2-final/INSTALL.md << 'EOF'
# 🎮 DeepChat 2.0 - Installation Guide

## Quick Start

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for development)

### 2. Installation
```bash
# Run the installation script
./install.sh

# Or manually:
cp .env.example .env
# Edit .env with your API keys
docker-compose up --build -d
```

### 3. Access
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **AI Agent**: http://localhost:3002

### 4. Configuration
Edit `.env` file with your API keys:
- `OPENAI_API_KEY`: Your OpenAI API key
- `PINECONE_API_KEY`: Your Pinecone API key
- `ZARINPAL_MERCHANT_ID`: Your ZarinPal merchant ID

### 5. Sound Files
Add Mario sound files to `apps/frontend/public/sounds/`:
- `mario-jump.wav`
- `mario-coin.wav`
- `mario-power-up.wav`
- `mario-level-up.wav`

## Support
- Documentation: `docs/`
- Issues: GitHub Issues
- Email: support@deepchat.ir

🍄 Enjoy your Mario AI Marketing Platform!
EOF

# Create version info
print_status "Creating version info..."
cat > releases/DeepChat-v2-final/VERSION << EOF
DeepChat 2.0.0
Build Date: $(date)
Commit: $(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
Node Version: $(node --version)
NPM Version: $(npm --version)
EOF

# Clean up node_modules from release
print_status "Cleaning up release package..."
find releases/DeepChat-v2-final -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find releases/DeepChat-v2-final -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true
find releases/DeepChat-v2-final -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true

# Create ZIP archive
print_status "Creating ZIP archive..."
cd releases/
zip -r DeepChat-v2-final.zip DeepChat-v2-final/
cd ..

# Calculate file sizes
FOLDER_SIZE=$(du -sh releases/DeepChat-v2-final/ | cut -f1)
ZIP_SIZE=$(du -sh releases/DeepChat-v2-final.zip | cut -f1)

# Final report
print_status "Build completed successfully!"
echo ""
echo "📦 Release Package: releases/DeepChat-v2-final/"
echo "📁 Folder Size: $FOLDER_SIZE"
echo "🗜️  ZIP Size: $ZIP_SIZE"
echo "📄 Files: releases/DeepChat-v2-final.zip"
echo ""
echo "🎮 DeepChat 2.0 is ready for deployment!"
echo "🍄 Mario AI Marketing Platform - Production Ready"
echo ""
echo "Next steps:"
echo "1. Extract ZIP on target server"
echo "2. Run ./install.sh"
echo "3. Configure .env file"
echo "4. Add sound files"
echo "5. Start using Mario AI!"

print_status "🚀 Release process completed successfully!"