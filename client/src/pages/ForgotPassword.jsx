import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.post('/auth/password/forgot', { email });
      setMessage(res.data.message || 'Password reset link aapke email par bhej diya gaya hai! 📧');
    } catch (err) {
      setError(err.response?.data?.message || 'Koi error aayi, email check karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-8 sm:p-10">
        
        {/* Icon & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Forgot Password?
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Tension mat lo! Apna email enter karo aur hum aapko password reset karne ka link bhejenge.
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm font-bold rounded-xl border border-red-200 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-3 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ali@example.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex justify-center items-center gap-2 ${
              loading
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-blue-900 text-white hover:bg-blue-800 hover:shadow-md active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Sending...</>
            ) : (
              'Send Reset Link 🚀'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;