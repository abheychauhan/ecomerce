import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import crypto from 'crypto';

// ✅ DUMMY PAYMENT ORDER BANAO
export const createPaymentOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart khali hai' });
    }

    // Fake order ID banao
    const dummyOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    res.json({
      success: true,
      order: {
        id: dummyOrderId,
        amount: cart.totalPrice * 100, // paise mein
        currency: 'INR',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DUMMY PAYMENT VERIFY + ORDER SAVE
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const { payment_order_id, shippingAddress } = req.body;

    // Cart lo
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name images price stock'
    );

    if (!cart) return res.status(400).json({ message: 'Cart nahi mili' });

    // Stock update karo
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Fake payment ID banao
    const dummyPaymentId = `pay_${crypto.randomBytes(8).toString('hex')}`;

    // Order banao
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0]?.url,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      paymentInfo: {
        razorpay_order_id: payment_order_id,
        razorpay_payment_id: dummyPaymentId,
        razorpay_signature: 'dummy_signature',
        status: 'paid',
      },
      totalPrice: cart.totalPrice,
    });

    // Cart clear karo
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ALL ORDERS — Admin only
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const totalAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({ success: true, totalAmount, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ MY ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ SINGLE ORDER
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order nahi mila' });

    // Sirf apna order dekh sakta hai ya admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access nahi hai' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE ORDER STATUS — Admin only
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order nahi mila' });

    order.orderStatus = status;
    if (status === 'delivered') order.deliveredAt = Date.now();

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};