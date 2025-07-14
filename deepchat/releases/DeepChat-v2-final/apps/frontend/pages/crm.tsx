import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/DefaultLayout';

// Mock data, replace with API calls
const MOCK_CUSTOMERS = [
    { _id: '1', phone: '09123456789', name: 'John Doe', tags: ['Lead'], status: 'New', lastInteraction: new Date() },
    { _id: '2', phone: '09876543210', name: 'Jane Smith', tags: ['VIP', 'Interested'], status: 'Contacted', lastInteraction: new Date() },
];

const CRMPage = () => {
    const router = useRouter();
    const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // API call to fetch customers would go here, with search/filter queries
        // fetch(`/api/customers?search=${search}`).then(...)
    }, [search]);

    const tagColor: { [key: string]: string } = {
        Lead: 'bg-blue-200 text-blue-800',
        VIP: 'bg-yellow-200 text-yellow-800',
        Blocked: 'bg-red-200 text-red-800',
        Interested: 'bg-green-200 text-green-800',
        Cold: 'bg-gray-200 text-gray-800',
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Customer Relationship Management</h1>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by phone..."
                        className="w-full p-2 border rounded"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* Add filter dropdowns here */}
                </div>

                <div className="bg-white shadow-md rounded">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Phone</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Tags</th>
                                <th className="px-6 py-3 text-left">Last Interaction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr
                                    key={customer._id}
                                    className="border-b hover:bg-gray-100 cursor-pointer"
                                    onClick={() => router.push(`/crm/${customer._id}`)}
                                >
                                    <td className="px-6 py-4">{customer.name}</td>
                                    <td className="px-6 py-4">{customer.phone}</td>
                                    <td className="px-6 py-4">{customer.status}</td>
                                    <td className="px-6 py-4">
                                        {customer.tags.map(tag => (
                                            <span key={tag} className={`px-2 py-1 text-xs rounded-full mr-2 ${tagColor[tag] || 'bg-gray-200'}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">{new Date(customer.lastInteraction).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default CRMPage; 