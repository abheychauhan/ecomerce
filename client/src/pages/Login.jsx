import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
// Yahan ensure karein ki 'login' action aapke authSlice me imported hai
import { login, clearError } from '../store/slices/authSlice'; 

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [seepass, setSeepass] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="flex flex-col md:flex-row-reverse bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
        
        {/* Right Side - Branding (Deep Blue) - Isko reverse kar diya taaki thoda alag feel aaye */}
        <div className="hidden md:flex md:w-5/12 bg-blue-900 text-white p-10 flex-col justify-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-800 rounded-full opacity-50 blur-3xl"></div>
          
          <h1 className="text-4xl font-bold mb-4 tracking-tight relative z-10">
            Welcome Back.
          </h1>
          <p className="text-base text-blue-200 leading-relaxed relative z-10">
            Log in to access your personalized shopping experience, track orders, and discover new deals.
          </p>
        </div>

        {/* Left Side - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
              Log In to Your Account
            </h2>
            <p className="text-sm text-slate-500">
              Please enter your credentials to continue.
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

            <div className="flex flex-col relative">
              <div className="flex justify-between items-center mb-2">
                <label 
                  className="text-sm font-semibold text-slate-700" 
                  htmlFor="password"
                >
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-800 bg-slate-50 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type={formData.password.length > 0 && seepass ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              {formData.password.length > 0 &&
              <span className={`absolute right-3 top-9  text-xs border border-transparent  hover:border-blue-300 rounded px-2 py-1 cursor-pointer transition-all ${seepass ? 'text-red-600' : 'text-blue-500'}`} onClick={() => setSeepass(!seepass)}>
                { seepass ? 'hide' : 'view'}
              </span>
              }
            </div>

            {/* Submit Button (Emerald Green) */}
            <button
              className={`w-full py-3 px-4 rounded-lg text-base font-semibold mt-4 transition-all duration-200 ${
                loading
                  ? 'bg-emerald-300 text-white cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]'
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500">
              Naya account banana hai?{' '}
              <Link 
                to="/register" 
                className="text-blue-600 font-semibold hover:text-blue-800 hover:underline ml-1 transition-colors"
              >
                Register yahan karein
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;