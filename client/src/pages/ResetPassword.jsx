import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
  const { token } = useParams(); // URL se token nikalne ke liye
  const navigate = useNavigate();
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      return setError('Passwords match nahi kar rahe hain! ❌');
    }

    setLoading(true);
    setError('');

    try {
      // Backend route apne hisaab se adjust karein
      await api.put(`/auth/password/reset/${token}`, {
        password: passwords.password,
        confirmPassword: passwords.confirmPassword,
      });
      
      alert('Password successfully update ho gaya! 🎉 Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Token invalid ya expire ho chuka hai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-8 sm:p-10">
        
        {/* Icon & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Create New Password
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Apna naya strong password set karein.
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm font-bold rounded-xl border border-red-200 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={passwords.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex justify-center items-center gap-2 ${
              loading
                ? 'bg-emerald-300 text-white cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Updating...</>
            ) : (
              'Update Password ✓'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;