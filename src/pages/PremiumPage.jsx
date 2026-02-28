// AKILI Premium Page
// Subscription options and premium features

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Crown, Zap, Heart, Shield, Gift, Star } from 'lucide-react'
import { premiumFeatures, subscriptionPlans, currencySymbols } from '../data/premium'
import { usePlayerStore } from '../lib/store'

const PremiumPage = () => {
  const navigate = useNavigate()
  const { isPremium } = usePlayerStore()
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  const handleSubscribe = (planId) => {
    // In production, this would integrate with Stripe, RevenueCat, or App Store
    alert(`Subscribe to ${planId} plan - Payment integration needed`)
  }

  const featureIcons = {
    adFree: Shield,
    unlimitedLives: Heart,
    doubleXP: Zap,
    doubleCoins: Star,
    exclusivePowerups: Crown,
    premiumBadge: Crown,
    earlyAccess: Gift,
    premiumRewards: Gift,
  }

  return (
    <div className="min-h-screen bg-akili-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-akili-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white">AKILI Premium</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-akili-gold via-yellow-500 to-orange-500 flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Unlock Your Full Potential
          </h2>
          <p className="text-white/60">
            Get unlimited access to all premium features
          </p>
        </motion.section>

        {/* Already Premium */}
        {isPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-akili-gold/20 border border-akili-gold/50 rounded-xl text-center"
          >
            <Crown className="w-8 h-8 text-akili-gold mx-auto mb-2" />
            <p className="text-akili-gold font-bold">You're a Premium Member!</p>
            <p className="text-white/60 text-sm">Enjoying all premium benefits</p>
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-bold text-white mb-4">Premium Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {premiumFeatures.map((feature, index) => {
              const Icon = featureIcons[feature.id] || Star
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="glass-card p-4 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-akili-gold/20 flex items-center justify-center mb-3">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h4 className="font-medium text-white text-sm mb-1">
                    {feature.name}
                  </h4>
                  <p className="text-white/40 text-xs">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Subscription Plans */}
        {!isPremium && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Choose Your Plan</h3>
              {/* Currency Selector */}
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-akili-gold"
              >
                <option value="USD">🇺🇸 USD</option>
                <option value="NGN">🇳🇬 NGN</option>
                <option value="KES">🇰🇪 KES</option>
                <option value="ZAR">🇿🇦 ZAR</option>
                <option value="GHS">🇬🇭 GHS</option>
                <option value="EGP">🇪🇬 EGP</option>
              </select>
            </div>

            {/* Affordable pricing note */}
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400 text-sm text-center">
                💚 Affordable pricing for Africa - Less than the cost of a coffee!
              </p>
            </div>

            <div className="space-y-3">
              {subscriptionPlans.map((plan) => {
                const price = selectedCurrency === 'USD'
                  ? plan.price
                  : plan.localPrices?.[selectedCurrency] || plan.price
                const symbol = currencySymbols[selectedCurrency] || '$'

                return (
                  <motion.button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all relative ${
                      selectedPlan === plan.id
                        ? 'border-akili-gold bg-akili-gold/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <span className="absolute -top-2 left-4 px-2 py-0.5 bg-akili-gold text-akili-black text-xs font-bold rounded-full">
                        Most Popular
                      </span>
                    )}
                    {plan.bestValue && (
                      <span className="absolute -top-2 left-4 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                        Best Value
                      </span>
                    )}

                    <div className="flex items-center justify-between pr-8">
                      <div className="text-left">
                        <h4 className="font-bold text-white">{plan.name}</h4>
                        <p className="text-white/40 text-sm">{plan.period}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {symbol}{price.toLocaleString()}
                        </p>
                        {plan.savings && (
                          <p className="text-green-400 text-sm font-medium">
                            {plan.savings}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Selection indicator */}
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id
                        ? 'border-akili-gold bg-akili-gold'
                        : 'border-white/20'
                    }`}>
                      {selectedPlan === plan.id && (
                        <Check className="w-4 h-4 text-akili-black" />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Subscribe Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => handleSubscribe(selectedPlan)}
              className="w-full mt-6 py-4 bg-gradient-to-r from-akili-gold to-yellow-500 text-akili-black font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Subscribe Now
            </motion.button>

            {/* Terms */}
            <p className="mt-4 text-white/40 text-xs text-center">
              Cancel anytime. Subscription auto-renews unless cancelled 24 hours before the end of the current period.
            </p>
          </motion.section>
        )}

        {/* Comparison Table */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-lg font-bold text-white mb-4">Free vs Premium</h3>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/60 font-medium">Feature</th>
                  <th className="p-4 text-white/60 font-medium">Free</th>
                  <th className="p-4 text-akili-gold font-medium">Premium</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white">Daily Lives</td>
                  <td className="p-4 text-center text-white/60">5</td>
                  <td className="p-4 text-center text-akili-gold">Unlimited</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white">Ads</td>
                  <td className="p-4 text-center text-white/60">Yes</td>
                  <td className="p-4 text-center text-green-400">None</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white">XP Multiplier</td>
                  <td className="p-4 text-center text-white/60">1x</td>
                  <td className="p-4 text-center text-akili-gold">2x</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white">Coin Multiplier</td>
                  <td className="p-4 text-center text-white/60">1x</td>
                  <td className="p-4 text-center text-akili-gold">2x</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white">Daily Rewards</td>
                  <td className="p-4 text-center text-white/60">Standard</td>
                  <td className="p-4 text-center text-akili-gold">2x Rewards</td>
                </tr>
                <tr>
                  <td className="p-4 text-white">Exclusive Power-ups</td>
                  <td className="p-4 text-center text-white/60">-</td>
                  <td className="p-4 text-center text-green-400">
                    <Check className="w-5 h-5 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Restore Purchases */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full text-center text-white/40 text-sm hover:text-white/60 transition-colors"
        >
          Restore Purchases
        </motion.button>

        <div className="h-8" />
      </main>
    </div>
  )
}

export default PremiumPage
