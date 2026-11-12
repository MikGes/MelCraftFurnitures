// components/sections/HeroSection.tsx
import { FaArrowRight } from 'react-icons/fa';
import HeroLogo from "../../../../public/HeroLogo.png";
import Image from 'next/image';

interface HeroSectionProps {
  onViewProducts: () => void;
  onContactClick: () => void;
}

export default function HeroSection({ onViewProducts, onContactClick }: HeroSectionProps) {
  return (
    <section id="home" className="pt-32 pb-20 md:pt-14 md:pb-28 bg-gradient-to-r from-amber-100 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 leading-tight">
              Crafted Excellence in <span className="text-amber-700">Furniture</span> & <span className="text-amber-700">Interiors</span>
            </h1>
            <p className="mt-6 text-lg text-amber-800 max-w-lg">
              At Melcraft, we transform spaces with timeless designs, premium materials, and artisanal craftsmanship that stands the test of time.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onViewProducts}
                className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center transition duration-300 cursor-pointer"
              >
                View Products <FaArrowRight className="ml-2" />
              </button>
              <button
                onClick={onContactClick}
                className="border-2 border-amber-700 text-amber-800 hover:bg-amber-50 px-8 py-3 rounded-lg font-medium transition duration-300 cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center relative">
            <Image src={HeroLogo} alt="Hero Logo" className="relative" priority />
          </div>
        </div>
      </div>
    </section>
  );
}