import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/DefaultLayout';

// Mock data, replace with API call
const MOCK_CUSTOMER_DETAIL = {
    customer: { _id: '1', phone: '09123456789', name: 'John Doe', tags: ['Lead'], status: 'New', lastInteraction: new Date() },
    messages: [
        { _id: 'm1', senderId: '09123456789', text: 'Hi, I would like to know the price.', timestamp: new Date() },
        { _id: 'm2', senderId: 'me', text: 'Hello John, our prices start at $50.', timestamp: new Date() },
    ]
};


const CustomerDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [profile, setProfile] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            // API call to fetch customer detail would go here
            // fetch(`/api/customers/${id}`).then(...)
            setProfile(MOCK_CUSTOMER_DETAIL.customer);
            setMessages(MOCK_CUSTOMER_DETAIL.messages);
        }
    }, [id]);

    if (!profile) {
        return <DefaultLayout><div className="p-4">Loading...</div></DefaultLayout>;
    }

    return (
        <DefaultLayout>
            <div className="container mx-auto p-4">
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    <p className="text-gray-600">{profile.phone}</p>
                    {/* Add tag and status editing controls here */}
                </div>

                <h2 className="text-xl font-bold mb-4">Interaction History</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg._id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md px-4 py-2 rounded-lg ${msg.senderId === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                    <p>{msg.text}</p>
                                    <p className="text-xs text-right opacity-75 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default CustomerDetailPage; 