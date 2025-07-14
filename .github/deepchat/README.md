# DeepChat

A modern chat application with WhatsApp integration and AI capabilities.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm (v10 or later)
- MongoDB (v4.4 or later)
- OpenAI API key

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/deepchat.git
   cd deepchat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp apps/backend/.env.example apps/backend/.env
   ```
   Edit the `.env` file and fill in your development values.

4. **Start development servers**
   ```bash
   # Start all services in development mode
   npm run dev
   ```

   The development server will be available at:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

### Production Deployment

1. **Set up production environment**
   ```bash
   # Create production environment file
   cp apps/backend/.env.example apps/backend/.env.production
   ```
   Edit `.env.production` with your production values:
   - Set `NODE_ENV=production`
   - Use secure `JWT_SECRET`
   - Set proper `CORS_ORIGIN`
   - Configure production database URL
   - Add production API keys

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Start production server**
   ```bash
   NODE_ENV=production npm start
   ```

## 📁 Project Structure

```
deepchat/
├── apps/
│   ├── backend/         # Node.js backend
│   └── frontend/        # React frontend
├── packages/
│   ├── tsconfig/       # Shared TypeScript config
│   └── utils/          # Shared utilities
└── package.json        # Root package.json
```

## 🔒 Security Features

- CORS protection
- Rate limiting
- Helmet security headers
- JWT authentication
- Environment-based configuration
- Error handling
- Secure logging

## 🛠 Configuration

The application uses different configurations for development and production:

### Development
- Hot reloading enabled
- Detailed error messages
- Relaxed CORS
- Higher rate limits
- Local MongoDB

### Production
- Optimized build
- Generic error messages
- Strict CORS
- Lower rate limits
- Production database
- Compression enabled
- Security headers

## 📝 Environment Variables

Key environment variables:

- `NODE_ENV`: Environment mode (`development`/`production`)
- `PORT`: Server port
- `DATABASE_URL`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key
- `JWT_SECRET`: JWT signing secret
- `CORS_ORIGIN`: Allowed CORS origin

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Dependencies

### Backend
- Express.js
- Socket.IO
- MongoDB/Mongoose
- JWT
- OpenAI SDK

### Frontend
- React
- Socket.IO Client
- Tailwind CSS
- TypeScript

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
