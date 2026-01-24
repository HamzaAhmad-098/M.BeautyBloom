import React, { useEffect, useState } from 'react';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || data);
      } catch (err) {
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Delete failed');
      }
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Admin — Products</h1>
        <a href="/admin/products/new" className="btn-primary">Create Product</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((prod) => (
          <div key={prod._id} className="border p-3 rounded shadow-sm">
            <img
              src={prod.images && prod.images[0] ? prod.images[0].url : '/images/sample.jpg'}
              alt={prod.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="font-semibold mt-2">{prod.name}</h2>
            <p className="mt-1">${prod.price}</p>
            <div className="mt-2 flex gap-2">
              <a className="btn-secondary" href={`/admin/products/${prod._id}/edit`}>Edit</a>
              <button className="btn-danger" onClick={() => handleDelete(prod._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;