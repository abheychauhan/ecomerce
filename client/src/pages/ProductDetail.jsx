import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  console.log('Product details:', user, product);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
    setActiveImgIndex(0);
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    await dispatch(addToCart({ productId: id, quantity: 1 }));
    toast.success('Product added to cart! 🛍️');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!comment.trim()) return toast.error('Comment likhna zaroori hai!');

    setReviewLoading(true);
    try {
      await api.post('/reviews', { productId: id, rating, comment });
      toast.success('Review submit ho gaya! ⭐');
      setComment('');
      setRating(5);
      dispatch(fetchProduct(id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Review submit nahi hua');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (productId) => {
    if (!window.confirm('Kya aap apna review delete karna chahte hain?')) return;
    try {
      await api.delete('/reviews', { data: { productId } });
      toast.success('Review delete ho gaya!');
      dispatch(fetchProduct(productId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete nahi hua');
    }
  };

  const calculateDiscount = (price, discountPrice) => {
    if (!discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  // =====================
  // LOADING STATE
  // =====================
  if (loading) return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
        <p className="text-slate-500 font-medium">Loading product details...</p>
      </div>
    </div>
  );

  // =====================
  // NOT FOUND STATE
  // =====================
  if (!product && !loading) return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors"
        >
          Back to Products
        </button>
      </div>
    </div>
  );

  const isOutOfStock = product.stock === 0;
  const discountPercent = calculateDiscount(product.price, product.discountPrice);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Navigation */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors mb-8 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>

        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-slate-100">

            {/* LEFT — Image Gallery */}
            <div className="p-6 md:p-10 flex flex-col gap-6">
              <div className="w-full aspect-square md:aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center relative border border-slate-100">
                <img
                  src={product.images[activeImgIndex]?.url || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 mix-blend-multiply"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImgIndex(i)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        activeImgIndex === i
                          ? 'border-blue-600 shadow-md scale-105'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <img src={img.url} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Product Info */}
            <div className="p-6 md:p-10 flex flex-col">
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Ratings Summary */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <svg className="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold text-amber-700">{product.ratings}</span>
                </div>
                <span className="text-sm text-slate-500 font-medium">
                  {product.numOfReviews} reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-3 mb-2">
                  {product.discountPrice > 0 ? (
                    <>
                      <span className="text-4xl font-extrabold text-slate-900">₹{product.discountPrice}</span>
                      <span className="text-lg text-slate-400 line-through mb-1">₹{product.price}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-extrabold text-slate-900">₹{product.price}</span>
                  )}
                </div>
                <p className="text-sm text-slate-500">Inclusive of all taxes.</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-3">About this item</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Stock + Cart */}
              <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto flex items-center justify-center px-6 py-4 rounded-xl border-2 border-slate-100 bg-slate-50">
                  <div className={`w-3 h-3 rounded-full mr-2 ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                  <span className={`text-sm font-bold ${isOutOfStock ? 'text-red-600' : 'text-emerald-700'}`}>
                    {isOutOfStock ? 'Out of Stock' : `${product.stock} in Stock`}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg active:scale-95'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================
            REVIEWS SECTION
            ===================== */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">Write a Review</h2>
              <p className="text-sm text-slate-500 mb-6">
                {user ? 'Share your experience with this product' : 'Login karke review do'}
              </p>

              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-5">

                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <svg
                            className={`w-8 h-8 transition-colors ${
                              star <= (hoverRating || rating) ? 'text-amber-400' : 'text-slate-200'
                            }`}
                            fill="currentColor" viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {['', 'very bad', 'bad', 'good', 'better', 'best'][hoverRating || rating]}
                    </p>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Product kaisa laga? Apna experience share karo..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {reviewLoading ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Submitting...</>
                    ) : '⭐ Submit Review'}
                  </button>

                </form>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
                >
                  Login to Review
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — Reviews List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-extrabold text-slate-900">Customer Reviews</h2>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold text-amber-700">{product.ratings}</span>
                  <span className="text-amber-600 text-sm">({product.numOfReviews})</span>
                </div>
              </div>

              {/* Reviews List */}
              {!product.reviews || product.reviews.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">💬</div>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">Koi review nahi hai abhi</h3>
                  <p className="text-slate-400 text-sm">Pehle review dene wale bano!</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {product.reviews.map((review, i) => (
                    <div
                      key={i}
                      className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {review.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{review.name}</p>
                            <p className="text-xs text-slate-400">
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                  })
                                : 'Recently'}
                            </p>
                          </div>
                        </div>

                        {/* Stars + Delete */}
                        <div className="flex items-center gap-3">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400' : 'text-slate-200'}`}
                                fill="currentColor" viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>

                          {/* Delete — sirf apna review */}
                          {review.user === user.id && (
                            <button
                              onClick={() => handleDeleteReview(product._id)}
                              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete review"
                            >
                                delete
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;