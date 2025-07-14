// MongoDB Initialization Script for DeepChat 2.0
// This script sets up the database with initial data and indexes

db = db.getSiblingDB('deepchat');

// Create collections
db.createCollection('users');
db.createCollection('messages');
db.createCollection('campaigns');
db.createCollection('whatsappsessions');
db.createCollection('payments');
db.createCollection('achievements');

// Create indexes for better performance
db.users.createIndex({ "phone": 1 }, { unique: true });
db.users.createIndex({ "whatsappLines.lineId": 1 });
db.users.createIndex({ "gamificationStats.level": -1 });
db.users.createIndex({ "gamificationStats.xp": -1 });

db.messages.createIndex({ "lineId": 1, "timestamp": -1 });
db.messages.createIndex({ "senderId": 1, "timestamp": -1 });
db.messages.createIndex({ "isAiGenerated": 1 });

db.campaigns.createIndex({ "userId": 1, "status": 1 });
db.campaigns.createIndex({ "createdAt": -1 });

db.whatsappsessions.createIndex({ "sessionId": 1 }, { unique: true });
db.whatsappsessions.createIndex({ "userId": 1 });

db.payments.createIndex({ "userId": 1, "status": 1 });
db.payments.createIndex({ "transactionId": 1 }, { unique: true });

db.achievements.createIndex({ "userId": 1, "type": 1 });

// Insert sample admin user
db.users.insertOne({
    phone: "+989123456789",
    role: "admin",
    otp: null,
    otpExpires: null,
    isVerified: true,
    createdAt: new Date(),
    whatsappLines: [],
    aiProfile: {
        onboardingAnswers: {},
        isTrained: false
    },
    gamificationStats: {
        xp: 1000,
        level: 10,
        coins: 500,
        streakDays: 30,
        badges: ["admin", "founder", "mario-expert"],
        lastActivityDate: new Date()
    }
});

// Insert sample achievements
db.achievements.insertMany([
    {
        type: "first-message",
        title: "اولین پیام",
        description: "اولین پیام خود را ارسال کردید",
        icon: "📨",
        xpReward: 10,
        coinReward: 5
    },
    {
        type: "ai-expert",
        title: "متخصص AI",
        description: "100 پیام با AI تبادل کردید",
        icon: "🤖",
        xpReward: 100,
        coinReward: 50
    },
    {
        type: "campaign-master",
        title: "استاد کمپین",
        description: "10 کمپین موفق اجرا کردید",
        icon: "🎯",
        xpReward: 200,
        coinReward: 100
    },
    {
        type: "streak-warrior",
        title: "جنگجوی پیاپی",
        description: "30 روز متوالی فعال بودید",
        icon: "🔥",
        xpReward: 300,
        coinReward: 150
    },
    {
        type: "level-10",
        title: "سطح 10",
        description: "به سطح 10 رسیدید",
        icon: "⭐",
        xpReward: 0,
        coinReward: 100
    },
    {
        type: "level-25",
        title: "سطح 25",
        description: "به سطح 25 رسیدید",
        icon: "🌟",
        xpReward: 0,
        coinReward: 250
    },
    {
        type: "level-50",
        title: "سطح 50",
        description: "به سطح 50 رسیدید",
        icon: "💫",
        xpReward: 0,
        coinReward: 500
    }
]);

print("🍄 DeepChat 2.0 database initialized successfully!");
print("📊 Collections created with indexes");
print("👤 Admin user created: +989123456789");
print("🏆 Achievement system configured");
print("🎮 Mario gamification ready!");