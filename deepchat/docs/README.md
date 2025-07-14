# 🎮 DeepChat 2.0 - مستندات کامل

## 🌟 معرفی
DeepChat 2.0 یک پلتفرم SaaS پیشرفته برای پیام‌رسانی خودکار با تم Mario است که به‌طور خاص برای بازارهای نوظهور، به‌ویژه ایران طراحی شده است.

## 🏗️ معماری

### ساختار Monorepo
```
deepchat/
├── apps/
│   ├── frontend/     # Next.js با تم Mario
│   ├── backend/      # Express/NestJS
│   ├── agent/        # مدیریت AI
│   └── cli/          # ابزارهای CLI
├── packages/
│   ├── ui/           # کامپوننت‌های Mario
│   ├── config/       # تنظیمات متمرکز
│   └── lib/          # ابزارهای کمکی
└── docs/             # مستندات
```

## 🎯 ویژگی‌های کلیدی

### 🎮 تم Mario
- **رنگ‌بندی**: قرمز و سفید Mario
- **انیمیشن‌ها**: پرش Mario، جمع‌آوری سکه
- **صداها**: افکت‌های صوتی Mario
- **آواتارها**: Mario, Luigi, Peach

### 🏆 گیمیفیکیشن
- **سیستم XP**: 10 XP برای کمپین موفق
- **نشان‌ها**: Campaign Master, Customer Whisperer
- **سطح‌بندی**: 1-100 با آیکون‌های Mario

### 🇮🇷 بومی‌سازی ایران
- **پرداخت**: ادغام ZarinPal
- **تقویم**: پشتیبانی از تقویم پارسی
- **زبان**: RTL کامل برای فارسی
- **پروکسی**: پشتیبانی از پروکسی‌های محلی

## 🚀 راه‌اندازی

### پیش‌نیازها
```bash
node >= 18.0.0
npm >= 8.0.0
```

### نصب
```bash
# Clone repository
git clone https://github.com/deepchat/deepchat-2.0.git
cd deepchat

# Install dependencies
npm install

# Setup environment
cp apps/backend/.env.sample apps/backend/.env
cp apps/frontend/.env.sample apps/frontend/.env
```

### اجرا
```bash
# Development
npm run dev

# Build
npm run build

# Test
npm run test
```

## 📱 اپلیکیشن‌ها

### Frontend (Next.js)
- **تکنولوژی**: Next.js 14, React 18, Tailwind CSS
- **ویژگی‌ها**: SSR, PWA, RTL Support
- **تم**: Mario UI Components

### Backend (Express/NestJS)
- **تکنولوژی**: Node.js, Express, TypeScript
- **دیتابیس**: MongoDB, Redis
- **احراز هویت**: JWT, OTP

### Agent (AI Service)
- **تکنولوژی**: OpenAI GPT-4, Pinecone
- **ویژگی‌ها**: RAG, Smart Replies
- **زبان**: پشتیبانی چندزبانه

## 🔧 تنظیمات

### متغیرهای محیطی
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/deepchat
REDIS_URL=redis://localhost:6379

# AI
OPENAI_API_KEY=sk-your-key
PINECONE_API_KEY=your-key

# Messaging
WHATSAPP_API_KEY=your-key
TELEGRAM_BOT_TOKEN=your-token

# Payment (Iran)
ZARINPAL_MERCHANT_ID=your-id
```

## 🎨 UI Components

### MarioButton
```tsx
import { MarioButton } from '@deepchat/ui';

<MarioButton 
  variant="primary" 
  icon="🍄"
  sound={true}
  onClick={() => console.log('Mario jump!')}
>
  شروع کمپین
</MarioButton>
```

### MarioProgressBar
```tsx
import { MarioProgressBar } from '@deepchat/ui';

<MarioProgressBar 
  value={750}
  max={1000}
  variant="xp"
  label="تجربه"
/>
```

## 🔌 API

### Authentication
```bash
POST /api/auth/login
POST /api/auth/verify-otp
GET /api/auth/profile
```

### Campaigns
```bash
GET /api/campaigns
POST /api/campaigns
PUT /api/campaigns/:id
DELETE /api/campaigns/:id
```

### AI Chat
```bash
POST /api/ai/chat
POST /api/ai/train
GET /api/ai/status
```

## 🌍 بین‌المللی‌سازی

### زبان‌های پشتیبانی‌شده
- **فارسی** (fa) - اصلی
- **انگلیسی** (en)
- **عربی** (ar)
- **اسپانیایی** (es)

### تقویم
- **پارسی** (جلالی) - پیش‌فرض
- **میلادی** (گرگوری)

## 🔒 امنیت

### احراز هویت
- JWT با انقضای کوتاه‌مدت
- OTP از طریق SMS/Telegram
- Multi-factor Authentication

### رمزنگاری
- TLS 1.3 برای ارتباطات
- AES-256 برای داده‌های حساس
- Hash شده passwords با bcrypt

## 📊 مانیتورینگ

### لاگ‌گیری
- Winston برای لاگ‌های ساختاریافته
- سطوح مختلف: error, warn, info, debug
- ذخیره در فایل و console

### متریک‌ها
- Prometheus برای جمع‌آوری
- Grafana برای نمایش
- هشدارهای خودکار

## 🧪 تست

### انواع تست
```bash
# Unit Tests
npm run test:unit

# Integration Tests
npm run test:integration

# E2E Tests
npm run test:e2e
```

## 🚀 استقرار

### Docker
```bash
# Build images
docker-compose build

# Run services
docker-compose up -d
```

### Kubernetes
```bash
# Deploy to cluster
kubectl apply -f k8s/
```

## 🤝 مشارکت

### راهنمای توسعه
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

### استانداردهای کد
- ESLint برای JavaScript/TypeScript
- Prettier برای فرمت‌بندی
- Husky برای pre-commit hooks

## 📞 پشتیبانی

### مستندات
- [API Documentation](./api.md)
- [UI Components](./ui.md)
- [Deployment Guide](./deployment.md)

### تماس
- **ایمیل**: support@deepchat.ir
- **تلگرام**: @deepchat_support
- **GitHub**: [Issues](https://github.com/deepchat/deepchat-2.0/issues)

## 📄 مجوز
MIT License - برای جزئیات بیشتر فایل LICENSE را مطالعه کنید.

---

🎮 **ساخته شده با ❤️ و تم Mario برای بازارهای نوظهور**