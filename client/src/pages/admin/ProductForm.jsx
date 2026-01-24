// pages/admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import { adminProductApi } from '@/services/adminApi';
import { toast } from 'react-toastify';

const ProductForm = ({ mode = 'create' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    category: '',
    brand: '',
    stock: 0,
    images: [],
    featured: false,
    specifications: {},
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    if (mode === 'edit' && id) {
      fetchProduct();
    }
  }, [mode, id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await adminProductApi.getProductById(id);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        discountPrice: data.discountPrice || 0,
        category: data.category?._id || data.category || '',
        brand: data.brand || '',
        stock: data.stock || 0,
        images: data.images || [],
        featured: data.featured || false,
        specifications: data.specifications || {},
      });
      setImages(data.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminProductApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await adminProductApi.getBrands();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  try {
    const formDataObj = new FormData();
    files.forEach(file => {
      formDataObj.append('images', file);
    });

    const response = await adminProductApi.uploadImages(formDataObj);
    const newImages = response.images.map(img => img.url);
    
    setImages(prev => [...prev, ...newImages]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    
    toast.success('Images uploaded successfully');
  } catch (error) {
    console.error('Error uploading images:', error);
    toast.error(error.response?.data?.message || 'Failed to upload images');
  }
};

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        ...formData,
        actualPrice: formData.discountPrice > 0 ? formData.discountPrice : formData.price,
      };

      if (mode === 'create') {
        await adminProductApi.createProduct(productData);
        toast.success('Product created successfully');
      } else {
        await adminProductApi.updateProduct(id, productData);
        toast.success('Product updated successfully');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} product:`, error);
      toast.error(error.response?.data?.message || `Failed to ${mode === 'create' ? 'create' : 'update'} product`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <FaArrowLeft className="mr-2" />
                Back to Products
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {mode === 'create' ? 'Add New Product' : 'Edit Product'}
              </h1>
              <p className="text-gray-600 mt-2">
                {mode === 'create' 
                  ? 'Add a new product to your store' 
                  : 'Update product information'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price ($)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter brand name"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uploaded Images ({images.length})
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center disabled:opacity-50"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    {mode === 'create' ? 'Create Product' : 'Update Product'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;