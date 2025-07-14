import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DefaultLayout from '@/layouts/DefaultLayout';
import { MarioButton } from '@/components/mario/MarioButton';
import { MarioProgressBar } from '@/components/mario/MarioProgressBar';
import { MarioCoinCounter } from '@/components/mario/MarioCoinCounter';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface UserStats {
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  badges: string[];
  lastActivityDate: string;
}

interface DashboardData {
  user: {
    phone: string;
    role: string;
    gamificationStats: UserStats;
  };
  campaigns: {
    active: number;
    completed: number;
    total: number;
  };
  messages: {
    sent: number;
    received: number;
    aiGenerated: number;
  };
  whatsappLines: {
    connected: number;
    total: number;
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      setData(response.data);
      
      // Check for level up celebration
      const currentLevel = response.data.user.gamificationStats.level;
      const storedLevel = localStorage.getItem('lastKnownLevel');
      
      if (storedLevel && parseInt(storedLevel) < currentLevel) {
        setShowLevelUpModal(true);
        playMarioSound('level-up');
      }
      
      localStorage.setItem('lastKnownLevel', currentLevel.toString());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('خطا در بارگذاری داده‌ها');
    } finally {
      setLoading(false);
    }
  };

  const playMarioSound = (type: 'coin' | 'level-up' | 'power-up') => {
    if (typeof window !== 'undefined') {
      const soundMap = {
        coin: '/sounds/mario-coin.wav',
        'level-up': '/sounds/mario-level-up.wav',
        'power-up': '/sounds/mario-power-up.wav'
      };
      
      const audio = new Audio(soundMap[type]);
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore audio errors
      });
    }
  };

  const calculateNextLevelXP = (currentLevel: number): number => {
    return currentLevel * 100;
  };

  const getBadgeIcon = (badge: string): string => {
    const badgeMap: { [key: string]: string } = {
      'first-message': '📨',
      'ai-expert': '🤖',
      'campaign-master': '🎯',
      'streak-warrior': '🔥',
      'coin-collector': '🪙',
      'level-10': '⭐',
      'level-25': '🌟',
      'level-50': '💫',
      'whatsapp-pro': '💚',
      'telegram-master': '🔵'
    };
    return badgeMap[badge] || '🏆';
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl"
          >
            🍄
          </motion.div>
        </div>
      </DefaultLayout>
    );
  }

  if (!data) {
    return (
      <DefaultLayout>
        <div className="text-center p-8">
          <p className="text-red-600">خطا در بارگذاری داده‌ها</p>
          <MarioButton onClick={fetchDashboardData} variant="primary">
            تلاش مجدد
          </MarioButton>
        </div>
      </DefaultLayout>
    );
  }

  const { user, campaigns, messages, whatsappLines } = data;
  const stats = user.gamificationStats;

  return (
    <DefaultLayout>
      <div className="p-6 bg-gradient-to-br from-blue-50 to-red-50 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            🎮 DeepChat Mario Dashboard
          </h1>
          <p className="text-gray-600">سلام {user.phone}! به دنیای Mario خوش آمدید</p>
        </motion.div>

        {/* Gamification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Level & XP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">سطح Mario</h3>
              <span className="text-3xl">🍄</span>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {stats.level}
              </div>
              <p className="text-sm text-gray-600">سطح فعلی</p>
            </div>
            <MarioProgressBar
              current={stats.xp % 100}
              total={100}
              variant="xp"
              showAnimation={true}
            />
            <p className="text-xs text-center text-gray-500 mt-2">
              {stats.xp} XP / {calculateNextLevelXP(stats.level)} XP
            </p>
          </motion.div>

          {/* Coins */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">سکه‌های Mario</h3>
              <span className="text-3xl">🪙</span>
            </div>
            <MarioCoinCounter count={stats.coins} showAnimation={true} />
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">روزهای پیاپی</h3>
              <span className="text-3xl">🔥</span>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {stats.streakDays}
              </div>
              <p className="text-sm text-gray-600">روز متوالی</p>
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🏆 مدال‌های Mario
          </h3>
          <div className="flex flex-wrap gap-3">
            {stats.badges.length > 0 ? (
              stats.badges.map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-4 py-2 text-white font-semibold shadow-lg"
                >
                  <span className="mr-2">{getBadgeIcon(badge)}</span>
                  {badge.replace('-', ' ')}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 italic">هنوز مدالی کسب نکرده‌اید. شروع کنید!</p>
            )}
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">کمپین‌ها</h4>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">فعال:</span>
                <span className="font-semibold text-green-600">{campaigns.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">تکمیل شده:</span>
                <span className="font-semibold text-blue-600">{campaigns.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">کل:</span>
                <span className="font-semibold text-gray-800">{campaigns.total}</span>
              </div>
            </div>
          </motion.div>

          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">پیام‌ها</h4>
              <span className="text-2xl">💬</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ارسالی:</span>
                <span className="font-semibold text-blue-600">{messages.sent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">دریافتی:</span>
                <span className="font-semibold text-green-600">{messages.received}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">AI:</span>
                <span className="font-semibold text-purple-600">{messages.aiGenerated}</span>
              </div>
            </div>
          </motion.div>

          {/* WhatsApp Lines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">خطوط WhatsApp</h4>
              <span className="text-2xl">💚</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">متصل:</span>
                <span className="font-semibold text-green-600">{whatsappLines.connected}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">کل:</span>
                <span className="font-semibold text-gray-800">{whatsappLines.total}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">اقدامات سریع</h4>
              <span className="text-2xl">⚡</span>
            </div>
            <div className="space-y-3">
              <MarioButton
                variant="primary"
                size="sm"
                onClick={() => window.location.href = '/lines'}
                icon="💚"
              >
                خطوط WhatsApp
              </MarioButton>
              <MarioButton
                variant="secondary"
                size="sm"
                onClick={() => window.location.href = '/crm'}
                icon="👥"
              >
                مدیریت مخاطبین
              </MarioButton>
            </div>
          </motion.div>
        </div>

        {/* Level Up Modal */}
        {showLevelUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                🍄
              </motion.div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">
                سطح جدید!
              </h2>
              <p className="text-gray-600 mb-6">
                تبریک! شما به سطح {stats.level} رسیدید
              </p>
              <MarioButton
                variant="primary"
                onClick={() => setShowLevelUpModal(false)}
                icon="🎉"
              >
                عالی!
              </MarioButton>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;