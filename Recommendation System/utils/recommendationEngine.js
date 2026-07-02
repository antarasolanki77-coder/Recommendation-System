/**
 * AI Jewelry Recommendation Engine
 * Scoring: Budget(30) + Style(30) + Color(20) + Occasion(20) = 100
 */

const BUDGET_ORDER = ['Under ₹5,000', '₹5,000–₹20,000', '₹20,000–₹50,000', '₹50,000+'];

function budgetMatch(userBudget, productBudget) {
  const userIdx = BUDGET_ORDER.indexOf(userBudget);
  const prodIdx = BUDGET_ORDER.indexOf(productBudget);
  if (userIdx === -1 || prodIdx === -1) return 0;
  if (userIdx === prodIdx) return 1.0;
  if (Math.abs(userIdx - prodIdx) === 1) return 0.5;
  return 0.1;
}

function styleMatch(userStyle, productStyle) {
  if (userStyle === productStyle) return 1.0;
  const affinities = {
    'Minimal': ['Modern'],
    'Modern': ['Minimal'],
    'Royal': ['Vintage'],
    'Vintage': ['Royal'],
  };
  if (affinities[userStyle] && affinities[userStyle].includes(productStyle)) return 0.5;
  return 0.1;
}

function colorMatch(userColor, productColor) {
  if (userColor === productColor) return 1.0;
  if (userColor === 'Mixed' || productColor === 'Mixed') return 0.7;
  return 0.1;
}

function occasionMatch(userOccasion, productOccasion) {
  if (userOccasion === productOccasion) return 1.0;
  if (userOccasion === 'Casual') return 0.5;
  if (productOccasion === 'Casual') return 0.4;
  const affinities = {
    'Wedding': ['Traditional'],
    'Traditional': ['Wedding'],
    'Party': ['Casual'],
  };
  if (affinities[userOccasion] && affinities[userOccasion].includes(productOccasion)) return 0.5;
  return 0.1;
}

function generateReasons(preferences, product, scores) {
  const reasons = [];
  if (scores.budget >= 0.8) reasons.push(`Perfect budget match`);
  else if (scores.budget >= 0.5) reasons.push(`Close to your budget range`);
  if (scores.style >= 0.8) reasons.push(`Matches your ${preferences.style} style`);
  else if (scores.style >= 0.5) reasons.push(`Complements your style preference`);
  if (scores.color >= 0.8) reasons.push(`${product.color} color matches your preference`);
  if (scores.occasion >= 0.8) reasons.push(`Ideal for ${product.occasion} occasions`);
  else if (scores.occasion >= 0.5) reasons.push(`Suitable for ${preferences.occasion} events`);
  if (product.category === preferences.category) reasons.push(`Exact ${product.category} type you wanted`);
  if (product.metal === preferences.metal) reasons.push(`Made with your preferred ${product.metal} metal`);
  if (reasons.length === 0) reasons.push('Trending jewelry pick');
  return reasons;
}

function getRecommendations(products, preferences) {
  const scored = products.map(product => {
    const scores = {
      budget: budgetMatch(preferences.budgetRange, product.budgetRange),
      style: styleMatch(preferences.style, product.style),
      color: colorMatch(preferences.color, product.color),
      occasion: occasionMatch(preferences.occasion, product.occasion),
    };

    // Category bonus: if exact match, boost score
    let categoryBonus = product.category === preferences.category ? 10 : 0;
    // Metal bonus
    let metalBonus = product.metal === preferences.metal ? 5 : 0;

    const rawScore = (scores.budget * 30) + (scores.style * 30) + (scores.color * 20) + (scores.occasion * 20) + categoryBonus + metalBonus;
    const maxScore = 30 + 30 + 20 + 20 + 10 + 5; // 115
    const matchPercent = Math.round((rawScore / maxScore) * 100);

    return {
      product: product,
      score: rawScore,
      matchPercent: Math.min(matchPercent, 99),
      reasons: generateReasons(preferences, product, scores),
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 12);
}

module.exports = { getRecommendations };
