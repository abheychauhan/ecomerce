import Product from '../models/Product.js';
import Order from '../models/Order.js';

// ✅ REVIEW CREATE
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Purchase check karo
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      'paymentInfo.status': 'paid',
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: 'Sirf purchased product pe review de sakte ho' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product nahi mila' });

    // Already review diya?
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Aap pehle se review de chuke ho' });
    }

    // Review add karo
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),

    });

    // Rating + numOfReviews update karo
    product.numOfReviews = product.reviews.length;
    product.ratings = (
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    ).toFixed(1);

    await product.save();

    res.status(201).json({ success: true, message: 'Review add ho gaya' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ PRODUCT KE REVIEWS DEKHO
export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .select('reviews ratings numOfReviews');

    if (!product) return res.status(404).json({ message: 'Product nahi mila' });

    res.json({ success: true, reviews: product.reviews, 
      ratings: product.ratings, numOfReviews: product.numOfReviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ REVIEW UPDATE
export const updateReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product nahi mila' });

    const review = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (!review) return res.status(404).json({ message: 'Review nahi mila' });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    // Rating recalculate karo
    product.ratings = (
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    ).toFixed(1);

    await product.save();
    res.json({ success: true, message: 'Review update ho gaya' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ REVIEW DELETE
export const deleteReview = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product nahi mila' });

    // Sirf apna review delete kar sakta hai (ya admin)
    product.reviews = product.reviews.filter(
      (r) => r.user.toString() !== req.user._id.toString()
    );

    // Rating recalculate karo
    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.length > 0
      ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
      : 0;

    await product.save();
    res.json({ success: true, message: 'Review delete ho gaya' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};