'use client';

import { useState } from 'react';

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  contactForm?: { name?: string; email?: string; phone: string };
  formErrors?: { name?: string; email?: string; phone?: string };
  isSubmitting?: boolean;
  submitSuccess?: boolean;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  contactForm: propContactForm,
  formErrors: propFormErrors,
  isSubmitting: propIsSubmitting,
  submitSuccess: propSubmitSuccess,
  onInputChange: propOnInputChange,
  onSubmit: propOnSubmit,
}: ProductModalProps) {
  // Local state fallbacks if not provided by parent
  const [localForm, setLocalForm] = useState({ name: '', email: '', phone: '' });
  const [localErrors, setLocalErrors] = useState<{ email?: string; phone?: string }>({});
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [localSuccess, setLocalSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!product || !isOpen) return null;

  const contactForm = propContactForm || localForm;
  const formErrors = propFormErrors || localErrors;
  const isSubmitting = propIsSubmitting !== undefined ? propIsSubmitting : localSubmitting;
  const submitSuccess = propSubmitSuccess !== undefined ? propSubmitSuccess : localSuccess;

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (propOnInputChange) {
      propOnInputChange(e);
    } else {
      setLocalForm({ ...localForm, [e.target.name]: e.target.value });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (propOnSubmit) {
      propOnSubmit(e);
      return;
    }

    const errs: { email?: string; phone?: string } = {};
    if (!contactForm.phone || !contactForm.phone.trim()) {
      errs.phone = 'Phone number is required';
    }
    if (Object.keys(errs).length > 0) {
      setLocalErrors(errs);
      return;
    }

    setLocalSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: contactForm.name || undefined,
          email: contactForm.email || `${contactForm.phone}@guest.melcraft.com`,
          phone: contactForm.phone,
          furnitureId: product._id || product.id,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setLocalSuccess(true);
      } else {
        setSubmitError(data.message || 'Failed to submit request.');
      }
    } catch (err) {
      setSubmitError('Unable to connect to the server. Please check your internet connection.');
    } finally {
      setLocalSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-amber-200 flex justify-between items-center p-6 z-10">
          <h2 className="text-2xl font-bold text-amber-900">{product.furniture_name || product.name}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-amber-100 hover:text-amber-700 shadow-md transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="flex items-center justify-center bg-slate-100 border border-amber-100 rounded-xl w-full h-80 overflow-hidden">
                {product.furniture_image ? (
                  <img
                    src={product.furniture_image}
                    alt={product.furniture_name || "Furniture"}
                    className="object-contain h-full w-full"
                  />
                ) : (
                  <div className="text-amber-800 font-bold text-xl">
                    {(product.furniture_name || '').split(' ')[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2">
              <div className="mb-6">
                <span className="text-amber-700 font-medium">
                  {product.furniture_type || product.category}
                </span>
                {product.furniture_price ? (
                  <h3 className="text-3xl font-bold text-amber-900 mt-2">
                    {product.furniture_price} Birr
                  </h3>
                ) : null}
              </div>
              <p className="text-amber-800 mb-6">
                {product.furniture_description || product.description}
              </p>

              {/* Contact Form */}
              <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900 text-lg mb-4">Request Information</h4>
                {submitSuccess ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-amber-800 font-medium">Thank you!</p>
                    <p className="text-amber-700 mt-2">
                      We'll contact you shortly about {product.furniture_name || product.name}.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg font-medium cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    {submitError && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                        {submitError}
                      </div>
                    )}
                    <div className="mb-4">
                      <label htmlFor="contactEmail" className="block text-amber-800 font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="email"
                        value={contactForm.email || ''}
                        onChange={handleLocalChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white ${
                          formErrors.email ? 'border-red-500' : 'border-amber-300'
                        }`}
                        placeholder="you@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label htmlFor="contactPhone" className="block text-amber-800 font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="phone"
                        required
                        value={contactForm.phone || ''}
                        onChange={handleLocalChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white ${
                          formErrors.phone ? 'border-red-500' : 'border-amber-300'
                        }`}
                        placeholder="0912345678"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-red-500 text-sm">{formErrors.phone}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-medium transition duration-300 flex justify-center items-center cursor-pointer ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Sending Request...' : 'Request Information'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}