import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart || { items: [] });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // To check active route

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    text-sm font-bold transition-all duration-200 border-b-2 py-5
    ${isActive(path) 
      ? 'text-blue-600 border-blue-600' 
      : 'text-slate-500 border-transparent hover:text-slate-900 hover:border-slate-300'
    }
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. Logo Section */}
          <div className="flex-shrink-0 flex items-center mr-8">
            <Link to="/" className="text-2xl font-black text-blue-800 tracking-tighter flex items-center gap-1">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              STORE<span className="text-emerald-500">.</span>
            </Link>
          </div>

          {/* 2. Desktop Navigation Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-8 mr-auto">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/products" className={linkClass('/products')}>Products</Link>
            {user && (
              <Link to="/orders" className={linkClass('/orders')}>My Orders</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className={linkClass('/admin')}>
                <span className="text-amber-500 font-bold border-b-2 border-transparent hover:border-amber-500">Admin</span>
              </Link>
            )}
          </div>

          {/* 3. Search Bar (Hidden on smaller screens, shown on lg) */}
          <div className="hidden lg:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-slate-100/50 border border-slate-200 rounded-full py-2 px-4 pl-10 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          {/* 4. Action Buttons (Cart, Profile, Mobile Toggle) */}
          <div className="flex items-center gap-1 sm:gap-3">
            
            {/* Cart Icon (Visible everywhere if logged in) */}
            {user && (
              <Link to="/cart" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative transition-colors group">
                <svg className="w-6 h-6 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {items?.length > 0 && (
                  <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm transform translate-x-1 -translate-y-1">
                    {items.length}
                  </span>
                )}
              </Link>
            )}

            {/* User Account / Auth Buttons (Desktop) */}
            {user ? (
              <div className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-800 leading-tight">
                    {user.name.split(' ')[0]} {/* First name only */}
                  </span>
                  <button onClick={handleLogout} className="text-[11px] text-red-500 font-bold hover:text-red-700 transition-colors">
                    LOGOUT
                  </button>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold border-2 border-blue-200 shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 ml-2">
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="px-5 py-2 text-sm font-bold bg-blue-900 text-white rounded-full hover:bg-blue-800 shadow-md hover:shadow-lg transition-all active:scale-95">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg ml-1 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE DROPDOWN MENU
          ========================================= */}
      <div className={`md:hidden absolute w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out origin-top ${
        isMenuOpen ? 'scale-y-100 opacity-100 visible' : 'scale-y-0 opacity-0 invisible'
      }`}>
        <div className="px-4 pt-4 pb-6 space-y-5">
          
          {/* Mobile Search */}
          <div className="relative w-full">
            <input type="text" placeholder="Search for products..." className="w-full bg-slate-100 rounded-xl py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-1 border-t border-slate-100 pt-4">
            <Link to="/" className={`px-4 py-3 rounded-xl font-bold text-base ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>Home</Link>
            <Link to="/products" className={`px-4 py-3 rounded-xl font-bold text-base ${isActive('/products') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>All Products</Link>
            
            {user && (
              <Link to="/orders" className={`px-4 py-3 rounded-xl font-bold text-base ${isActive('/orders') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>My Orders</Link>
            )}
          </div>

          {/* Mobile Auth/User Section */}
          <div className="border-t border-slate-100 pt-4">
            {user ? (
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold border-2 border-blue-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-bold text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <Link to="/login" className="flex justify-center py-3 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200">Log In</Link>
                <Link to="/register" className="flex justify-center py-3 text-sm font-bold text-white bg-blue-900 rounded-xl hover:bg-blue-800 shadow-md">Sign Up</Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;