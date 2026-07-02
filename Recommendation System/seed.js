require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Recommendation = require('./models/Recommendation');

const jewelryImages = {
  Necklace: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515562141589-67f0d569b3b3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop',
  ],
  Ring: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586104237516-5765e6dbb26c?w=400&h=400&fit=crop',
  ],
  Earrings: [
    'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&h=400&fit=crop',
  ],
  Bracelet: [
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1599459183200-59c3fd3aaae6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600721391689-2564bb8055de?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
  ],
  Bangle: [
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1609042996907-3c7b3e4e0b1f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1601121141418-c1c04fb5468b?w=400&h=400&fit=crop',
  ],
};

const products = [
  // === NECKLACES (10) ===
  { title: 'Royal Heritage Gold Necklace', description: 'A stunning traditional gold necklace with intricate temple design patterns', category: 'Necklace', occasion: 'Wedding', style: 'Royal', metal: 'Gold', budgetRange: '₹50,000+', color: 'Gold', price: 75000 },
  { title: 'Minimal Chain Necklace', description: 'Delicate thin chain with a small pendant for everyday elegance', category: 'Necklace', occasion: 'Casual', style: 'Minimal', metal: 'Silver', budgetRange: 'Under ₹5,000', color: 'Silver', price: 3500 },
  { title: 'Diamond Solitaire Pendant', description: 'Classic solitaire diamond pendant on white gold chain', category: 'Necklace', occasion: 'Party', style: 'Modern', metal: 'Diamond', budgetRange: '₹20,000–₹50,000', color: 'White', price: 35000 },
  { title: 'Rose Gold Layered Necklace', description: 'Trendy multi-layered rose gold necklace with charm details', category: 'Necklace', occasion: 'Party', style: 'Modern', metal: 'Rose Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 12000 },
  { title: 'Vintage Pearl Choker', description: 'Elegant pearl choker necklace inspired by vintage royalty', category: 'Necklace', occasion: 'Traditional', style: 'Vintage', metal: 'Gold', budgetRange: '₹20,000–₹50,000', color: 'Mixed', price: 28000 },
  { title: 'Kundan Bridal Necklace Set', description: 'Heavy kundan bridal necklace set with matching earrings', category: 'Necklace', occasion: 'Wedding', style: 'Royal', metal: 'Gold', budgetRange: '₹50,000+', color: 'Gold', price: 95000 },
  { title: 'Silver Boho Pendant', description: 'Oxidized silver bohemian style pendant necklace', category: 'Necklace', occasion: 'Casual', style: 'Vintage', metal: 'Silver', budgetRange: 'Under ₹5,000', color: 'Silver', price: 2500 },
  { title: 'Contemporary Gold Bar Necklace', description: 'Sleek horizontal gold bar on a fine chain', category: 'Necklace', occasion: 'Casual', style: 'Minimal', metal: 'Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 8500 },
  { title: 'Diamond Cluster Necklace', description: 'Brilliant diamond cluster necklace for special celebrations', category: 'Necklace', occasion: 'Party', style: 'Royal', metal: 'Diamond', budgetRange: '₹50,000+', color: 'White', price: 120000 },
  { title: 'Temple Motif Gold Chain', description: 'Traditional temple motif gold chain with antique finish', category: 'Necklace', occasion: 'Traditional', style: 'Vintage', metal: 'Gold', budgetRange: '₹20,000–₹50,000', color: 'Gold', price: 42000 },

  // === RINGS (10) ===
  { title: 'Diamond Engagement Ring', description: 'Brilliant-cut diamond engagement ring in platinum setting', category: 'Ring', occasion: 'Wedding', style: 'Modern', metal: 'Diamond', budgetRange: '₹50,000+', color: 'White', price: 85000 },
  { title: 'Gold Signet Ring', description: 'Classic gold signet ring with custom monogram option', category: 'Ring', occasion: 'Casual', style: 'Vintage', metal: 'Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 15000 },
  { title: 'Silver Minimalist Band', description: 'Simple sterling silver band ring for daily wear', category: 'Ring', occasion: 'Casual', style: 'Minimal', metal: 'Silver', budgetRange: 'Under ₹5,000', color: 'Silver', price: 2000 },
  { title: 'Rose Gold Infinity Ring', description: 'Elegant rose gold infinity symbol ring with micro diamonds', category: 'Ring', occasion: 'Party', style: 'Modern', metal: 'Rose Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 18000 },
  { title: 'Royal Gemstone Cocktail Ring', description: 'Statement cocktail ring with colored gemstones in gold', category: 'Ring', occasion: 'Party', style: 'Royal', metal: 'Gold', budgetRange: '₹20,000–₹50,000', color: 'Mixed', price: 38000 },
  { title: 'Traditional Wedding Band Set', description: 'Matching gold wedding band set with delicate engravings', category: 'Ring', occasion: 'Wedding', style: 'Royal', metal: 'Gold', budgetRange: '₹20,000–₹50,000', color: 'Gold', price: 45000 },
  { title: 'Vintage Art Deco Ring', description: 'Art deco inspired ring with geometric diamond patterns', category: 'Ring', occasion: 'Traditional', style: 'Vintage', metal: 'Diamond', budgetRange: '₹20,000–₹50,000', color: 'White', price: 32000 },
  { title: 'Sleek Titanium Ring', description: 'Modern titanium ring with brushed finish', category: 'Ring', occasion: 'Casual', style: 'Modern', metal: 'Silver', budgetRange: 'Under ₹5,000', color: 'Silver', price: 4500 },
  { title: 'Rose Gold Stacking Rings', description: 'Set of 3 delicate rose gold stacking rings', category: 'Ring', occasion: 'Casual', style: 'Minimal', metal: 'Rose Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 9500 },
  { title: 'Navratna Traditional Ring', description: 'Nine-gemstone traditional navratna ring in gold', category: 'Ring', occasion: 'Traditional', style: 'Royal', metal: 'Gold', budgetRange: '₹50,000+', color: 'Mixed', price: 55000 },

  // === EARRINGS (10) ===
  { title: 'Diamond Stud Earrings', description: 'Classic round brilliant diamond stud earrings', category: 'Earrings', occasion: 'Casual', style: 'Minimal', metal: 'Diamond', budgetRange: '₹20,000–₹50,000', color: 'White', price: 25000 },
  { title: 'Gold Jhumka Earrings', description: 'Traditional bell-shaped gold jhumka with pearl drops', category: 'Earrings', occasion: 'Traditional', style: 'Royal', metal: 'Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 14000 },
  { title: 'Rose Gold Hoop Earrings', description: 'Modern medium-sized rose gold hoop earrings', category: 'Earrings', occasion: 'Party', style: 'Modern', metal: 'Rose Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 8000 },
  { title: 'Chandbali Bridal Earrings', description: 'Exquisite chandbali earrings with kundan and pearls', category: 'Earrings', occasion: 'Wedding', style: 'Royal', metal: 'Gold', budgetRange: '₹50,000+', color: 'Gold', price: 62000 },
  { title: 'Silver Threader Earrings', description: 'Minimalist silver threader earrings for everyday elegance', category: 'Earrings', occasion: 'Casual', style: 'Minimal', metal: 'Silver', budgetRange: 'Under ₹5,000', color: 'Silver', price: 1800 },
  { title: 'Vintage Drop Earrings', description: 'Art nouveau inspired drop earrings with filigree work', category: 'Earrings', occasion: 'Party', style: 'Vintage', metal: 'Gold', budgetRange: '₹20,000–₹50,000', color: 'Gold', price: 22000 },
  { title: 'Diamond Chandelier Earrings', description: 'Stunning diamond chandelier earrings for gala events', category: 'Earrings', occasion: 'Party', style: 'Royal', metal: 'Diamond', budgetRange: '₹50,000+', color: 'White', price: 150000 },
  { title: 'Modern Geometric Earrings', description: 'Contemporary geometric shaped gold earrings', category: 'Earrings', occasion: 'Casual', style: 'Modern', metal: 'Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 7500 },
  { title: 'Temple Jewelry Ear Studs', description: 'Traditional south Indian temple gold ear studs', category: 'Earrings', occasion: 'Traditional', style: 'Vintage', metal: 'Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 11000 },
  { title: 'Pearl Cluster Earrings', description: 'Elegant cluster of freshwater pearls in silver setting', category: 'Earrings', occasion: 'Wedding', style: 'Modern', metal: 'Silver', budgetRange: '₹5,000–₹20,000', color: 'White', price: 6500 },

  // === BRACELETS (10) ===
  { title: 'Gold Chain Bracelet', description: 'Classic gold link chain bracelet with lobster clasp', category: 'Bracelet', occasion: 'Casual', style: 'Minimal', metal: 'Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 12000 },
  { title: 'Diamond Tennis Bracelet', description: 'Stunning diamond tennis bracelet in white gold', category: 'Bracelet', occasion: 'Party', style: 'Royal', metal: 'Diamond', budgetRange: '₹50,000+', color: 'White', price: 180000 },
  { title: 'Silver Charm Bracelet', description: 'Sterling silver charm bracelet with customizable charms', category: 'Bracelet', occasion: 'Casual', style: 'Modern', metal: 'Silver', budgetRange: 'Under ₹5,000', color: 'Silver', price: 3800 },
  { title: 'Rose Gold Cuff Bracelet', description: 'Wide rose gold cuff with hammered texture finish', category: 'Bracelet', occasion: 'Party', style: 'Modern', metal: 'Rose Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 15000 },
  { title: 'Vintage Filigree Bracelet', description: 'Intricate filigree work bracelet in antique gold', category: 'Bracelet', occasion: 'Traditional', style: 'Vintage', metal: 'Gold', budgetRange: '₹20,000–₹50,000', color: 'Gold', price: 28000 },
  { title: 'Bridal Gold Bracelet', description: 'Heavy bridal gold bracelet with ruby and emerald stones', category: 'Bracelet', occasion: 'Wedding', style: 'Royal', metal: 'Gold', budgetRange: '₹50,000+', color: 'Mixed', price: 72000 },
  { title: 'Minimal Silver Bangle Bracelet', description: 'Thin silver bangle-style bracelet for stacking', category: 'Bracelet', occasion: 'Casual', style: 'Minimal', metal: 'Silver', budgetRange: 'Under ₹5,000', color: 'Silver', price: 2200 },
  { title: 'Pearl String Bracelet', description: 'Freshwater pearl string bracelet with gold clasp', category: 'Bracelet', occasion: 'Wedding', style: 'Vintage', metal: 'Gold', budgetRange: '₹5,000–₹20,000', color: 'White', price: 9000 },
  { title: 'Gemstone Beaded Bracelet', description: 'Multi-gemstone beaded bracelet with gold spacers', category: 'Bracelet', occasion: 'Traditional', style: 'Royal', metal: 'Gold', budgetRange: '₹20,000–₹50,000', color: 'Mixed', price: 35000 },
  { title: 'Contemporary ID Bracelet', description: 'Modern ID bracelet in rose gold with engraving option', category: 'Bracelet', occasion: 'Casual', style: 'Modern', metal: 'Rose Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 10500 },

  // === BANGLES (10) ===
  { title: 'Traditional Gold Bangle Set', description: 'Set of 4 traditional gold bangles with carved patterns', category: 'Bangle', occasion: 'Traditional', style: 'Royal', metal: 'Gold', budgetRange: '₹50,000+', color: 'Gold', price: 88000 },
  { title: 'Silver Oxidized Bangle', description: 'Tribal inspired oxidized silver statement bangle', category: 'Bangle', occasion: 'Casual', style: 'Vintage', metal: 'Silver', budgetRange: 'Under ₹5,000', color: 'Silver', price: 1500 },
  { title: 'Diamond Studded Bangle', description: 'Elegant bangle studded with brilliant-cut diamonds', category: 'Bangle', occasion: 'Party', style: 'Royal', metal: 'Diamond', budgetRange: '₹50,000+', color: 'White', price: 95000 },
  { title: 'Rose Gold Twisted Bangle', description: 'Delicate twisted rose gold bangle for daily wear', category: 'Bangle', occasion: 'Casual', style: 'Modern', metal: 'Rose Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 7000 },
  { title: 'Bridal Chura Bangle Set', description: 'Traditional bridal chura set with red and gold bangles', category: 'Bangle', occasion: 'Wedding', style: 'Royal', metal: 'Gold', budgetRange: '₹20,000–₹50,000', color: 'Mixed', price: 35000 },
  { title: 'Sleek Minimal Gold Bangle', description: 'Ultra-thin minimal gold bangle for subtle elegance', category: 'Bangle', occasion: 'Casual', style: 'Minimal', metal: 'Gold', budgetRange: '₹5,000–₹20,000', color: 'Gold', price: 11000 },
  { title: 'Vintage Enamel Bangle', description: 'Hand-painted enamel bangle with traditional meenakari work', category: 'Bangle', occasion: 'Traditional', style: 'Vintage', metal: 'Gold', budgetRange: '₹20,000–₹50,000', color: 'Mixed', price: 25000 },
  { title: 'Modern Geometric Bangle', description: 'Angular geometric bangle in polished silver', category: 'Bangle', occasion: 'Party', style: 'Modern', metal: 'Silver', budgetRange: '₹5,000–₹20,000', color: 'Silver', price: 6500 },
  { title: 'Kundan Stone Bangle Pair', description: 'Pair of kundan stone bangles with pearl drops', category: 'Bangle', occasion: 'Wedding', style: 'Royal', metal: 'Gold', budgetRange: '₹20,000–₹50,000', color: 'Gold', price: 42000 },
  { title: 'Platinum Slim Bangle', description: 'Slim platinum bangle with subtle diamond accents', category: 'Bangle', occasion: 'Party', style: 'Minimal', metal: 'Diamond', budgetRange: '₹50,000+', color: 'White', price: 68000 },
];

// Assign images
products.forEach((p, i) => {
  const imgs = jewelryImages[p.category];
  p.image = imgs[i % imgs.length];
});

async function seed() {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Recommendation.deleteMany({});

    console.log('👤 Creating admin user...');
    await User.create({
      name: 'Admin',
      email: 'admin@jewelry.ai',
      password: 'admin123',
      role: 'admin',
    });

    console.log('👤 Creating demo user...');
    await User.create({
      name: 'Demo User',
      email: 'demo@jewelry.ai',
      password: 'demo123',
      role: 'user',
    });

    console.log('💎 Seeding 50 jewelry products...');
    await Product.insertMany(products);

    console.log('\\n✅ Database seeded successfully!');
    console.log('\\n📋 Accounts created:');
    console.log('   Admin: admin@jewelry.ai / admin123');
    console.log('   User:  demo@jewelry.ai / demo123');
    console.log(`\\n💎 Products: ${products.length} items seeded`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
