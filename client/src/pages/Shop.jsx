import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [filters, setFilters] = useState({
    category: '',
    brand: [],
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: 'newest',
    search: '',
  });

  useEffect(() => {
    // Extract filters from URL
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const rating = searchParams.get('rating') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = searchParams.get('page') || '1';

    setFilters({
      category,
      brand: brand ? brand.split(',') : [],
      minPrice,
      maxPrice,
      rating,
      sort,
      search,
    });
    setCurrentPage(parseInt(page));
  }, [location.search, searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('Fetching products with filters:', filters);
        
        const params = new URLSearchParams();
        
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('keyword', filters.search);
        if (filters.brand.length > 0) params.append('brand', filters.brand.join(','));
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.rating) params.append('rating', filters.rating);
        if (filters.sort) params.append('sort', filters.sort);
        params.append('pageNumber', currentPage);
        params.append('pageSize', 12);

        // Use the correct API URL
        const API_URL = import.meta.env.VITE_API_URL || 
          (window.location.origin === 'https://ingenious-laughter-production.up.railway.app' 
            ? '/api' 
            : 'http://localhost:5000/api');
        
        const response = await axios.get(`${API_URL}/products?${params}`);
        
        console.log('Products response:', response.data);
        
        // Handle different response structures
        const productsData = response.data.products || response.data || [];
        
        // Process products to ensure proper image URLs AND stock data
        const processedProducts = Array.isArray(productsData) 
          ? productsData.map(product => {
              // Create a copy of the product
              const processedProduct = { ...product };
              
              // CRITICAL FIX: Handle stock field properly
              // Backends often use countInStock, frontend uses stock
              if (product.countInStock !== undefined) {
                processedProduct.stock = product.countInStock;
              } else if (product.stock !== undefined) {
                processedProduct.stock = product.stock;
              } else {
                processedProduct.stock = 0; // Default if no stock info
              }
              
              // Also set countInStock for consistency
              processedProduct.countInStock = processedProduct.stock;
              
              // Process images array for Cloudinary
              if (product.images && product.images.length > 0) {
                // Map through images to ensure proper format
                processedProduct.images = product.images.map(img => {
                  // If image is a string URL, convert to object
                  if (typeof img === 'string') {
                    return {
                      url: img,
                      public_id: extractPublicIdFromCloudinaryUrl(img),
                      alt: product.name || 'Product image'
                    };
                  }
                  
                  // If image has Cloudinary public_id but no URL, construct URL
                  if (img.public_id && (!img.url || !img.url.includes('cloudinary.com'))) {
                    const cloudName = 'dr1rajqzy'; // Your Cloudinary cloud name
                    img.url = `https://res.cloudinary.com/${cloudName}/image/upload/w_800,h_600,c_fill,q_auto,f_auto/${img.public_id}`;
                  }
                  
                  return img;
                });
              }
              
              console.log('Processed product stock:', {
                original: product.stock,
                countInStock: product.countInStock,
                final: processedProduct.stock
              });
              
              return processedProduct;
            })
          : [];
        
        setProducts(processedProducts);
        setTotalPages(response.data.pages || 1);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage]);

  // Helper function to extract public_id from Cloudinary URL
  const extractPublicIdFromCloudinaryUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      // Find the upload folder and get everything after it
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex !== -1) {
        // Join all parts after 'upload' and remove file extension
        const publicIdWithExt = pathParts.slice(uploadIndex + 2).join('/');
        return publicIdWithExt.replace(/\.[^/.]+$/, ''); // Remove file extension
      }
    } catch (error) {
      console.warn('Error extracting public_id from URL:', url);
    }
    
    return null;
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) params.set(key, value.join(','));
        } else {
          params.set(key, value);
        }
      }
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: [],
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: 'newest',
      search: '',
    });
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {filters.category ? `${filters.category} Products` : 'All Products'}
          </h1>
          <p className="text-gray-600 mt-2">
            {loading ? 'Loading products...' : `${products.length} products found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 bg-white px-4 py-3 rounded-lg shadow w-full hover:shadow-md transition-shadow mobile-tap-target"
            >
              {showFilters ? <FaTimes /> : <FaFilter />}
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              <span className="ml-auto text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                {Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : v !== '')).length}
              </span>
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mb-6 animate-slide-in">
              <div className="bg-white rounded-lg shadow p-4">
                <ProductFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                  isMobile={true}
                />
              </div>
            </div>
          )}

          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <ProductFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                  <FaSearch className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange({ search: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 hidden sm:block">Sort by:</span>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange({ sort: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-auto"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-64 sm:h-72 animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search term. We might not have what you're looking for yet.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-colors mobile-tap-target"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard 
                      key={product._id || product.id} 
                      product={product} 
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 mobile-tap-target"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg mobile-tap-target ${
                              currentPage === pageNum
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 mobile-tap-target"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;