import express from 'express';
import {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const orderRoutes = express.Router();

orderRoutes.post('/payment', protect, createPaymentOrder);       // Step 1 — order banao
orderRoutes.post('/verify', protect, verifyPaymentAndCreateOrder); // Step 2 — verify + save
orderRoutes.get('/my', protect, getMyOrders);
orderRoutes.get('/', protect, adminOnly, getAllOrders);
orderRoutes.get('/:id', protect, getOrder);
orderRoutes.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default orderRoutes;