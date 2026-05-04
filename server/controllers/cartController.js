import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// ✅ GET CART
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images price stock');

    if (!cart) return res.json({ success: true, items: [], totalPrice: 0 });

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product nahi mila' });

    // Stock check
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Sirf ${product.stock} items available hain` });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    // Cart nahi hai toh banao
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Product already cart mein hai?
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Quantity update karo
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({ message: `Sirf ${product.stock} items available hain` });
      }
      existingItem.quantity = newQty;
    } else {
      // Naya item add karo
      cart.items.push({
        product: productId,
        quantity,
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
      });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE QUANTITY
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity kam se kam 1 honi chahiye' });
    }

    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Sirf ${product.stock} items available hain` });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart nahi mili' });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item cart mein nahi hai' });

    item.quantity = quantity;
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ INCREASE QUANTITY
export const increaseQuantity = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price stock');
    if (!cart) return res.status(404).json({ message: 'Cart nahi mili' });

    const item = cart.items.find((i) => i.product._id.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item cart mein nahi hai' });

    // Stock check karo
    const product = await Product.findById(productId);
    if (item.quantity >= product.stock) {
      return res.status(400).json({ message: `Sirf ${product.stock} items available hain` });
    }

    item.quantity += 1;
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ DECREASE QUANTITY
export const decreaseQuantity = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price stock');;
    if (!cart) return res.status(404).json({ message: 'Cart nahi mili' });

    const item = cart.items.find((i) => i.product._id.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item cart mein nahi hai' });

    if (item.quantity === 1) {
      // 1 se kam nahi ho sakti — item remove karo
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity -= 1;
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ REMOVE ITEM
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price stock');
    if (!cart) return res.status(404).json({ message: 'Cart nahi mili' });
    console.log('Remove from Cart - Found Cart:', cart);
    cart.items = cart.items.filter((i) => i.product._id.toString() !== productId);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CLEAR CART
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: 'Cart clear ho gayi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};