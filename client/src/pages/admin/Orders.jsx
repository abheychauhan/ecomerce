import { useEffect, useState } from 'react';
import api from '../../services/api';

const statusOptions = ['processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map((o) =>
        o._id === orderId ? { ...o, orderStatus: status } : o
      ));
      toast.success('Status update ho gaya!');
    } catch (error) {
      toast.error('Status update nahi hua');
    }
  };

  // Dynamic styling for the select dropdown based on status
  const getDropdownStyle = (status) => {
    switch (status) {
      case 'processing': return 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 focus:ring-blue-500';
    }
  };

  // =====================
  // LOADING STATE
  // =====================
  if (loading) return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
        <p className="text-slate-500 font-medium tracking-wide">Fetching orders database...</p>
      </div>
    </div>
  );

  // =====================
  // MAIN UI
  // =====================
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-900 text-white rounded-xl shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Orders</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">View and update customer order statuses</p>
            </div>
          </div>
          
          {/* Quick Stat */}
          <div className="bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-700">{orders.length} Total Orders</span>
          </div>
        </div>

        {/* =====================
            ORDERS LIST
            ===================== */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[40vh]">
            <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No Orders Found</h2>
            <p className="text-slate-500">Your store hasn't received any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
                
                {/* Card Header (Gray background) */}
                <div className="bg-slate-50 border-b border-slate-100 p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  
                  {/* Left: Customer & Order Details */}
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 font-mono shadow-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {order.user?.name || 'Guest User'}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {order.user?.email || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Status Changer */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2">
                    <p className="text-2xl font-extrabold text-blue-700">
                      ₹{order.totalPrice?.toLocaleString('en-IN')}
                    </p>
                    
                    {/* Custom Styled Select Dropdown */}
                    <div className="relative">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`appearance-none cursor-pointer border pl-4 pr-10 py-2 rounded-xl text-sm font-bold uppercase tracking-wider outline-none transition-all shadow-sm ${getDropdownStyle(order.orderStatus)}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s} className="text-slate-900 font-semibold bg-white">{s}</option>
                        ))}
                      </select>
                      {/* Dropdown Chevron */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-current opacity-70">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Card Body: Items List */}
                <div className="p-5 sm:p-6 bg-white">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    Order Items
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="w-14 h-14 shrink-0 bg-white border border-slate-200 rounded-lg overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate" title={item.name}>{item.name}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">Quantity: <span className="font-bold text-slate-700">{item.quantity}</span></p>
                        </div>
                        <div className="text-right shrink-0 pr-2">
                          <p className="text-sm font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
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

export default AdminOrders;