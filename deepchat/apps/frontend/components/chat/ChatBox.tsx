import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarioButton } from '@deepchat/ui';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'other';
  text: string;
  timestamp: Date;
  isAiGenerated?: boolean;
}

interface ChatBoxProps {
  lineId: string;
  userId: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isAiEnabled: boolean;
  onToggleAi: () => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  lineId,
  userId,
  messages,
  onSendMessage,
  isAiEnabled,
  onToggleAi
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const playMarioSound = (type: 'send' | 'receive' | 'ai') => {
    if (typeof window !== 'undefined') {
      const soundMap = {
        send: '/sounds/mario-jump.wav',
        receive: '/sounds/mario-coin.wav',
        ai: '/sounds/mario-power-up.wav'
      };
      
      const audio = new Audio(soundMap[type]);
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio errors
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    
    // Send user message
    onSendMessage(userMessage);
    playMarioSound('send');

    // If AI is enabled, get AI response
    if (isAiEnabled) {
      setIsLoading(true);
      try {
        const response = await axios.post('/api/ai/chat', {
          message: userMessage,
          userId,
          lineId,
          context: {
            recentMessages: messages.slice(-5) // Last 5 messages for context
          }
        });

        if (response.data.response) {
          // Add AI response to chat
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: response.data.response,
            timestamp: new Date(),
            isAiGenerated: true
          };
          
          // Simulate typing delay
          setTimeout(() => {
            onSendMessage(aiMessage.text);
            playMarioSound('ai');
            toast.success('🤖 Mario AI پاسخ داد!', {
              icon: '🍄',
              duration: 2000
            });
          }, 1000);
        }
      } catch (error) {
        console.error('AI response error:', error);
        toast.error('خطا در دریافت پاسخ AI', {
          icon: '❌'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';
    const isAi = message.sender === 'ai';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-red-500 text-white' // Mario red for user
              : isAi
              ? 'bg-yellow-400 text-red-800 border-2 border-red-500' // Mario power-up colors for AI
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {isAi && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm font-bold">🍄 Mario AI</span>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs"
              >
                ⭐
              </motion.span>
            </div>
          )}
          <p className="text-sm">{message.text}</p>
          <p className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString('fa-IR')}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* AI Toggle Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            🎮 DeepChat Mario
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm">AI پاسخ‌دهی</span>
            <button
              onClick={onToggleAi}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAiEnabled ? 'bg-yellow-400' : 'bg-gray-300'
              }`}
            >
              <motion.span
                animate={{ x: isAiEnabled ? 20 : 2 }}
                className={`inline-block h-4 w-4 rounded-full transition-transform ${
                  isAiEnabled ? 'bg-red-600' : 'bg-white'
                }`}
              />
            </button>
            {isAiEnabled && (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-yellow-300"
              >
                🍄
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-blue-50 to-blue-100 min-h-0">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-yellow-400 text-red-800 px-4 py-2 rounded-lg border-2 border-red-500">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🍄
                </motion.span>
                <span className="text-sm">Mario AI در حال تایپ...</span>
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="flex gap-1"
                >
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isAiEnabled ? "پیام شما... (Mario AI پاسخ خواهد داد 🍄)" : "پیام شما..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={isLoading}
          />
          <MarioButton
            type="submit"
            variant="primary"
            disabled={!newMessage.trim() || isLoading}
            icon="🚀"
            sound={true}
          >
            ارسال
          </MarioButton>
        </div>
        
        {isAiEnabled && (
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <span>🍄</span>
            Mario AI فعال است و به پیام‌های شما پاسخ خواهد داد
          </p>
        )}
      </form>
    </div>
  );
};