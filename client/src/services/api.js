import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecomerce-hi7e.onrender.com/api',
  withCredentials: true, // cookies ke liye
});

// Har request mein token automatically lagao
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token expire hone pe automatically refresh karo
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // 401 aaya aur retry nahi kiya?
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.post(
          'https://ecomerce-hi7e.onrender.com/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        const newToken = res.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); // original request dobara bhejo
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;