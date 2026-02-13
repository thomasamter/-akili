// AKILI Rewarded Ad Modal
// Watch ads to earn coins, lives, and power-ups

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Loader2, Check, AlertCircle, Tv } from 'lucide-react'
import { showRewardedAd, canWatchAd, getRemainingAds, AD_REWARDS } from '../lib/adService'
import { usePlayerStore } from '../lib/store'

const RewardedAdModal = ({
  isOpen,
  onClose,
  rewardType = AD_REWARDS.COINS_SMALL,
  onRewardEarned,
}) => {
  const [status, setStatus] = useState('ready') // ready, loading, watching, success, error
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(0)

  const { addCoins, regenerateLife, refillLives, addPowerup } = usePlayerStore()

  // Check if can watch ad
  const watchCheck = canWatchAd()
  const remainingAds = getRemainingAds()

  // Reset status when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('ready')
      setMessage('')
      setCountdown(0)
    }
  }, [isOpen])

  // Handle cooldown countdown
  useEffect(() => {
    if (watchCheck.waitTime && watchCheck.waitTime > 0) {
      setCountdown(watchCheck.waitTime)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [watchCheck.waitTime])

  const handleWatchAd = async () => {
    // Check if allowed
    const check = canWatchAd()
    if (!check.allowed) {
      setStatus('error')
      setMessage(check.message)
      return
    }

    setStatus('loading')
    setMessage('Loading ad...')

    // Simulate loading then watching
    setTimeout(async () => {
      setStatus('watching')
      setMessage('Watching ad...')

      const result = await showRewardedAd(rewardType)

      if (result.success) {
        setStatus('success')
        setMessage('Reward earned!')

        // Apply reward
        applyReward(result.reward)

        // Callback
        if (onRewardEarned) {
          onRewardEarned(result.reward)
        }

        // Auto close after success
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setStatus('error')
        setMessage(result.message || 'Failed to load ad')
      }
    }, 500)
  }

  const applyReward = (reward) => {
    switch (reward.type) {
      case 'coins':
        addCoins(reward.amount)
        break
      case 'life':
        regenerateLife()
        break
      case 'lives_full':
        refillLives()
        break
      case 'powerup':
        addPowerup(reward.powerupId, reward.amount)
        break
      default:
        break
    }
  }

  const getRewardIcon = () => {
    switch (rewardType.type) {
      case 'coins':
        return '🪙'
      case 'life':
      case 'lives_full':
        return '❤️'
      case 'powerup':
        return '🎁'
      default:
        return '🎁'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={status === 'ready' || status === 'error' ? onClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-akili-black border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-b from-green-500/20 to-transparent p-6 text-center">
              {(status === 'ready' || status === 'error') && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Status Icon */}
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                {status === 'ready' && (
                  <Tv className="w-10 h-10 text-green-500" />
                )}
                {status === 'loading' && (
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                )}
                {status === 'watching' && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Play className="w-10 h-10 text-green-500 fill-green-500" />
                  </motion.div>
                )}
                {status === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <Check className="w-10 h-10 text-green-500" />
                  </motion.div>
                )}
                {status === 'error' && (
                  <AlertCircle className="w-10 h-10 text-red-500" />
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white mb-1">
                {status === 'ready' && 'Watch Ad for Reward'}
                {status === 'loading' && 'Loading...'}
                {status === 'watching' && 'Watching Ad...'}
                {status === 'success' && 'Reward Earned!'}
                {status === 'error' && 'Oops!'}
              </h2>

              {/* Message */}
              <p className="text-white/60 text-sm">
                {status === 'ready' && 'Watch a short video to earn your reward'}
                {status !== 'ready' && message}
              </p>
            </div>

            {/* Reward Preview */}
            {status === 'ready' && (
              <div className="px-6 py-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <span className="text-4xl block mb-2">{getRewardIcon()}</span>
                  <p className="text-green-400 font-bold text-lg">
                    {rewardType.label}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    Free reward for watching ad
                  </p>
                </div>

                {/* Remaining ads indicator */}
                <p className="text-center text-white/40 text-xs mt-3">
                  {remainingAds} free rewards remaining today
                </p>
              </div>
            )}

            {/* Success Animation */}
            {status === 'success' && (
              <div className="px-6 py-4">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-500/20 rounded-xl p-6 text-center"
                >
                  <span className="text-5xl block mb-2">{getRewardIcon()}</span>
                  <p className="text-green-400 font-bold text-xl">
                    {rewardType.label}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Action Button */}
            <div className="p-6 pt-0">
              {status === 'ready' && (
                <>
                  {watchCheck.allowed ? (
                    <button
                      onClick={handleWatchAd}
                      className="w-full py-4 bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      Watch Ad
                    </button>
                  ) : countdown > 0 ? (
                    <button
                      disabled
                      className="w-full py-4 bg-white/10 text-white/40 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      Wait {countdown}s
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-4 bg-white/10 text-white/40 font-bold rounded-xl cursor-not-allowed"
                    >
                      {watchCheck.message}
                    </button>
                  )}
                </>
              )}

              {status === 'loading' && (
                <div className="w-full py-4 flex justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}

              {status === 'watching' && (
                <div className="text-center">
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <motion.div
                      className="h-full bg-green-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                  <p className="text-white/40 text-xs">Please watch until the end</p>
                </div>
              )}

              {status === 'error' && (
                <button
                  onClick={handleWatchAd}
                  className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RewardedAdModal
