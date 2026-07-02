const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, required: true, enum: ['Necklace', 'Ring', 'Earrings', 'Bracelet', 'Bangle'] },
  occasion: { type: String, required: true, enum: ['Wedding', 'Party', 'Casual', 'Traditional'] },
  style: { type: String, required: true, enum: ['Minimal', 'Royal', 'Modern', 'Vintage'] },
  metal: { type: String, required: true, enum: ['Gold', 'Silver', 'Diamond', 'Rose Gold'] },
  budgetRange: { type: String, required: true, enum: ['Under ₹5,000', '₹5,000–₹20,000', '₹20,000–₹50,000', '₹50,000+'] },
  color: { type: String, required: true, enum: ['Gold', 'Silver', 'White', 'Mixed'] },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
}, { timestamps: true });

productSchema.index({ category: 1, occasion: 1, style: 1, metal: 1, color: 1, budgetRange: 1 });

module.exports = mongoose.model('Product', productSchema);
