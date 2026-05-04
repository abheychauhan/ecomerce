import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, decreaseQuantity, increaseQuantity } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const cartRoutes = express.Router();

cartRoutes.get('/', protect, getCart);
cartRoutes.post('/add', protect, addToCart);
cartRoutes.put('/update', protect, updateCartItem);
cartRoutes.put('/increase', protect, increaseQuantity);
cartRoutes.put('/decrease', protect, decreaseQuantity);
cartRoutes.delete('/remove/:productId', protect, removeFromCart);
cartRoutes.delete('/clear', protect, clearCart);

export default cartRoutes;