# 🎮 DeepChat 2.0 - Mario AI Marketing Platform

**پلتفرم هوشمند مارکتینگ پیام‌رسانی با تم Mario برای بازارهای نوظهور**

![DeepChat 2.0](https://img.shields.io/badge/Version-2.0-red?style=for-the-badge&logo=nintendo-switch)
![Mario Theme](https://img.shields.io/badge/Theme-Mario-yellow?style=for-the-badge)
![Iran Ready](https://img.shields.io/badge/Iran-Ready-green?style=for-the-badge)

## ✨ ویژگی‌های کلیدی

### 🤖 **Mario AI Agent**
- پردازش پیام‌های طبیعی فارسی
- یادگیری از تعاملات کاربران
- پاسخ‌دهی خودکار با شخصیت Mario
- پشتیبانی از OpenAI GPT-4 و Pinecone

### 🎯 **سیستم گیمیفیکیشن**
- سطح‌بندی Mario (Level 1-100)
- سکه‌های Mario برای فعالیت‌ها
- مدال‌ها و جوایز
- انیمیشن‌های تعاملی

### 🇮🇷 **محلی‌سازی ایران**
- درگاه پرداخت ZarinPal
- تقویم جلالی
- پشتیبانی از پروکسی
- رابط کاربری راست به چپ

### 💬 **پیام‌رسانی چندکاناله**
- WhatsApp Business API
- Telegram Bot
- مدیریت کمپین‌های هوشمند
- تحلیل عملکرد

## 🚀 راه‌اندازی سریع

### پیش‌نیازها
```bash
- Node.js 18+
- Docker & Docker Compose
- MongoDB
- Redis
```

### 1. کلون و نصب
```bash
git clone https://github.com/your-org/deepchat-2.0.git
cd deepchat-2.0
npm install
```

### 2. تنظیم متغیرهای محیطی
```bash
cp .env.sample .env
# ویرایش فایل .env با کلیدهای API شما
```

### 3. اجرای Docker
```bash
docker-compose up --build
```

### 4. دسترسی به برنامه
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Agent**: http://localhost:3002

## 📁 ساختار پروژه

```
deepchat-2.0/
├── apps/
│   ├── frontend/          # Next.js React App
│   ├── backend/           # Express.js API
│   └── agent/             # AI Agent Service
├── packages/
│   ├── ui/                # Mario UI Components
│   ├── config/            # Configuration
│   └── shared-types/      # TypeScript Types
├── docs/                  # Documentation
└── docker-compose.yml     # Docker Configuration
```

## 🎨 کامپوننت‌های Mario UI

### MarioButton
```tsx
import { MarioButton } from '@deepchat/ui';

<MarioButton 
  variant="primary" 
  icon="🍄" 
  sound={true}
  onClick={handleClick}
>
  کلیک کنید!
</MarioButton>
```

### MarioProgressBar
```tsx
import { MarioProgressBar } from '@deepchat/ui';

<MarioProgressBar 
  current={75} 
  total={100} 
  variant="xp"
  showAnimation={true} 
/>
```

### MarioCoinCounter
```tsx
import { MarioCoinCounter } from '@deepchat/ui';

<MarioCoinCounter 
  count={150} 
  showAnimation={true} 
/>
```

## 🔧 تنظیمات

### متغیرهای محیطی ضروری
```env
# AI Configuration
OPENAI_API_KEY=sk-your-key-here
PINECONE_API_KEY=your-pinecone-key

# Messaging
WHATSAPP_API_KEY=your-whatsapp-key
TELEGRAM_BOT_TOKEN=your-telegram-token

# Iran Payment
ZARINPAL_MERCHANT_ID=your-zarinpal-id

# Database
MONGODB_URI=mongodb://localhost:27017/deepchat
REDIS_URL=redis://localhost:6379
```

## 🚀 استقرار Production

### Docker Compose
```bash
# تولید فایل‌های production
npm run build

# اجرای production
docker-compose -f docker-compose.yml up -d
```

### Manual Deploy
```bash
# Backend
cd apps/backend
npm run build
npm start

# Frontend
cd apps/frontend
npm run build
npm start

# Agent
cd apps/agent
npm run build
npm start
```

## 📊 مانیتورینگ

### Health Checks
- **Backend**: `GET /api/health`
- **Frontend**: `GET /api/health`
- **Agent**: `GET /api/ai/status`

### Logs
```bash
# مشاهده لاگ‌ها
docker-compose logs -f

# لاگ‌های سرویس خاص
docker-compose logs -f backend
docker-compose logs -f agent
```

## 🔐 امنیت

### JWT Authentication
- احراز هویت با JWT Token
- انقضای خودکار نشست
- محافظت از API endpoints

### Rate Limiting
- محدودیت درخواست برای API
- محافظت از حملات DDoS
- کش Redis برای بهینه‌سازی

## 🧪 تست

### اجرای تست‌ها
```bash
# تمام تست‌ها
npm test

# تست‌های backend
npm run test:backend

# تست‌های frontend
npm run test:frontend

# تست‌های E2E
npm run test:e2e
```

## 🤝 مشارکت

1. Fork کنید
2. برنچ feature بسازید: `git checkout -b feature/amazing-feature`
3. تغییرات را commit کنید: `git commit -m 'Add amazing feature'`
4. Push کنید: `git push origin feature/amazing-feature`
5. Pull Request بسازید

## 📝 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است. فایل [LICENSE](LICENSE) را برای جزئیات بیشتر مطالعه کنید.

## 🎯 نقشه راه

### نسخه 2.1 (Q1 2024)
- [ ] پشتیبانی از Instagram Direct
- [ ] تحلیل‌های پیشرفته
- [ ] یکپارچگی با CRM خارجی

### نسخه 2.2 (Q2 2024)
- [ ] پشتیبانی از صدا و تصویر
- [ ] AI بهتر برای زبان فارسی
- [ ] پنل مدیریت پیشرفته

## 🆘 پشتیبانی

### مستندات
- [راهنمای API](docs/API.md)
- [راهنمای کامپوننت‌ها](docs/COMPONENTS.md)
- [راهنمای استقرار](docs/DEPLOYMENT.md)

### ارتباط
- **Email**: support@deepchat.ir
- **Telegram**: @deepchat_support
- **GitHub Issues**: [Issues](https://github.com/your-org/deepchat-2.0/issues)

---

<div align="center">
  <p>ساخته شده با ❤️ برای بازارهای نوظهور</p>
  <p>🍄 Powered by Mario AI 🍄</p>
</div>