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

// African market pricing - 30-40% below competitors (Trivia Crack, Trivia Star)
// Competitors: Trivia Crack $4.99/month, $39.99/year | Trivia Star $3.99/week
export const subscriptionPlans = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 2.49,
    currency: 'USD',
    period: '7 days',
    savings: null,
    popular: false,
    localPrices: {
      NGN: 2000,   // Nigerian Naira
      KES: 400,    // Kenyan Shilling
      ZAR: 45,     // South African Rand
      GHS: 30,     // Ghanaian Cedi
      EGP: 75,     // Egyptian Pound
    },
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 2.99,
    currency: 'USD',
    period: '30 days',
    savings: '40% off weekly',
    popular: true,
    localPrices: {
      NGN: 2500,   // Nigerian Naira
      KES: 500,    // Kenyan Shilling
      ZAR: 55,     // South African Rand
      GHS: 40,     // Ghanaian Cedi
      EGP: 100,    // Egyptian Pound
    },
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 24.99,
    currency: 'USD',
    period: '365 days',
    savings: '35% off competitors',
    popular: false,
    bestValue: true,
    localPrices: {
      NGN: 19000,  // Nigerian Naira
      KES: 4000,   // Kenyan Shilling
      ZAR: 450,    // South African Rand
      GHS: 300,    // Ghanaian Cedi
      EGP: 750,    // Egyptian Pound
    },
  },
]

// Supported payment methods for African markets
export const paymentMethods = {
  // Card payments (global)
  cards: {
    enabled: true,
    providers: ['visa', 'mastercard', 'verve'],
    processor: 'flutterwave', // or 'paystack'
  },
  // Mobile Money (pan-African)
  mobileMoney: {
    enabled: true,
    providers: {
      mpesa: { name: 'M-Pesa', countries: ['KE', 'TZ', 'GH'], icon: '📱' },
      mtn: { name: 'MTN Mobile Money', countries: ['NG', 'GH', 'UG', 'RW', 'CM'], icon: '📲' },
      airtel: { name: 'Airtel Money', countries: ['KE', 'UG', 'TZ', 'NG'], icon: '📱' },
      orange: { name: 'Orange Money', countries: ['CI', 'SN', 'CM', 'ML'], icon: '📱' },
      vodafone: { name: 'Vodafone Cash', countries: ['GH'], icon: '📱' },
    },
  },
  // Bank transfers
  bankTransfer: {
    enabled: true,
    countries: ['NG', 'ZA', 'KE', 'GH', 'EG'],
  },
  // USSD (for users without smartphones)
  ussd: {
    enabled: true,
    countries: ['NG', 'KE', 'GH'],
  },
}

// Payment processor configuration
export const paymentConfig = {
  // Primary: Flutterwave (pan-African, 34+ countries)
  flutterwave: {
    publicKey: process.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
    supportedCountries: ['NG', 'KE', 'ZA', 'GH', 'TZ', 'UG', 'RW', 'EG', 'CI', 'SN'],
    features: ['cards', 'mobile_money', 'bank_transfer', 'ussd'],
  },
  // Secondary: Paystack (strong in West Africa)
  paystack: {
    publicKey: process.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    supportedCountries: ['NG', 'GH', 'ZA', 'KE'],
    features: ['cards', 'bank_transfer', 'ussd'],
  },
  // App stores for in-app purchases
  appStores: {
    ios: { enabled: true, processor: 'apple_iap' },
    android: { enabled: true, processor: 'google_play' },
  },
}

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
