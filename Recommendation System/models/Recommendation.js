const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  preferences: {
    occasion: String,
    category: String,
    metal: String,
    budgetRange: String,
    style: String,
    color: String,
  },
  results: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    score: Number,
    matchPercent: Number,
    reasons: [String],
  }],
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
