import express from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const reviewRoutes = express.Router();

reviewRoutes.post('/', protect, createReview);
reviewRoutes.get('/:productId', getProductReviews);
reviewRoutes.put('/:id', protect, updateReview);
reviewRoutes.delete('/', protect, deleteReview);

export default reviewRoutes;