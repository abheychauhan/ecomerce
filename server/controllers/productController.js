import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, stock } = req.body;

    // Images Cloudinary pe upload ho chuki hain (multer ne kiya)
    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    if (images.length === 0) {
      return res.status(400).json({ message: 'Kam se kam ek image zaroori hai' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      images,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ GET ALL — Filters + Pagination
export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 15 } = req.query;

    // Filter object banao
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // case insensitive search
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET SINGLE
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) return res.status(404).json({ message: 'Product nahi mila' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE — Admin only
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product nahi mila' });

    const { name, description, price, discountPrice, category, stock } = req.body;

    // Nai images aayi hain toh purani Cloudinary se delete karo
    if (req.files && req.files.length > 0) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      product.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.category = category || product.category;
    product.stock = stock ?? product.stock;

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE — Admin only
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product nahi mila' });

    // Cloudinary se images delete karo
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product delete ho gaya' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};