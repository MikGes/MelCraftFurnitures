interface ProductCardProps {
  product: any;
  isInterior?: boolean;
  onViewDetails: () => void;
}

export default function ProductCard({ product, isInterior = false, onViewDetails }: ProductCardProps) {
  return (
    <div
      className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 bg-gradient-to-r from-amber-100 to-amber-300"
    >
      {!isInterior && product.special_description && (
        <p className="bg-green-500 text-white text-center font-semibold py-2 animate-marquee">
          {product.special_description}
        </p>
      )}
      <div className="h-48 bg-amber-200 flex items-center justify-center overflow-hidden">
        {product.furniture_image ? (
          <img
            src={product.furniture_image}
            alt={product.furniture_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-amber-300 w-32 h-32 rounded-lg flex items-center justify-center">
            <span className="text-amber-800 font-bold text-lg">
              {(product.furniture_name || '').split(' ')[0]}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg text-amber-900">
              {isInterior ? product.name : product.furniture_name}
            </h4>
            <p className="text-amber-700 text-sm mt-1">
              {isInterior ? product.category : product.furniture_type}
            </p>
          </div>
          {product.furniture_price ? (
            <span className="font-bold text-amber-800">
              {product.furniture_price} Birr
            </span>
          ) : null}
        </div>
        <button
          onClick={onViewDetails}
          className="mt-4 w-full bg-amber-700 hover:bg-amber-800 text-white py-2 rounded-lg font-medium transition duration-300 cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  );
}