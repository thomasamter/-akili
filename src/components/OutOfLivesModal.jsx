// AKILI Out of Lives Modal
// Shown when player runs out of lives

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Play, Clock, Crown, X } from 'lucide-react'
import { usePlayerStore } from '../lib/store'
import { livesConfig } from '../data/premium'
import RewardedAdModal from './RewardedAdModal'
import { AD_REWARDS } from '../lib/adService'

const OutOfLivesModal = ({ isOpen, onClose, onLivesRestored }) => {
  const navigate = useNavigate()
  const { lives, maxLives, lastLifeRegeneration, isPremium, refillLives } = usePlayerStore()

  const [showAdModal, setShowAdModal] = useState(false)
  const [timeToNextLife, setTimeToNextLife] = useState('')

  // Calculate time to next life
  useEffect(() => {
    if (lives >= maxLives || isPremium) {
      setTimeToNextLife('')
      return
    }

    const calculateTime = () => {
      if (!lastLifeRegeneration) {
        setTimeToNextLife('30:00')
        return
      }

      const now = Date.now()
      const nextRegen = new Date(lastLifeRegeneration).getTime() + livesConfig.regenerationTime
      const diff = nextRegen - now

      if (diff <= 0) {
        setTimeToNextLife('Ready!')
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeToNextLife(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [lives, maxLives, lastLifeRegeneration, isPremium])

  const handleAdReward = (reward) => {
    setShowAdModal(false)
    if (onLivesRestored) {
      onLivesRestored()
    }
  }

  const handleGoPremium = () => {
    onClose()
    navigate('/premium')
  }

  // Don't show if user has lives or is premium
  if (!isOpen || lives > 0 || isPremium) {
    return null
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
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-akili-black border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-b from-red-500/20 to-transparent p-6 text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Hearts animation */}
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: maxLives }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 0.8, 1] }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Heart className="w-8 h-8 text-white/20" />
                    </motion.div>
                  ))}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">
                  Out of Lives!
                </h2>
                <p className="text-white/60 text-sm">
                  You've used all your lives
                </p>
              </div>

              {/* Options */}
              <div className="p-6 space-y-3">
                {/* Watch Ad Option */}
                <button
                  onClick={() => setShowAdModal(true)}
                  className="w-full p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-4 hover:bg-green-500/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Play className="w-6 h-6 text-green-500 fill-green-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-bold">Watch Ad</p>
                    <p className="text-green-400 text-sm">Get 1 free life instantly</p>
                  </div>
                  <span className="text-2xl">📺</span>
                </button>

                {/* Wait Option */}
                <div className="w-full p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white/60" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">Wait for Regen</p>
                    <p className="text-white/40 text-sm">
                      Next life in: <span className="text-akili-gold">{timeToNextLife}</span>
                    </p>
                  </div>
                </div>

                {/* Premium Option */}
                <button
                  onClick={handleGoPremium}
                  className="w-full p-4 bg-gradient-to-r from-akili-gold/20 to-yellow-500/20 border border-akili-gold/50 rounded-xl flex items-center gap-4 hover:from-akili-gold/30 hover:to-yellow-500/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-akili-gold/20 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-akili-gold" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-akili-gold font-bold">Go Premium</p>
                    <p className="text-white/60 text-sm">Unlimited lives forever</p>
                  </div>
                  <span className="text-xs text-akili-gold bg-akili-gold/20 px-2 py-1 rounded-full">
                    Best Value
                  </span>
                </button>

                {/* Refill with Coins */}
                <button
                  onClick={() => {
                    // Check if user has enough coins (100 coins for full refill)
                    const { coins, spendCoins } = usePlayerStore.getState()
                    if (coins >= 100) {
                      spendCoins(100)
                      refillLives()
                      if (onLivesRestored) onLivesRestored()
                    } else {
                      alert('Not enough coins! Watch an ad or get premium.')
                    }
                  }}
                  className="w-full p-3 text-center text-white/40 text-sm hover:text-white/60 transition-colors"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🪙</span>
                    Refill all lives for 100 coins
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewarded Ad Modal */}
      <RewardedAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        rewardType={AD_REWARDS.LIFE}
        onRewardEarned={handleAdReward}
      />
    </>
  )
}

export default OutOfLivesModal
