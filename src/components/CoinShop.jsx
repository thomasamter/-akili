// AKILI Coin Shop
// Buy coins with real money or watch ads for free coins

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, ShoppingCart, Sparkles } from 'lucide-react'
import { usePlayerStore } from '../lib/store'
import RewardedAdModal from './RewardedAdModal'
import { AD_REWARDS, getRemainingAds } from '../lib/adService'

const CoinShop = ({ isOpen, onClose }) => {
  const { coins, isPremium } = usePlayerStore()
  const [showAdModal, setShowAdModal] = useState(false)
  const [selectedAdReward, setSelectedAdReward] = useState(AD_REWARDS.COINS_SMALL)

  const remainingAds = getRemainingAds()

  // Free coin options (watch ads)
  const freeOptions = [
    { reward: AD_REWARDS.COINS_SMALL, emoji: '🪙', popular: false },
    { reward: AD_REWARDS.COINS_MEDIUM, emoji: '💰', popular: true },
    { reward: AD_REWARDS.COINS_LARGE, emoji: '💎', popular: false },
  ]

  // Paid coin packages
  const paidPackages = [
    { coins: 500, price: 0.99, bonus: 0, emoji: '🪙' },
    { coins: 1500, price: 2.99, bonus: 200, emoji: '💰', popular: true },
    { coins: 4000, price: 6.99, bonus: 800, emoji: '💎' },
    { coins: 10000, price: 14.99, bonus: 3000, emoji: '👑', bestValue: true },
  ]

  const handleWatchAd = (reward) => {
    setSelectedAdReward(reward)
    setShowAdModal(true)
  }

  const handleAdReward = () => {
    setShowAdModal(false)
  }

  const handlePurchase = (pkg) => {
    // In production, integrate with Stripe or app store
    alert(`Purchase ${pkg.coins + pkg.bonus} coins for $${pkg.price} - Payment integration needed`)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && !showAdModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-akili-black border border-white/10 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-akili-black/95 backdrop-blur-lg border-b border-white/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-akili-gold" />
                  <h2 className="text-xl font-bold text-white">Coin Shop</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-akili-gold/20 px-3 py-1 rounded-full">
                    <span>🪙</span>
                    <span className="text-akili-gold font-bold">{coins}</span>
                  </div>
                  <button onClick={onClose} className="p-2 text-white/40 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Free Coins (Watch Ads) */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Play className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-bold text-white">Free Coins</h3>
                  <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                    {remainingAds} ads left today
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {freeOptions.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleWatchAd(option.reward)}
                      disabled={remainingAds <= 0}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        option.popular
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 bg-white/5 hover:border-green-500/50'
                      } ${remainingAds <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {option.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                      <span className="text-3xl block mb-2">{option.emoji}</span>
                      <p className="text-white font-bold">{option.reward.label}</p>
                      <p className="text-green-400 text-xs mt-1 flex items-center justify-center gap-1">
                        <Play className="w-3 h-3 fill-green-400" />
                        Watch Ad
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Premium Bonus */}
              {!isPremium && (
                <div className="px-4 pb-4">
                  <div className="bg-gradient-to-r from-akili-gold/20 to-yellow-500/20 border border-akili-gold/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-akili-gold" />
                      <div className="flex-1">
                        <p className="text-white font-bold">Premium = 2x Coins</p>
                        <p className="text-white/60 text-sm">All earnings doubled</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="px-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/40 text-xs">or buy coins</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              </div>

              {/* Paid Packages */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-3">Coin Packages</h3>

                <div className="space-y-3">
                  {paidPackages.map((pkg, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handlePurchase(pkg)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                        pkg.bestValue
                          ? 'border-akili-gold bg-akili-gold/10'
                          : pkg.popular
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      {/* Emoji */}
                      <span className="text-3xl">{pkg.emoji}</span>

                      {/* Info */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{pkg.coins.toLocaleString()}</span>
                          {pkg.bonus > 0 && (
                            <span className="text-green-400 text-sm">+{pkg.bonus} bonus!</span>
                          )}
                        </div>
                        <p className="text-white/40 text-sm">
                          {((pkg.coins + pkg.bonus) / pkg.price).toFixed(0)} coins/$
                        </p>
                      </div>

                      {/* Badge */}
                      {pkg.bestValue && (
                        <span className="text-xs bg-akili-gold text-akili-black px-2 py-1 rounded-full font-bold">
                          Best Value
                        </span>
                      )}
                      {pkg.popular && !pkg.bestValue && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                          Popular
                        </span>
                      )}

                      {/* Price */}
                      <span className="text-white font-bold text-lg">
                        ${pkg.price}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 pt-0">
                <p className="text-center text-white/30 text-xs">
                  Purchases are non-refundable. By purchasing, you agree to our Terms of Service.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewarded Ad Modal */}
      <RewardedAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        rewardType={selectedAdReward}
        onRewardEarned={handleAdReward}
      />
    </>
  )
}

export default CoinShop
