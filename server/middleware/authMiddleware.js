import jwt from "jsonwebtoken";
import User from "../models/User.js";


const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Login karo pehle' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.userId);


    if (!user) return res.status(401).json({ message: 'User nahi mila' });

    req.user = user;
    next();
  } catch (error) {
    console.log('Middleware error:', error.message);
    res.status(401).json({ message: 'Token invalid ya expired' });
  }
};

// Admin check
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Sirf admin access kar sakta hai" });
  }
  next();
};

export { protect, adminOnly };