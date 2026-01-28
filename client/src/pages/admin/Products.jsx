import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaSearch } from 'react-icons/fa';
import { adminProductApi } from '@/services/adminApi.js';
import { toast } from 'react-toastify';

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminProductApi.getAllProducts();
      console.log('📦 Fetched products:', data);
      setProducts(data.products || data || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError(err.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await adminProductApi.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('❌ Delete error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

// Replace the getImageUrl function with this Cloudinary-compatible version:
const getImageUrl = (product) => {
  if (!product.images || product.images.length === 0) {
    return 'https://via.placeholder.com/300x300?text=No+Image';
  }

  const firstImage = product.images[0];

  // Use Cloudinary URL
  if (firstImage.url) {
    // Return the Cloudinary URL directly
    return firstImage.url;
  }

  // If we have a public_id but no URL, construct Cloudinary URL
  if (firstImage.public_id) {
    // Construct Cloudinary URL from public_id
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${firstImage.public_id}`;
  }

  // Fallback for any other format
  return typeof firstImage === 'string' 
    ? firstImage 
    : 'https://via.placeholder.com/300x300?text=No+Image';
};



  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      e.target.onerror = null; // Prevent infinite loop
                    }}
                    loading="lazy"
                  />

                  {product.isFeatured && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                  <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary-600">
                        ${product.price}
                      </span>
                      {product.discountPrice && product.discountPrice < product.price && (
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          ${product.discountPrice}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.countInStock > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Stock: {product.countInStock || 0}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;