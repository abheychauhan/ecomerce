import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Exclude password from query results by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  refreshToken: {
    type: String,
    select: false, // Exclude refresh token from query results by default
  },
  // 👇 Naye fields Forgot Password flow ke liye
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (err) {
    throw err;  
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  // crypto.randomBytes ki jagah sirf randomBytes
  const resetToken = randomBytes(20).toString('hex');

  // crypto.createHash ki jagah sirf createHash
  this.resetPasswordToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;