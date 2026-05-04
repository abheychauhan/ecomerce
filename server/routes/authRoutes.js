import { Router } from 'express';
import { forgotPassword, login, logout, refreshToken, register, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const authRouter = Router();





authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/logout', logout);

authRouter.post('/password/forgot', forgotPassword);
authRouter.put('/password/reset/:token', resetPassword);

export default authRouter;