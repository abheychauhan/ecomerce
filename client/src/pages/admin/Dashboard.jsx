import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
      ]);
      setStats({
        totalOrders: ordersRes.data.orders.length,
        totalRevenue: ordersRes.data.totalAmount,
        totalProducts: productsRes.data.total,
        recentOrders: ordersRes.data.orders.slice(0, 5), // Top 5 recent orders
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper for status badge colors
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
        <p className="text-slate-500 font-medium tracking-wide">Loading Dashboard Data...</p>
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
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-900 text-white rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              Overview
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Welcome back, Admin. Here is what's happening with your store today.</p>
          </div>
          
          {/* Quick Actions / Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => navigate('/admin/products')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors font-semibold text-sm shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Products
            </button>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors font-semibold text-sm shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              Orders
            </button>
            <button 
              onClick={() => navigate('/admin/coupons')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors font-semibold text-sm shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              Coupons
            </button>
          </div>
        </div>

        {/* =========================================
            STATS GRID
            ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Total Orders */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Orders</p>
                <h3 className="text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{stats.totalOrders}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
            </div>
          </div>

          {/* Card 2: Total Revenue */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
                <h3 className="text-3xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  ₹{stats.totalRevenue?.toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>

          {/* Card 3: Total Products */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Products</p>
                <h3 className="text-3xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">{stats.totalProducts}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================
            RECENT ORDERS TABLE
            ========================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Order Status</th>
                  <th className="px-6 py-4 font-bold">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-slate-700">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900">{order.user?.name || 'Guest User'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-extrabold text-slate-900">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full border ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {order.paymentInfo?.status === 'paid' ? (
                            <>
                              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span className="text-sm font-bold text-emerald-600">Paid</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span className="text-sm font-bold text-red-600">Unpaid</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;