import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { TableRowSkeleton } from '../../components/Skeleton';

const categories = ['electronics', 'clothing', 'shoes', 'books', 'furniture', 'other'];

const emptyForm = {
  name: '', description: '', price: '',
  discountPrice: '', category: 'electronics', stock: '',
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=100');
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category,
      stock: product.stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product delete ho gaya!');
    } catch (error) {
      toast.error('Delete nahi hua');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (images.length > 0) {
        images.forEach((img) => data.append('images', img));
      }

      if (editProduct) {
        const res = await api.put(`/products/${editProduct._id}`, data);
        setProducts(products.map((p) =>
          p._id === editProduct._id ? res.data.product : p
        ));
      } else {
        const res = await api.post('/products', data);
        setProducts([res.data.product, ...products]);
      }

      closeModal();
      toast.success(editProduct ? 'Product update ho gaya!' : 'Product add ho gaya!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setEditProduct(null);
    setFormData(emptyForm);
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-900 text-white rounded-xl shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Inventory</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Manage your store's products and stock levels.</p>
            </div>
          </div>

          <button
            onClick={() => { setShowForm(true); setEditProduct(null); setFormData(emptyForm); }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-bold">Product</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Price</th>
                  <th className="px-6 py-4 font-bold">Stock</th>
                  <th className="px-6 py-4 font-bold text-center">Rating</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} />)
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-slate-500 font-medium">No products available in inventory.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50/80 transition-colors border-t border-slate-100">

                      {/* Image & Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img
                              src={product.images[0]?.url || 'https://via.placeholder.com/150'}
                              alt={product.name}
                              className="w-full h-full object-cover mix-blend-multiply"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]" title={product.name}>
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 font-mono">
                              ID: {product._id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        {product.discountPrice > 0 ? (
                          <>
                            <span className="text-sm font-extrabold text-blue-600 block">₹{product.discountPrice}</span>
                            <span className="text-[11px] font-semibold text-slate-400 line-through">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="text-sm font-extrabold text-slate-900">₹{product.price}</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                          product.stock > 10
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : product.stock > 0
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-semibold text-slate-700">{product.ratings || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {editProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1 bg-white rounded-md shadow-sm border border-slate-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto">
                <form id="product-form" onSubmit={handleSubmit} className="space-y-5">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name</label>
                    <input
                      type="text" name="name" value={formData.name}
                      onChange={handleChange} placeholder="e.g. Premium Wireless Headphones"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                    <textarea
                      name="description" value={formData.description}
                      onChange={handleChange} rows="3"
                      placeholder="Write a detailed description..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none"
                      required
                    />
                  </div>

                  {/* Price & Discount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Original Price (₹)</label>
                      <input
                        type="number" name="price" value={formData.price}
                        onChange={handleChange} placeholder="0"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Discount Price (₹)</label>
                      <input
                        type="number" name="discountPrice" value={formData.discountPrice}
                        onChange={handleChange} placeholder="0 (Optional)"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category & Stock */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                      <select
                        name="category" value={formData.category} onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors capitalize cursor-pointer"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stock Quantity</label>
                      <input
                        type="number" name="stock" value={formData.stock}
                        onChange={handleChange} placeholder="0"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Images</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                      <input
                        type="file" multiple accept="image/*"
                        onChange={(e) => setImages(Array.from(e.target.files))}
                        className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                        required={!editProduct}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium">
                      {editProduct ? 'Uploading new images will replace the existing ones.' : 'You can select multiple images.'}
                    </p>
                  </div>

                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  type="button" onClick={closeModal} disabled={submitting}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit" form="product-form" disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Saving...</>
                  ) : editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminProducts;