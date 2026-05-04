import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { ProductCardSkeleton } from '../components/Skeleton';

const categories = ['all', 'electronics', 'clothing', 'shoes', 'books', 'furniture', 'other' ,"men's clothing", "women's clothing", "jewelery"];

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading , total, pages } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [filters]);

  const handleAddToCart = async (productId) => {
    if (!user) return navigate('/login');
    await dispatch(addToCart({ productId, quantity: 1 }));
    // Pro Tip: Future me is alert ko hata kar React Toastify ya Sonner jaisi library use karna for premium feel!
    toast.success('Cart mein add ho gaya! 🛒');
  };

  // Helper function: Discount percentage nikalne ke liye
  const calculateDiscount = (price, discountPrice) => {
    if (!discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* =========================================
            HEADER & FILTERS SECTION
            ========================================= */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Collection
            </h1>

            {/* Search Bar */}
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const isActive = filters.category === (cat === 'all' ? '' : cat);
              return (
                <button
                  key={cat}
                  onClick={() => setFilters({ ...filters, category: cat === 'all' ? '' : cat, page: 1 })}
                  className={`capitalize whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${isActive
                      ? 'bg-blue-900 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700'
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================
            PRODUCTS GRID
            ========================================= */}
{loading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
) : products.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find anything matching "{filters.search}" in this category. Try adjusting your search or filters.
            </p>
            <button
              onClick={() => setFilters({ category: '', search: '', page: 1 })}
              className="mt-6 px-6 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => {
              const discountPercent = calculateDiscount(product.price, product.discountPrice);
              const isOutOfStock = product.stock === 0;

              return (
                <div key={product._id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">

                  {/* Image Container */}
                  <div
                    className="relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <img
                      src={product.images[0]?.url || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {isOutOfStock ? (
                        <span className="bg-red-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm">
                          Sold Out
                        </span>
                      ) : discountPercent > 0 ? (
                        <span className="bg-emerald-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm">
                          {discountPercent}% Off
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                      {product.category}
                    </p>
                    <h3
                      className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 cursor-pointer hover:text-blue-700 transition-colors"
                      onClick={() => navigate(`/products/${product._id}`)}
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-slate-700">{product.ratings}</span>
                      <span className="text-xs text-slate-400">({product.numOfReviews})</span>
                    </div>

                    <div className="mt-auto">
                      {/* Price */}
                      <div className="flex items-end gap-2 mb-4">
                        {product.discountPrice > 0 ? (
                          <>
                            <span className="text-2xl font-extrabold text-slate-900">₹{product.discountPrice}</span>
                            <span className="text-sm text-slate-400 line-through mb-1">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="text-2xl font-extrabold text-slate-900">₹{product.price}</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-5 gap-2">
                        <button
                          onClick={() => navigate(`/products/${product._id}`)}
                          className="col-span-2 flex items-center justify-center py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold transition-colors"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={isOutOfStock}
                          className={`col-span-3 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all duration-200 ${isOutOfStock
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md active:scale-95'
                            }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {isOutOfStock ? 'Empty' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Products Grid ke baad yahan add karo */}

{/* Pagination */}
{pages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-10">

    {/* Prev */}
    <button
      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
      disabled={filters.page === 1}
      className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      Prev
    </button>

    {/* Page Numbers */}
    {[...Array(pages)].map((_, i) => {
      const pageNum = i + 1;
      const isActive = filters.page === pageNum;

      if (
        pageNum === 1 ||
        pageNum === pages ||
        (pageNum >= filters.page - 1 && pageNum <= filters.page + 1)
      ) {
        return (
          <button
            key={pageNum}
            onClick={() => setFilters({ ...filters, page: pageNum })}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${
              isActive
                ? 'bg-blue-900 text-white shadow-md scale-105'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {pageNum}
          </button>
        );
      }

      if (pageNum === filters.page - 2 || pageNum === filters.page + 2) {
        return <span key={pageNum} className="text-slate-400 font-bold px-1">...</span>;
      }

      return null;
    })}

    {/* Next */}
    <button
      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
      disabled={filters.page === pages}
      className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
    >
      Next
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

  </div>
)}

{/* Total count */}
{!loading && total > 0 && (
  <p className="text-center text-slate-400 text-sm mt-4 pb-4">
    Showing {((filters.page - 1) * 10) + 1}–{Math.min(filters.page * 10, total)} of {total} products
  </p>
)}
      </div>
    </div>
  );
};

export default Products;