# DeepChat - AI-Powered Messaging Automation

This is the monorepo for DeepChat, an AI-powered multi-channel messaging automation system for WhatsApp and Telegram.

## 🗂️ Monorepo Structure

This monorepo is managed by [Turborepo](https://turbo.build/) and [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

- `apps/frontend`: Next.js application
- `apps/backend`: Express.js application
- `packages/shared-types`: Shared TypeScript interfaces
- `packages/ai-agent`: OpenAI integration logic
- `packages/utils`: Shared utility functions
- `packages/eslint-config-custom`: Shared ESLint configuration
- `packages/tsconfig`: Shared TypeScript configurations
- `infrastructure`: Docker and environment configuration
- `tests`: End-to-end and integration tests

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Validation**: Zod
- **AI**: OpenAI SDK
- **Monorepo**: Turborepo
- **Testing**: Playwright (frontend), Jest & Supertest (backend)
- **Tooling**: ESLint, Prettier, Husky, lint-staged

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/) (v8 or later)
- [Docker](https://www.docker.com/products/docker-desktop) (optional, for containerized development)

### 2. Installation

Clone the repository and install the dependencies.

```bash
git clone <repository-url>
cd deepchat
npm install
```

### 3. Environment Variables

You will need to create `.env` files for the frontend and backend applications based on the provided `.env.example` files.

- `cp apps/frontend/.env.example apps/frontend/.env`
- `cp apps/backend/.env.example apps/backend/.env`

Update the `.env` files with your specific configuration (e.g., database connection strings, API keys).

### 4. Running the Development Servers

To start the development servers for both the frontend and backend, run the following command from the root of the monorepo:

```bash
npm run dev
```

- The frontend will be available at [http://localhost:3000](http://localhost:3000).
- The backend will be available at [http://localhost:5000](http://localhost:5000).

## 🧪 Running Tests

- **Run all tests**: `npm test`
- **Run frontend tests**: `npm test -- --filter=frontend`
- **Run backend tests**: `npm test -- --filter=backend`

## Linting and Formatting

- **Lint all packages**: `npm run lint`
- **Format all files**: `npm run format`
Linting and formatting are also configured to run automatically on pre-commit. 