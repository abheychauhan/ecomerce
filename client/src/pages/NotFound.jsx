import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">

        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[180px] font-extrabold text-slate-100 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl">😵</span>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
          Yeh page nahi mila!
        </h2>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Lagta hai tum kisi aisi jagah aa gaye ho jo exist nahi karti.
          Ghabrao mat — wapas chalte hain! 😄
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            ← Wapas jao
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors"
          >
            🏠 Home pe jao
          </button>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
          >
            🛍️ Products dekho
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFound;