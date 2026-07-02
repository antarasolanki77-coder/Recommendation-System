const express = require('express');
const Product = require('../models/Product');
const Recommendation = require('../models/Recommendation');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.occasion) filters.occasion = req.query.occasion;
    if (req.query.style) filters.style = req.query.style;
    if (req.query.metal) filters.metal = req.query.metal;
    if (req.query.color) filters.color = req.query.color;
    const products = await Product.find(filters).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/analytics
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalRecommendations = await Recommendation.countDocuments();
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const topRecommended = await Recommendation.aggregate([
      { $unwind: '$results' },
      { $group: { _id: '$results.productId', count: { $sum: 1 }, avgScore: { $avg: '$results.matchPercent' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
    ]);
    const recentActivity = await Recommendation.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');
    res.json({ totalProducts, totalRecommendations, categoryStats, topRecommended, recentActivity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
