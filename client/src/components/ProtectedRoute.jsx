import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// ✅ Sirf logged in user
export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ✅ Sirf Admin
export const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
};