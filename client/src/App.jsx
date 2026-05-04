import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Layout from './components/Layout';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AdminOrders from './pages/admin/Orders';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (


    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Layout><Products /></Layout>} />
      <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
      <Route path="*" element={<NotFound />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />
      <Route path="/cart" element={
        <ProtectedRoute>
          <Layout><Cart /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/checkout" element={
        <ProtectedRoute>
          <Layout><Checkout /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout><MyOrders /></Layout>
        </ProtectedRoute>
      } />



      {/* Admin Routes — baad mein add karenge */}
      <Route path="/admin" element={
        <AdminRoute>
          <Layout><Dashboard /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/orders" element={
        <AdminRoute>
          <Layout><AdminOrders /></Layout>
        </AdminRoute>
      } />

      <Route path="/admin/products" element={
        <AdminRoute>
          <Layout><AdminProducts /></Layout>
        </AdminRoute>
      } />

    </Routes>
    


  );
};

export default App;