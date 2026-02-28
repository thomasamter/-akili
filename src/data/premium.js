// AKILI Premium Subscription System
// Premium features and subscription tiers

export const premiumFeatures = [
  {
    id: 'adFree',
    name: 'Ad-Free Experience',
    description: 'Play without any interruptions',
    icon: '🚫',
  },
  {
    id: 'unlimitedLives',
    name: 'Unlimited Lives',
    description: 'Never wait to play again',
    icon: '❤️',
  },
  {
    id: 'doubleXP',
    name: '2x XP Boost',
    description: 'Level up twice as fast',
    icon: '⚡',
  },
  {
    id: 'doubleCoins',
    name: '2x Coins',
    description: 'Earn double coins from games',
    icon: '🪙',
  },
  {
    id: 'exclusivePowerups',
    name: 'Exclusive Power-ups',
    description: 'Access to premium-only boosters',
    icon: '💎',
  },
  {
    id: 'premiumBadge',
    name: 'Premium Badge',
    description: 'Show off your premium status',
    icon: '👑',
  },
  {
    id: 'earlyAccess',
    name: 'Early Access',
    description: 'Get new features first',
    icon: '🌟',
  },
  {
    id: 'premiumRewards',
    name: 'Premium Daily Rewards',
    description: '2x daily login bonuses',
    icon: '🎁',
  },
]

// African market pricing (accessible for average income levels)
// Comparable to Netflix Mobile, Spotify, and popular mobile games in Africa
export const subscriptionPlans = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 0.99,
    currency: 'USD',
    period: '7 days',
    savings: null,
    popular: false,
    localPrices: {
      NGN: 800,    // Nigerian Naira
      KES: 150,    // Kenyan Shilling
      ZAR: 18,     // South African Rand
      GHS: 12,     // Ghanaian Cedi
      EGP: 30,     // Egyptian Pound
    },
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 1.99,
    currency: 'USD',
    period: '30 days',
    savings: '50% off weekly',
    popular: true,
    localPrices: {
      NGN: 1500,   // Nigerian Naira
      KES: 300,    // Kenyan Shilling
      ZAR: 35,     // South African Rand
      GHS: 25,     // Ghanaian Cedi
      EGP: 60,     // Egyptian Pound
    },
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 9.99,
    currency: 'USD',
    period: '365 days',
    savings: '75% off',
    popular: false,
    bestValue: true,
    localPrices: {
      NGN: 7500,   // Nigerian Naira (~$5 equivalent value)
      KES: 1500,   // Kenyan Shilling
      ZAR: 180,    // South African Rand
      GHS: 120,    // Ghanaian Cedi
      EGP: 300,    // Egyptian Pound
    },
  },
]

// Currency symbols for display
export const currencySymbols = {
  USD: '$',
  NGN: '₦',
  KES: 'KSh',
  ZAR: 'R',
  GHS: 'GH₵',
  EGP: 'E£',
}

// Premium-exclusive power-ups
export const premiumPowerups = {
  megaBoost: {
    id: 'megaBoost',
    name: 'Mega Boost',
    icon: '🚀',
    description: 'Triple points + extra time + 50/50 combined!',
    color: 'from-purple-500 to-pink-500',
    premiumOnly: true,
  },
  revealAnswer: {
    id: 'revealAnswer',
    name: 'Reveal Answer',
    icon: '👁️',
    description: 'See the correct answer (no points awarded)',
    color: 'from-indigo-500 to-purple-500',
    premiumOnly: true,
  },
  freezeTime: {
    id: 'freezeTime',
    name: 'Freeze Time',
    icon: '❄️',
    description: 'Stop the timer for 10 seconds',
    color: 'from-cyan-400 to-blue-500',
    premiumOnly: true,
  },
}

// Lives system (for free users)
export const livesConfig = {
  maxLives: 5,
  regenerationTime: 30 * 60 * 1000, // 30 minutes per life
  lostPerGame: 1, // Lose 1 life per game (if not perfect)
  bonusLifeForPerfect: true, // Get life back for perfect game
}

// Check if user has premium feature
export const hasPremiumFeature = (featureId, isPremium) => {
  if (!isPremium) return false
  return premiumFeatures.some(f => f.id === featureId)
}

// Calculate effective rewards with premium multipliers
export const calculateRewards = (baseCoins, baseXP, isPremium) => {
  const multiplier = isPremium ? 2 : 1
  return {
    coins: baseCoins * multiplier,
    xp: baseXP * multiplier,
  }
}

export default {
  premiumFeatures,
  subscriptionPlans,
  premiumPowerups,
  livesConfig,
}
