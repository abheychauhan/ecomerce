import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const productRoutes = express.Router();

productRoutes.get('/', getProducts);  
productRoutes.get('/:id', getProduct);                                            // Public
productRoutes.post('/', protect, adminOnly, upload.array('images', 5), createProduct);   // Admin
productRoutes.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct); // Admin
productRoutes.delete('/:id', protect, adminOnly, deleteProduct);                  // Admin

export default productRoutes;