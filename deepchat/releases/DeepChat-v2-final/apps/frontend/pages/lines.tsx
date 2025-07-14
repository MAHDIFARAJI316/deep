import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import QRCode from 'qrcode.react';
import { motion } from 'framer-motion';
import DefaultLayout from '@/layouts/DefaultLayout';

interface ILine {
    lineId: string;
    isConnected: boolean;
    phoneNumber: string | null;
}

const LinesPage = () => {
    const [lines, setLines] = useState<ILine[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [qrCode, setQrCode] = useState<{ lineId: string, qr: string } | null>(null);

    // This would come from your auth context in a real app
    const MOCK_USER_ID = "some-user-id-from-auth-context"; 

    useEffect(() => {
        // Fetch initial line statuses
        const fetchLines = async () => {
            const res = await fetch('/api/whatsapp/status'); // You need to proxy this
            if (res.ok) {
                setLines(await res.json());
            }
        };
        fetchLines();

        // Connect to socket
        const newSocket = io('http://localhost:5000', {
            query: { userId: MOCK_USER_ID }
        });
        setSocket(newSocket);

        newSocket.on('qr', (data) => {
            setQrCode({ lineId: data.lineId, qr: data.qr });
        });

        newSocket.on('whatsapp.status', (data) => {
            setLines(prevLines =>
                prevLines.map(line =>
                    line.lineId === data.lineId ? { ...line, isConnected: data.status === 'connected', phoneNumber: data.phoneNumber } : line
                )
            );
            if (data.status === 'connected') {
                setQrCode(null); // Clear QR on successful connection
            }
        });

        return () => {
            newSocket.close();
        };
    }, [MOCK_USER_ID]);


    const handleConnect = async () => {
        setQrCode(null);
        const res = await fetch('/api/whatsapp/connect', { method: 'POST' }); // You need to proxy this
        if(res.ok){
            const data = await res.json();
            // The QR will arrive via socket, but we can set up a placeholder
            console.log("Connection initiated for line:", data.lineId)
        }
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Manage WhatsApp Lines</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {lines.map(line => (
                        <div key={line.lineId} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{line.phoneNumber || `Line ${line.lineId.substring(0, 4)}`}</p>
                                <p className="text-sm text-gray-500">Status:</p>
                            </div>
                            <motion.div className="flex items-center space-x-2">
                                <motion.div
                                    animate={{ backgroundColor: line.isConnected ? '#22c55e' : '#ef4444' }}
                                    className="w-4 h-4 rounded-full"
                                />
                                <span>{line.isConnected ? 'Connected' : 'Disconnected'}</span>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {lines.length < 2 && (
                    <button onClick={handleConnect} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Connect New Line
                    </button>
                )}

                {qrCode && (
                    <div className="mt-6 p-4 border rounded-lg text-center">
                        <h2 className="text-xl font-bold mb-2">Scan to Connect Line</h2>
                        <QRCode value={qrCode.qr} size={256} />
                        <p className="mt-2 text-gray-600">Scan this QR code with your WhatsApp app.</p>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default LinesPage; 