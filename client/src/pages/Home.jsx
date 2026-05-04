import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

import Products from './Products';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };



  return (
    <div className="min-h-screen bg-slate-50 font-sans relative z-0 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-100 to-transparent rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {user ? (
          <div className="animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Welcome back, <span className="text-blue-600">{user.name}</span>! 👋
                </h1>
                <p className="text-slate-500 mt-1">Found some amazing things for you today.</p>
              </div>
            </div>


            {/* Product List Section */}
            <div className="min-h-[400px]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Shop by Collection</h2>
                <div className="h-px flex-1 bg-slate-200 mx-4"></div>
              </div>
              
              <Products /> 
            </div>
          </div>

        ) : (
          /* UNAUTHENTICATED VIEW (REMAINS SAME) */
          <div className="flex flex-col items-center justify-center text-center mt-10 md:mt-20">
            <span className="px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-bold rounded-full mb-6 inline-block">
              🚀 The Ultimate Shopping Experience
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight max-w-4xl">
              Discover Products You'll <span className="text-emerald-600">Love.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
              Explore our curated collection of premium items at unbeatable prices. Join our community and start upgrading your lifestyle today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all duration-200">
                Start Shopping Now
              </button>
              <button onClick={() => navigate('/login')} className="px-8 py-4 bg-white text-blue-900 border-2 border-slate-200 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-200">
                Log In
              </button>
            </div>
            {/* Features section code here... */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;