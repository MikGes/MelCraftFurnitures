// app/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Section Components
import HeroSection from './components/sections/HeroSection';
import ServicesSection from './components/sections/ServicesSection';
import AboutSection from './components/sections/AboutSection';
import ContactSection from './components/sections/ContactSection';
import NewsletterSection from './components/sections/NewsLetterSection';

// UI Components
import ProductCard from './ui/ProductCard';
import ProductModal from './ui/ProductModal';

interface FurnitureItem {
  id?: string;
  _id?: string;
  furniture_name: string;
  furniture_type: string;
  furniture_price?: string | number;
  furniture_description: string;
  special_description?: string;
  furniture_image?: string;
}

interface ContactForm {
  name?: string;
  email: string;
  phone: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  Sofa: 'Sofas & Seating',
  Bed: 'Beds & Bedrooms',
  Book_Shelf: 'Book Shelves & Units',
  Shoe_Rack: 'Shoe Racks & Entryway',
  Floating_Shelf: 'Floating Shelves',
  Wardrobe: 'Wardrobes & Closets',
  Kitchen_Cabinet: 'Kitchen Cabinets & Islands',
};

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<FurnitureItem | null>(null);
  const [furnitures, setFurnitures] = useState<FurnitureItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [contactForm, setContactForm] = useState<ContactForm>({ email: '', phone: '' });
  const [formErrors, setFormErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const getFurniture = async () => {
      try {
        const res = await fetch('/api/furniture');
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setFurnitures(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch furniture:', err);
      }
    };
    getFurniture();

    const handleScroll = () => {
      const sections = ['home', 'products', 'services', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Group items category by category
  const categorizedFurniture = useMemo(() => {
    return furnitures.reduce((acc: Record<string, FurnitureItem[]>, item) => {
      const category = item.furniture_type || 'Uncategorized';
      acc[category] = acc[category] || [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [furnitures]);

  // List of unique categories present in the data
  const categoryKeys = useMemo(() => {
    return Object.keys(categorizedFurniture);
  }, [categorizedFurniture]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const openProductModal = (product: FurnitureItem) => {
    setSelectedProduct(product);
    setContactForm({ email: '', phone: '' });
    setFormErrors({});
    setSubmitSuccess(false);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  const validateForm = () => {
    const errors: Partial<ContactForm> = {};
    if (!contactForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedProduct) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: contactForm.name || undefined,
          email: contactForm.email || `${contactForm.phone}@guest.melcraft.com`,
          phone: contactForm.phone,
          furnitureId: selectedProduct.id || selectedProduct._id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
      } else {
        alert(data.message || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      alert('Unable to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ContactForm]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof ContactForm];
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      <Header
        activeSection={activeSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrollToSection={scrollToSection}
      />

      <main>
        <HeroSection
          onViewProducts={() => scrollToSection('products')}
          onContactClick={() => scrollToSection('contact')}
        />

        <div className="py-8 bg-yellow-100">
          <NewsletterSection />
        </div>

        {/* Shop By Category - Displayed Category by Category on the UI */}
        <div id="products" className="py-16 px-4 bg-amber-900 text-white">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Shop by Category</h2>
              <p className="text-amber-200 max-w-2xl mx-auto text-sm md:text-base">
                Discover our handcrafted furniture collections arranged category by category. Select a collection or browse our full showcase below.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-12 gap-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                  selectedCategory === 'ALL'
                    ? 'bg-amber-700 text-white shadow-md'
                    : 'bg-amber-800/80 text-amber-200 hover:bg-amber-700/80 hover:text-white'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] bg-amber-900/80 px-2 py-0.5 rounded-full">
                  {furnitures.length}
                </span>
              </button>

              {categoryKeys.map((catKey) => {
                const count = categorizedFurniture[catKey]?.length || 0;
                const isActive = selectedCategory === catKey;
                const displayName = CATEGORY_NAMES[catKey] || catKey.replace(/_/g, ' ');

                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                      isActive
                        ? 'bg-amber-700 text-white shadow-md'
                        : 'bg-amber-800/80 text-amber-200 hover:bg-amber-700/80 hover:text-white'
                    }`}
                  >
                    <span>{displayName}</span>
                    <span className="text-[11px] bg-amber-900/80 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Category by Category Presentation on UI */}
            {selectedCategory === 'ALL' ? (
              <div className="space-y-16">
                {categoryKeys.map((catKey) => {
                  const items = categorizedFurniture[catKey] || [];
                  const displayName = CATEGORY_NAMES[catKey] || catKey.replace(/_/g, ' ');

                  return (
                    <div key={catKey} className="bg-amber-950/40 p-6 sm:p-8 rounded-2xl border border-amber-800/60">
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-6 pb-3 border-b border-amber-800">
                        <div className="flex items-center space-x-3">
                          <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                            {displayName}
                          </h3>
                        </div>
                        <span className="text-xs sm:text-sm text-amber-300 font-medium">
                          {items.length} {items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>

                      {/* Products Grid for this Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((product) => (
                          <ProductCard
                            key={product.id || product._id || Math.random().toString()}
                            product={product}
                            onViewDetails={() => openProductModal(product)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Single Selected Category View */
              <div className="bg-amber-950/40 p-6 sm:p-8 rounded-2xl border border-amber-800/60">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-amber-800">
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {CATEGORY_NAMES[selectedCategory] || selectedCategory.replace(/_/g, ' ')} Collection
                    </h3>
                  </div>
                  <span className="text-xs sm:text-sm text-amber-300 font-medium">
                    {categorizedFurniture[selectedCategory]?.length || 0} items
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizedFurniture[selectedCategory]?.map((product) => (
                    <ProductCard
                      key={product.id || product._id || Math.random().toString()}
                      product={product}
                      onViewDetails={() => openProductModal(product)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <ServicesSection />
        <AboutSection />
        <ContactSection />

        <div className="py-8 bg-yellow-100">
          <NewsletterSection />
        </div>
      </main>

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={closeProductModal}
          contactForm={contactForm}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          submitSuccess={submitSuccess}
          onInputChange={handleInputChange}
          onSubmit={handleContactSubmit}
        />
      )}
    </div>
  );
}