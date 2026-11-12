'use client';

import { useState } from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
}

export default function ServiceModal({ isOpen, onClose, serviceTitle }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    serviceType: serviceTitle || 'Architectural Design',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceType: formData.serviceType || serviceTitle,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
      } else {
        setError(data.message || 'Failed to submit service inquiry.');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200">
        {/* Header */}
        <div className="bg-amber-900 text-white p-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Request Service</h3>
            <p className="text-amber-200 text-sm mt-1">{serviceTitle || 'Consultation & Custom Design'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-amber-300 hover:text-white p-1 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-amber-900 mb-2">Request Received!</h4>
              <p className="text-amber-700 mb-6">
                Thank you! Our design team has received your inquiry for{' '}
                <strong>{serviceTitle}</strong> and will contact you within 1 business day.
              </p>
              <button
                onClick={onClose}
                className="bg-amber-700 hover:bg-amber-800 text-white font-medium px-6 py-2.5 rounded-lg transition cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+251 9..."
                    className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Service Selected
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  <option value="Architectural Design">Architectural Design</option>
                  <option value="Custom Furniture">Custom Furniture</option>
                  <option value="Full Renovation">Full Renovation</option>
                  <option value="Space Planning">Space Planning</option>
                  <option value="Lighting Design">Lighting Design</option>
                  <option value="Styling Consultation">Styling Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Project Details / Requirements *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your space, timeline, and vision..."
                  className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium transition disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
