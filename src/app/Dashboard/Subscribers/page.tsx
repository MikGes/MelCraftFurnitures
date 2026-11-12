'use client';

import { useState, useEffect } from 'react';
import { FaEnvelope, FaCalendar, FaUser, FaShoppingCart } from 'react-icons/fa';

// Adjusted interface to match your API
interface Subscriber {
    _id: string;
    email: string;
    email_verified: boolean;
    role: string;
    orders: Array<{ _id: string }>;
    createdAt?: string;
    updatedAt?: string;
}

// Derived display interface
interface DisplaySubscriber {
    id: string;
    email: string;
    subscriptionDate: string; // from createdAt or fallback
    status: 'active' | 'unverified';
    orderCount: number;
}

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<DisplaySubscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const res = await fetch('/api/admin/users', {
                  credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch subscribers');
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    const mapped = data.data.map((user: Subscriber): DisplaySubscriber => ({
                        id: user._id,
                        email: user.email,
                        subscriptionDate: user.createdAt
                            ? new Date(user.createdAt).toISOString().split('T')[0]
                            : 'N/A',
                        status: user.email_verified ? 'active' : 'unverified',
                        orderCount: user.orders?.length || 0,
                    }));
                    setSubscribers(mapped);
                } else {
                    setError('Unexpected data format');
                }
            } catch (err) {
                console.error(err);
                setError('Unable to load subscribers');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, []);

    const filteredSubscribers = filterStatus === 'all'
        ? subscribers
        : subscribers.filter(sub => sub.status === filterStatus);

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-amber-900 mb-4">Subscribers</h1>
                <p className="text-amber-700">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-amber-900 mb-4">Subscribers</h1>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-amber-900">Subscribers</h1>
                    <p className="text-amber-700 mt-2">Manage your email subscribers list</p>
                </div>
                <div className="flex space-x-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-amber-300 rounded-lg px-4 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="unverified">Unverified</option>
                    </select>
                    <button className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg font-medium flex items-center">
                        <FaEnvelope className="mr-2" />
                        Send Email
                    </button>
                </div>
            </div>

            {/* Subscribers Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-amber-600 text-sm font-medium">Total Subscribers</p>
                            <p className="text-2xl font-bold text-amber-900 mt-1">{subscribers.length}</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <FaUser className="text-2xl text-amber-700" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-amber-600 text-sm font-medium">Active Subscribers</p>
                            <p className="text-2xl font-bold text-amber-900 mt-1">
                                {subscribers.filter(s => s.status === 'active').length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <FaEnvelope className="text-2xl text-green-700" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-amber-600 text-sm font-medium">Unverified</p>
                            <p className="text-2xl font-bold text-amber-900 mt-1">
                                {subscribers.filter(s => s.status === 'unverified').length}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <FaEnvelope className="text-2xl text-yellow-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
                <table className="min-w-full divide-y divide-amber-100">
                    <thead className="bg-amber-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Subscription Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Orders
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-amber-100">
                        {filteredSubscribers.map((subscriber) => (
                            <tr key={subscriber.id} className="hover:bg-amber-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-amber-900">
                                    {subscriber.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                        subscriber.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-amber-700">
                                    <div className="flex items-center">
                                        <FaCalendar className="mr-2 text-amber-600" />
                                        {subscriber.subscriptionDate}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-amber-700">
                                    <div className="flex items-center">
                                        <FaShoppingCart className="mr-2 text-amber-600" />
                                        {subscriber.orderCount}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredSubscribers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-amber-500 mb-2">
                            <FaUser className="text-4xl mx-auto" />
                        </div>
                        <p className="text-amber-700">No subscribers found</p>
                    </div>
                )}
            </div>
        </div>
    );
}