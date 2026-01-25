import { FaTimes } from 'react-icons/fa';

const ProductFilter = ({ filters, onFilterChange, onClearFilters, isMobile = false }) => {
  const categories = ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Tools'];
  const brands = ['L\'Oréal', 'Maybelline', 'MAC', 'NARS', 'Estée Lauder', 'Clinique'];
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className={`${isMobile ? '' : 'bg-white rounded-lg shadow p-4 sm:p-6'}`}>
      {isMobile ? (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-4">Filters</h3>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <button
            onClick={onClearFilters}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Category</h4>
        <div className="space-y-1">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.category === category}
                onChange={() => onFilterChange({ category: filters.category === category ? '' : category })}
                className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-gray-600 text-sm sm:text-base group-hover:text-gray-900 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Brand</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brand.includes(brand)}
                onChange={(e) => {
                  const newBrands = e.target.checked
                    ? [...filters.brand, brand]
                    : filters.brand.filter(b => b !== brand);
                  onFilterChange({ brand: newBrands });
                }}
                className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-gray-600 text-sm sm:text-base group-hover:text-gray-900 transition-colors truncate">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Price Range</h4>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="w-1/2 px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded text-sm sm:text-base"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="w-1/2 px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Rating</h4>
        <div className="space-y-1">
          {ratings.map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating.toString()}
                onChange={() => onFilterChange({ rating: filters.rating === rating.toString() ? '' : rating.toString() })}
                className="h-4 w-4 text-primary-600"
              />
              <span className="ml-2 text-yellow-400 text-sm sm:text-base">
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
              </span>
              <span className="ml-2 text-gray-600 text-xs sm:text-sm group-hover:text-gray-900 transition-colors">
                & above
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={() => onClearFilters()}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium mb-3 transition-colors hover:bg-gray-200"
          >
            Clear Filters
          </button>
          <button
            onClick={() => {
              // Apply filters logic would be here
              // For now, just close the filter
              const event = new Event('closeFilters');
              window.dispatchEvent(event);
            }}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;