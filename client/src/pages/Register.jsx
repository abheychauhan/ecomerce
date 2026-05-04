import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
        
        {/* Left Side - Branding (Deep Blue) */}
        <div className="hidden md:flex md:w-5/12 bg-blue-900 text-white p-10 flex-col justify-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-800 rounded-full opacity-50 blur-3xl"></div>
          
          <h1 className="text-4xl font-bold mb-4 tracking-tight relative z-10">
            Welcome to Store.
          </h1>
          <p className="text-base text-blue-200 leading-relaxed relative z-10">
            Discover the best products at unbeatable prices. Join our community today.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
              Create an Account
            </h2>
            <p className="text-sm text-slate-500">
              Enter your details to get started.
            </p>
          </div>

          {error && (
            <div className="flex items-center bg-red-50 text-red-800 p-3 rounded-lg mb-6 text-sm font-medium border border-red-200">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label 
                className="text-sm font-semibold text-slate-700 mb-2" 
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                id="name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-800 bg-slate-50 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Abhey Singh"
                required
              />
            </div>

            <div className="flex flex-col">
              <label 
                className="text-sm font-semibold text-slate-700 mb-2" 
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-800 bg-slate-50 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="abhey@example.com"
                required
              />
            </div>

            <div className="flex flex-col">
              <label 
                className="text-sm font-semibold text-slate-700 mb-2" 
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-800 bg-slate-50 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Must be at least 6 characters long.
              </p>
            </div>

            {/* Submit Button (Emerald Green) */}
            <button
              className={`w-full py-3 px-4 rounded-lg text-base font-semibold mt-2 transition-all duration-200 ${
                loading
                  ? 'bg-emerald-300 text-white cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]'
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500">
              Pehle se account hai?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 font-semibold hover:text-blue-800 hover:underline ml-1 transition-colors"
              >
                Log in yahan karein
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;