const express = require('express');
const Product = require('../models/Product');
const Recommendation = require('../models/Recommendation');
const { protect } = require('../middleware/auth');
const { getRecommendations } = require('../utils/recommendationEngine');
const router = express.Router();

// POST /api/recommendations
router.post('/', protect, async (req, res) => {
  try {
    const { occasion, category, metal, budgetRange, style, color } = req.body;
    if (!occasion || !category || !metal || !budgetRange || !style || !color) {
      return res.status(400).json({ message: 'All preferences are required' });
    }
    const preferences = { occasion, category, metal, budgetRange, style, color };
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products in database. Please seed data first.' });
    }
    const recommendations = getRecommendations(products, preferences);
    // Save to history
    const record = await Recommendation.create({
      userId: req.user._id,
      preferences,
      results: recommendations.map(r => ({
        productId: r.product._id,
        score: r.score,
        matchPercent: r.matchPercent,
        reasons: r.reasons,
      })),
    });
    res.json({
      id: record._id,
      preferences,
      recommendations: recommendations.map(r => ({
        _id: r.product._id,
        title: r.product.title,
        description: r.product.description,
        category: r.product.category,
        occasion: r.product.occasion,
        style: r.product.style,
        metal: r.product.metal,
        budgetRange: r.product.budgetRange,
        color: r.product.color,
        price: r.product.price,
        image: r.product.image,
        matchPercent: r.matchPercent,
        reasons: r.reasons,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/recommendations/history
router.get('/history', protect, async (req, res) => {
  try {
    const history = await Recommendation.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('results.productId');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
