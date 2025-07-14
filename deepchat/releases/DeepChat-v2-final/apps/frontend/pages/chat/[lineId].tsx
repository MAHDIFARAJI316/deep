import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import DefaultLayout from '@/layouts/DefaultLayout';
import { ChatBox } from '@/components/chat/ChatBox';

// Mock data, replace with API calls
const MOCK_CHATS = ['+1234567890', '+0987654321', '+5555555555'];
const MOCK_MESSAGES: { [key: string]: any[] } = {
    '+1234567890': [{ id: 1, sender: 'other', text: 'Hello from user 1' }],
    '+0987654321': [{ id: 2, sender: 'other', text: 'Hey from user 2' }],
};

const ChatPage = () => {
    const router = useRouter();
    const { lineId } = router.query;
    const [chats, setChats] = useState<string[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isAiEnabled, setIsAiEnabled] = useState(false);

    useEffect(() => {
        if (lineId) {
            // Fetch chat list for the lineId
            // For now, using mock data
            setChats(MOCK_CHATS);
            if (MOCK_CHATS.length > 0) {
                setActiveChat(MOCK_CHATS[0]);
            }
        }
    }, [lineId]);

    useEffect(() => {
        if (activeChat) {
            // Fetch messages for the active chat
            setMessages(MOCK_MESSAGES[activeChat] || []);
        }
    }, [activeChat]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;
        const sentMessage = { id: Date.now(), sender: 'me', text: newMessage };
        setMessages(prev => [...prev, sentMessage]);
        // API call to send message would go here
        setNewMessage('');
    };

    const handleAiToggle = async () => {
        // API call to toggle AI status would go here
        // await fetch(`/api/ai/toggle/${lineId}`, { method: 'PATCH', body: JSON.stringify({ isEnabled: !isAiEnabled }) });
        setIsAiEnabled(!isAiEnabled);
    };

    return (
        <DefaultLayout>
            <div className="flex h-screen bg-gray-100">
                {/* Left Panel: Chat List */}
                <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold">Chats for {lineId}</h2>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm font-medium text-gray-900">AI Assistant</span>
                            <label className="inline-flex relative items-center cursor-pointer">
                                <input type="checkbox" checked={isAiEnabled} onChange={handleAiToggle} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        {/* Filter buttons would go here */}
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {chats.map(chatId => (
                            <div
                                key={chatId}
                                className={`p-4 cursor-pointer hover:bg-gray-50 ${activeChat === chatId ? 'bg-blue-100' : ''}`}
                                onClick={() => setActiveChat(chatId)}
                            >
                                <p className="font-semibold">{chatId}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Conversation */}
                <div className="w-2/3 flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeChat}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex-grow flex flex-col"
                        >
                            {activeChat ? (
                                <>
                                    <div className="p-4 border-b bg-white flex justify-between items-center">
                                        <h3 className="font-bold">{activeChat}</h3>
                                    </div>
                                    <div className="flex-grow p-4 overflow-y-auto">
                                        {messages.map(msg => (
                                            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-2`}>
                                                <div className={`px-4 py-2 rounded-lg ${
                                                    msg.sender === 'ai' ? 'bg-indigo-500 text-white' : 
                                                    msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                                                }`}>
                                                    {msg.sender === 'ai' && <span className="mr-2">🤖</span>}
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-white border-t">
                                        <form onSubmit={handleSendMessage}>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Type a message..."
                                                value={newMessage}
                                                onChange={e => setNewMessage(e.target.value)}
                                            />
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">Select a chat to start messaging</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ChatPage; 