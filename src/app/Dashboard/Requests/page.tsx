'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaCouch, FaPhone, FaEnvelope, FaCalendar, FaClock, FaTrash, FaClipboard, FaEye, FaTools } from 'react-icons/fa';

interface FurnitureItem {
  id?: string;
  _id?: string;
  furniture_name: string;
  furniture_type: string;
  furniture_price: number;
}

interface FurnitureRequestItem {
  id: string;
  _id?: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  notes?: string;
  status: string;
  createdAt: string;
  furniture?: FurnitureItem;
  ordered_furniture?: FurnitureItem;
}

interface ServiceRequestItem {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function RequestsPage() {
  const [tab, setTab] = useState<'furniture' | 'services'>('furniture');
  const [furnitureRequests, setFurnitureRequests] = useState<FurnitureRequestItem[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFurnitureReq, setSelectedFurnitureReq] = useState<FurnitureRequestItem | null>(null);
  const [selectedServiceReq, setSelectedServiceReq] = useState<ServiceRequestItem | null>(null);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const [orderRes, serviceRes] = await Promise.all([
        fetch('/api/orders', { credentials: 'include' }),
        fetch('/api/services', { credentials: 'include' }),
      ]);

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setFurnitureRequests(orderData.data || []);
      }

      if (serviceRes.ok) {
        const serviceData = await serviceRes.json();
        setServiceRequests(serviceData.data || []);
      }
    } catch (err: any) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAllRequests();
        if (selectedFurnitureReq) {
          setSelectedFurnitureReq({ ...selectedFurnitureReq, status: newStatus });
        }
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order request?')) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedFurnitureReq(null);
        fetchAllRequests();
      }
    } catch (err) {
      alert('Error deleting request');
    }
  };

  const handleUpdateServiceStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAllRequests();
        if (selectedServiceReq) {
          setSelectedServiceReq({ ...selectedServiceReq, status: newStatus });
        }
      }
    } catch (err) {
      alert('Error updating service status');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service inquiry?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedServiceReq(null);
        fetchAllRequests();
      }
    } catch (err) {
      alert('Error deleting service request');
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return { date: 'N/A', time: 'N/A' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Inquiries & Requests</h1>
          <p className="text-amber-700 mt-1">Manage incoming furniture orders and service consultations</p>
        </div>

        {/* Tab switch */}
        <div className="bg-amber-100 p-1 rounded-xl flex space-x-1 border border-amber-200">
          <button
            onClick={() => setTab('furniture')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === 'furniture'
                ? 'bg-amber-800 text-white shadow-sm'
                : 'text-amber-800 hover:bg-amber-200'
            }`}
          >
            Furniture Orders ({furnitureRequests.length})
          </button>
          <button
            onClick={() => setTab('services')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === 'services'
                ? 'bg-amber-800 text-white shadow-sm'
                : 'text-amber-800 hover:bg-amber-200'
            }`}
          >
            Service Inquiries ({serviceRequests.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {/* Furniture Requests Tab */}
      {tab === 'furniture' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
          <table className="min-w-full divide-y divide-amber-100">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Requested Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-100">
              {furnitureRequests.map((req) => {
                const item = req.furniture || req.ordered_furniture;
                const { date, time } = formatDateTime(req.createdAt);
                const reqId = req.id || req._id || '';

                return (
                  <tr key={reqId} className="hover:bg-amber-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-amber-100 p-2.5 rounded-lg mr-3">
                          <FaUser className="text-amber-700" />
                        </div>
                        <div>
                          <div className="font-semibold text-amber-900">{req.fullName || 'Customer'}</div>
                          <div className="text-amber-700 text-xs">{req.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-amber-100 p-2.5 rounded-lg mr-3">
                          <FaCouch className="text-amber-700" />
                        </div>
                        <div>
                          <div className="font-medium text-amber-900">{item?.furniture_name || 'Furniture Piece'}</div>
                          <div className="text-amber-700 text-xs">{item?.furniture_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-amber-700 text-sm">
                      <div className="flex items-center">
                        <FaPhone className="mr-2 text-amber-600 text-xs" />
                        <span>{req.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        req.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        req.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                        req.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-amber-700 text-xs">
                      <div>{date}</div>
                      <div className="text-amber-500">{time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedFurnitureReq(req)}
                        className="text-amber-700 hover:text-amber-900 mr-3 cursor-pointer"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(reqId)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Delete Request"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {furnitureRequests.length === 0 && (
            <div className="text-center py-12">
              <FaClipboard className="text-4xl text-amber-400 mx-auto mb-2" />
              <p className="text-amber-700">No furniture order requests received yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Service Consultations Tab */}
      {tab === 'services' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
          <table className="min-w-full divide-y divide-amber-100">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Service Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-100">
              {serviceRequests.map((svc) => {
                const { date, time } = formatDateTime(svc.createdAt);
                return (
                  <tr key={svc.id} className="hover:bg-amber-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-amber-100 p-2.5 rounded-lg mr-3">
                          <FaUser className="text-amber-700" />
                        </div>
                        <div>
                          <div className="font-semibold text-amber-900">{svc.fullName}</div>
                          <div className="text-amber-700 text-xs">{svc.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center font-medium text-amber-900">
                        <FaTools className="mr-2 text-amber-600" />
                        {svc.serviceType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-amber-700 text-sm">
                      <div className="flex items-center">
                        <FaPhone className="mr-2 text-amber-600 text-xs" />
                        <span>{svc.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        svc.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        svc.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        svc.status === 'CONTACTED' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {svc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-amber-700 text-xs">
                      <div>{date}</div>
                      <div className="text-amber-500">{time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedServiceReq(svc)}
                        className="text-amber-700 hover:text-amber-900 mr-3 cursor-pointer"
                        title="View Inquiry"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDeleteService(svc.id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {serviceRequests.length === 0 && (
            <div className="text-center py-12">
              <FaTools className="text-4xl text-amber-400 mx-auto mb-2" />
              <p className="text-amber-700">No custom service inquiries received yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Furniture Request Modal */}
      {selectedFurnitureReq && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Furniture Order Request</h2>
            <div className="space-y-3 bg-amber-50 p-4 rounded-xl text-sm border border-amber-200">
              <p><strong>Customer:</strong> {selectedFurnitureReq.fullName || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedFurnitureReq.email}</p>
              <p><strong>Phone:</strong> {selectedFurnitureReq.phoneNumber}</p>
              <p><strong>Furniture:</strong> {selectedFurnitureReq.furniture?.furniture_name || selectedFurnitureReq.ordered_furniture?.furniture_name}</p>
              <p><strong>Category:</strong> {selectedFurnitureReq.furniture?.furniture_type || selectedFurnitureReq.ordered_furniture?.furniture_type}</p>
              {selectedFurnitureReq.notes && <p><strong>Notes:</strong> {selectedFurnitureReq.notes}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-amber-900 mb-1">Update Status</label>
              <div className="flex gap-2">
                {['PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrderStatus(selectedFurnitureReq.id || selectedFurnitureReq._id || '', st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedFurnitureReq.status === st
                        ? 'bg-amber-800 text-white'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-amber-100">
              <button
                onClick={() => setSelectedFurnitureReq(null)}
                className="px-5 py-2 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-50 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Request Modal */}
      {selectedServiceReq && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Service Consultation Inquiry</h2>
            <div className="space-y-3 bg-amber-50 p-4 rounded-xl text-sm border border-amber-200">
              <p><strong>Client Name:</strong> {selectedServiceReq.fullName}</p>
              <p><strong>Email:</strong> {selectedServiceReq.email}</p>
              <p><strong>Phone:</strong> {selectedServiceReq.phoneNumber}</p>
              <p><strong>Service Type:</strong> {selectedServiceReq.serviceType}</p>
              <div>
                <strong>Message / Scope:</strong>
                <p className="mt-1 text-amber-800 bg-white p-3 rounded-lg border border-amber-200 whitespace-pre-line">
                  {selectedServiceReq.message}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-amber-900 mb-1">Update Status</label>
              <div className="flex gap-2 flex-wrap">
                {['PENDING', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateServiceStatus(selectedServiceReq.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedServiceReq.status === st
                        ? 'bg-amber-800 text-white'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-amber-100">
              <button
                onClick={() => setSelectedServiceReq(null)}
                className="px-5 py-2 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-50 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}