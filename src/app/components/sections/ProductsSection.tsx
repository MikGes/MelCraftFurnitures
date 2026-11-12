// components/sections/ProductsSection.tsx
import { FaCouch, FaPaintBrush, FaArrowRight } from 'react-icons/fa';
import ProductCard from '@/app/ui/ProductCard';
import { Product } from '@/app/data/products';

interface ProductsSectionProps {
  furnitures: any[];
  // interiorProducts: Product[];
  openProductModal: (product: any) => void;
}

export default function ProductsSection({ furnitures, openProductModal }: ProductsSectionProps) {
  return (
    <section id="products" className="py-4 bg-white">
      <div className="container mx-auto px-4">
        {/* <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900">Our Premium Collections</h2>
          <p className="mt-4 text-amber-700 max-w-2xl mx-auto">
            Discover handcrafted furniture and interior design elements that blend functionality with timeless elegance.
          </p>
        </div> */}

        {/* Furniture Collection */}
        <div className="mb-12">
          {/* <div className="flex items-center mb-8">
            <FaCouch className="text-amber-700 text-2xl mr-3" />
            <h3 className="text-2xl font-bold text-amber-900">Furniture Collection</h3>
          </div> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {furnitures.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewDetails={() => openProductModal(product)}
              />
            ))}
          </div>
          {/* <div className="text-center mt-8">
            <button className="inline-flex items-center text-amber-700 font-medium hover:text-amber-900">
              View All Furniture <FaArrowRight className="ml-2" />
            </button>
          </div> */}
        </div>

        {/* Interior Design Elements
        <div>
          <div className="flex items-center mb-8">
            <FaPaintBrush className="text-amber-700 text-2xl mr-3" />
            <h3 className="text-2xl font-bold text-amber-900">Interior Design Elements</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {interiorProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInterior={true}
                onViewDetails={() => openProductModal(product)}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="inline-flex items-center text-amber-700 font-medium hover:text-amber-900">
              View All Interior Products <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
}