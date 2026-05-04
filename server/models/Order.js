import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: String,     // product name snapshot
      image: String,    // product image snapshot
      quantity: Number,
      price: Number,
    },
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  paymentInfo: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
  },
  totalPrice: Number,
  deliveredAt: Date,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;