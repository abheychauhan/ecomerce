
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateRefreshToken, generateTokens } from '../utils/generateTokens.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto'; // Node.js built-in module for cryptographic functions

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = new User({ name, email, password });
        
        const accessToken = generateTokens(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user =  await User.findOne({ email }).select('+password +refreshToken');
        if(!user){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const accessToken = generateTokens(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,  
                role: user.role,
            },
        });
    }   catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "Token nahi mila" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const accessToken = generateTokens(user._id);
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(403).json({ message: "Token expired ya invalid" });
  }
};


export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: "" });
    }
    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logout ho gaye" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check karein ki user exist karta hai ya nahi
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Is email se koi user nahi mila!' });
    }

    // 2. Token Generate karein (Hamara banaya hua custom method call karke)
    const resetToken = user.getResetPasswordToken();

    // 3. User ko save karein (Sirf token save hoga, password nahi)
    await user.save({ validateBeforeSave: false });

    // 4. Reset URL banayein jo email me jayega
    // Note: Agar aapka React frontend kisi aur port par hai, toh ise change kar lena (e.g., localhost:3000)
    const resetUrl = `http://localhost:5173/password/reset/${resetToken}`;

    const message = `Aapke account ka password reset link neeche diya gaya hai:\n\n${resetUrl}\n\nAgar aapne yeh request nahi ki thi, toh is email ko ignore karein.`;

    try {
      // 5. Nodemailer se email send karein
      await sendEmail({
        email: user.email,
        subject: 'Store. - Password Reset Link',
        message,
      });

      res.status(200).json({ message: `Email sent to ${user.email} successfully!` });
    } catch (error) {
      // Agar email bhejne me error aaye, toh database se token hata dein security ke liye
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: error.message || 'Email bhejne me error aayi!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    // 1. URL se mile token ko wapas hash (encrypt) karein, taaki database wale token se match kar sakein
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. User dhoondein jiska token match ho aur expire na hua ho
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token ka time abhi ke time se zyada hona chahiye
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset token invalid hai ya expire ho chuka hai!' });
    }

    // 3. Check karein dono passwords match karte hain ya nahi
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords match nahi kar rahe hain!' });
    }

    // 4. Naya password set karein (Hamara Model isko automatically bcrypt se hash kar dega)
    user.password = password;

    // 5. Purane token fields ko clear kar dein (Kyunki password reset ho chuka hai)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password successfully update ho gaya hai! Ab aap login kar sakte hain.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
