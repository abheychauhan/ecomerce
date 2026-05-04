import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar fixed rahega top par */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-black text-blue-600 mb-4">SHOPMAX</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Premium products delivered to your doorstep. Best quality, best prices.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
              <ul className="text-slate-500 text-sm space-y-2">
                <li>Home</li>
                <li>All Products</li>
                <li>Categories</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Support</h4>
              <ul className="text-slate-500 text-sm space-y-2">
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Newsletter</h4>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-slate-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 w-full" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Go</button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 text-center">
            <p className="text-slate-400 text-xs">© 2026 ShopMax. Made with ❤️ for customers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;