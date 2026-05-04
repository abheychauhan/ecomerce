import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart || { items: [], totalPrice: 0 });
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(totalPrice);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Coupon Apply
  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setCouponError('');
      // Adjust API endpoint as per your backend
      const res = await api.post('/coupons/apply', { code: couponCode }); 
      setDiscount(res.data.discount);
      setFinalPrice(res.data.finalPrice);
      setCouponApplied(true);
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon code');
    }
  };

  // Remove Coupon
  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setFinalPrice(totalPrice);
    setCouponApplied(false);
    setCouponError('');
  };

  // Place Order
  const handleOrder = async (e) => {
    e.preventDefault(); // Prevent form submission if wrapped in form
    try {
      setLoading(true);

      // Step 1 — Create payment order
      const paymentRes = await api.post('/orders/payment');
      const { id: payment_order_id } = paymentRes.data.order;

      // Step 2 — Verify + Save
      await api.post('/orders/verify', {
        payment_order_id,
        shippingAddress: address,
        couponCode: couponApplied ? couponCode : null,
      });
     toast.success('Order place ho gaya! 🎉');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order place nahi hua');    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Secure Checkout
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </h1>
          <p className="text-slate-500 mt-1">Please fill in your details to complete the order.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          
          {/* =========================================
              LEFT COLUMN: ADDRESS & COUPON
              ========================================= */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* 1. Shipping Address Form */}
            <form id="checkout-form" onSubmit={handleOrder} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ali Khan"
                    required
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Street Address</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    type="text"
                    name="address"
                    value={address.address}
                    onChange={handleChange}
                    placeholder="House No, Building, Street, Area"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="col-span-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pincode</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleChange}
                      placeholder="000000"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* 2. Coupon Code Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                Apply Coupon
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm uppercase transition-colors focus:outline-none focus:ring-2 focus:bg-white ${
                      couponApplied ? 'border-emerald-200 text-emerald-700 font-bold' : couponError ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                    }`}
                    type="text"
                    placeholder="Enter promo code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={couponApplied}
                  />
                  {couponApplied && (
                    <button onClick={removeCoupon} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={handleCoupon}
                  disabled={couponApplied || !couponCode}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                    couponApplied 
                      ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                      : !couponCode
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-900 text-white hover:bg-blue-800 shadow-md'
                  }`}
                >
                  {couponApplied ? 'Applied ✓' : 'Apply Code'}
                </button>
              </div>

              {/* Feedback Messages */}
              {couponError && (
                <p className="flex items-center gap-1.5 mt-3 text-sm text-red-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {couponError}
                </p>
              )}
              {couponApplied && (
                <p className="flex items-center gap-1.5 mt-3 text-sm text-emerald-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Awesome! You saved ₹{discount} on this order.
                </p>
              )}
            </div>
          </div>

          {/* =========================================
              RIGHT COLUMN: ORDER SUMMARY
              ========================================= */}
          <div className="w-full lg:w-1/3 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col h-full">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

              {/* Compact Items List */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0 relative">
                      <img src={item.product?.images[0]?.url} alt={item.product?.name} className="w-full h-full object-cover mix-blend-multiply" />
                      <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.product?.name}</p>
                      <p className="text-sm text-slate-500">₹{item.price}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-900 shrink-0">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-6 mb-6 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{totalPrice}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                      Discount
                    </span>
                    <span className="font-bold">- ₹{discount}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-3xl font-extrabold text-slate-900">₹{finalPrice}</span>
                </div>
              </div>

              {/* Submit Button (Linked to the form via form ID) */}
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                  loading 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Payment is mocked. No real charges applied.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;