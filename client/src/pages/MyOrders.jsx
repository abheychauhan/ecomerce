import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { OrderCardSkeleton } from '../components/Skeleton';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for Badge Colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // =====================
  // LOADING STATE
  // =====================
if (loading) return (
  <div className="min-h-screen bg-slate-50">
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      {[1, 2, 3].map((i) => <OrderCardSkeleton key={i} />)}
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 flex items-center gap-3">
          <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order History</h1>
        </div>

        {orders.length === 0 ? (
          /* =====================
             EMPTY STATE
             ===================== */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No orders placed yet</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              You haven't ordered anything yet. Browse our exclusive collection and place your first order!
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="px-8 py-3.5 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* =====================
             ORDER LIST
             ===================== */
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                
                {/* Order Header */}
                <div className="bg-slate-50/50 border-b border-slate-100 p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Order ID: <span className="text-slate-900">#{order._id.slice(-8).toUpperCase()}</span>
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border flex items-center gap-1 ${
                      order.paymentInfo.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {order.paymentInfo.status === 'paid' ? (
                        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Paid</>
                      ) : (
                        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> Unpaid</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-5 sm:p-6">
                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 py-2">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-slate-900 truncate">{item.name}</h4>
                          <p className="text-sm font-medium text-slate-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-extrabold text-slate-900">₹{item.price * item.quantity}</p>
                          <p className="text-xs font-medium text-slate-400">₹{item.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer (Address & Total) */}
                <div className="bg-slate-50 p-5 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                  
                  {/* Shipping Info */}
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Shipping Details
                    </h5>
                    <p className="text-sm font-semibold text-slate-800">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-sm">
                      {order.shippingAddress.address}, <br/>
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                    <p className="text-sm text-slate-600 mt-2 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {order.shippingAddress.phone}
                    </p>
                  </div>

                  {/* Total Amount Box */}
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Order Amount</p>
                    <p className="text-3xl font-extrabold text-blue-600">₹{order.totalPrice}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">Includes all taxes</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;