import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ProductFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [brands, setBrands] = useState([
    'Maybelline',
    'L\'Oreal',
    'Neutrogena',
    'Nivea',
    'Pantene',
    'Garnier',
    'Dove',
    'Chanel',
    'MAC',
    'Estée Lauder',
  ]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleBrandToggle = (brand) => {
    const updatedBrands = localFilters.brand.includes(brand)
      ? localFilters.brand.filter((b) => b !== brand)
      : [...localFilters.brand, brand];
    
    setLocalFilters({ ...localFilters, brand: updatedBrands });
    onFilterChange({ brand: updatedBrands });
  };

  const handlePriceChange = (min, max) => {
    setLocalFilters({ ...localFilters, minPrice: min, maxPrice: max });
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  const handleRatingChange = (rating) => {
    setLocalFilters({ ...localFilters, rating });
    onFilterChange({ rating });
  };

  const categories = [
    'Skincare',
    'Makeup',
    'Haircare',
    'Fragrance',
    'Bath & Body',
    'Tools & Brushes',
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="radio"
                id={`cat-${category}`}
                name="category"
                checked={localFilters.category === category}
                onChange={() => {
                  setLocalFilters({ ...localFilters, category });
                  onFilterChange({ category });
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label
                htmlFor={`cat-${category}`}
                className="ml-2 text-gray-600 cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ''}
              onChange={(e) => handlePriceChange(e.target.value, localFilters.maxPrice)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <span className="text-gray-400">to</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handlePriceChange(localFilters.minPrice, e.target.value)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            Common ranges:
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { min: 0, max: 1000, label: 'Under Rs. 1,000' },
                { min: 1000, max: 3000, label: 'Rs. 1,000 - 3,000' },
                { min: 3000, max: 5000, label: 'Rs. 3,000 - 5,000' },
                { min: 5000, max: '', label: 'Above Rs. 5,000' },
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => handlePriceChange(range.min, range.max)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-xs"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center">
              <input
                type="checkbox"
                id={`brand-${brand}`}
                checked={localFilters.brand.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`brand-${brand}`}
                className="ml-2 text-gray-600 cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                type="radio"
                id={`rating-${rating}`}
                name="rating"
                checked={localFilters.rating === rating.toString()}
                onChange={() => handleRatingChange(rating.toString())}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label
                htmlFor={`rating-${rating}`}
                className="ml-2 text-gray-600 cursor-pointer flex items-center"
              >
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2">& above</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {Object.values(filters).some(
        (value) =>
          (Array.isArray(value) && value.length > 0) ||
          (!Array.isArray(value) && value)
      ) && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-gray-700 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                Category: {filters.category}
                <button
                  onClick={() => onFilterChange({ category: '' })}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            )}
            
            {filters.brand.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                Brand: {brand}
                <button
                  onClick={() =>
                    handleBrandToggle(brand)
                  }
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            ))}
            
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Price: {filters.minPrice || 0} - {filters.maxPrice || '∞'}
                <button
                  onClick={() => handlePriceChange('', '')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            )}
            
            {filters.rating && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                Rating: {filters.rating}+
                <button
                  onClick={() => handleRatingChange('')}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;