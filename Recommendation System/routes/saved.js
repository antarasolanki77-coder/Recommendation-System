const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET /api/saved
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedRecommendations');
    res.json(user.savedRecommendations || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/saved/:productId
router.post('/:productId', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const user = await User.findById(req.user._id);
    if (user.savedRecommendations.includes(req.params.productId)) {
      return res.status(400).json({ message: 'Already saved' });
    }
    user.savedRecommendations.push(req.params.productId);
    await user.save();
    res.json({ message: 'Product saved', savedRecommendations: user.savedRecommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/saved/:productId
router.delete('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedRecommendations = user.savedRecommendations.filter(
      id => id.toString() !== req.params.productId
    );
    await user.save();
    res.json({ message: 'Product removed', savedRecommendations: user.savedRecommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
