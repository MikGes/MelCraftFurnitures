// components/sections/ServicesSection.tsx
'use client';

import { useState } from 'react';
import { FaHome, FaChair, FaPaintBrush, FaBed, FaStar, FaLightbulb as FaIdeal } from 'react-icons/fa';
import ServiceModal from '@/app/ui/ServiceModal';

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    { icon: <FaHome className="text-white text-2xl" />, title: 'Architectural Design', desc: 'Transform your home into a sanctuary of comfort and style with our bespoke architectural design services.' },
    { icon: <FaChair className="text-white text-2xl" />, title: 'Custom Furniture', desc: 'Commission unique, handcrafted furniture pieces designed exclusively for your space and needs.' },
    { icon: <FaPaintBrush className="text-white text-2xl" />, title: 'Full Renovation', desc: 'Complete interior renovation services from concept to completion with our expert design team.' },
    { icon: <FaBed className="text-white text-2xl" />, title: 'Space Planning', desc: 'Optimize your space with intelligent layouts that maximize functionality and aesthetic appeal.' },
    { icon: <FaIdeal className="text-white text-2xl" />, title: 'Lighting Design', desc: 'Create ambiance and highlight architectural features with our specialized lighting solutions.' },
    { icon: <FaStar className="text-white text-2xl" />, title: 'Styling Consultation', desc: 'Refresh your space with expert styling advice and curated product selections.' },
  ];

  return (
    <section id="services" className="py-16 bg-amber-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900">Our Premium Services</h2>
          <p className="mt-4 text-amber-700 max-w-2xl mx-auto">
            We offer comprehensive interior solutions tailored to your unique space and style preferences.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              onClick={() => setSelectedService(service.title)}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <div className="w-16 h-16 bg-amber-700 rounded-lg flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">{service.title}</h3>
              <p className="text-amber-700">{service.desc}</p>
              <button
                type="button"
                className="mt-4 text-sm font-semibold text-amber-700 hover:text-amber-900 inline-block cursor-pointer"
              >
                Request Service →
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedService && (
        <ServiceModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          serviceTitle={selectedService}
        />
      )}
    </section>
  );
}