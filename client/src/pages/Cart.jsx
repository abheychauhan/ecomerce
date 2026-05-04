import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchCart, removeFromCart, increaseQuantity, decreaseQuantity } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { CartItemSkeleton } from '../components/Skeleton';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading, error } = useSelector((state) => state.cart || { items: [], totalPrice: 0 });
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return navigate('/login');
    dispatch(fetchCart());
  }, [dispatch, navigate, user]);
  console.log('Cart Page - Cart Data:', { items, totalPrice, loading, error }); // Debugging log


  // Remove button pe




  // =====================
  // LOADING STATE
  // =====================
if (loading) return (
  <div className="min-h-screen bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
      {[1, 2, 3].map((i) => <CartItemSkeleton key={i} />)}
    </div>
  </div>
);

  // =====================
  // MAIN UI
  // =====================
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
          Shopping Cart
        </h1>

        {!items || items.length === 0 ? (
          /* =====================
             EMPTY CART STATE
             ===================== */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Discover our top products and start shopping!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Products
            </button>
          </div>
        ) : (
          /* =====================
             CART ITEMS & SUMMARY
             ===================== */
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN: ITEM LIST */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
              {items.map((item) => {
                // Defensive check in case product was deleted from DB but remains in cart
                if (!item.product) return null;
                console.log('Rendering Cart Item:', item.product._id); // Debugging log
                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <Link to={`/products/${item.product._id}`} className="shrink-0 relative bg-slate-50 rounded-xl overflow-hidden w-24 h-24 sm:w-28 sm:h-28 border border-slate-100 block">
                      <img
                        src={item.product.images?.[0]?.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col w-full">
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <Link to={`/products/${item.product._id}`} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                          {item.product.name}
                        </Link>
                        <p className="text-lg font-extrabold text-slate-900 shrink-0">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>

                      <p className="text-sm text-slate-500 mb-4 font-medium">₹{item.price} each</p>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between w-full mt-auto">

                        {/* Quantity Controller */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => {
                              if (item.quantity === 1) {
                                dispatch(removeFromCart(item.product._id));
                                toast.success('Item remove ho gaya!');
                              } else {
                                dispatch(decreaseQuantity({ productId: item.product._id.toString() }));
                              }
                            }}
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-slate-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                          </button>

                          <span className="w-12 text-center text-sm font-bold text-slate-900">
                            {item.quantity}
                          </span>

                          <button
                            onClick={async () => {
                              const result = await dispatch(increaseQuantity({ productId: item.product._id.toString() }));
                              if (increaseQuantity.rejected.match(result)) {
                                toast.error(result.payload || 'Stock available nahi hai!');
                              }
                            }}

                            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => { dispatch(removeFromCart(item.product._id)); toast.success('Item remove ho gaya!'); }}
                          className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY (Sticky) */}
            <div className="w-full lg:w-1/3 sticky top-24">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                <div className="space-y-4 text-slate-600 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-slate-900">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Estimate</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Collected</span>
                    <span className="font-semibold text-slate-900">₹0</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <div className="text-right">
                      <span className="text-3xl font-extrabold text-slate-900 block leading-none">₹{totalPrice}</span>
                      <span className="text-xs text-slate-400">Includes all applicable taxes</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 px-6 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Proceed to Checkout
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Encrypted Checkout
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;