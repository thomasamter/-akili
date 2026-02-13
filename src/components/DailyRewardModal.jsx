// AKILI Daily Reward Modal
// Claim daily login rewards

import { motion, AnimatePresence } from 'framer-motion'
import { Gift, X } from 'lucide-react'
import { dailyRewards, premiumDailyRewards } from '../data/dailyRewards'

const DailyRewardModal = ({
  isOpen,
  onClose,
  onClaim,
  consecutiveDays = 1,
  isPremium = false,
  alreadyClaimed = false,
}) => {
  const rewards = isPremium ? premiumDailyRewards : dailyRewards

  // Get current reward (cycles after 7 days)
  const currentDayIndex = ((consecutiveDays - 1) % 7)
  const currentReward = rewards[currentDayIndex]

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="w-full max-w-sm bg-akili-black border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-b from-akili-gold/20 to-transparent p-6 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-3"
              >
                <div className="w-16 h-16 rounded-full bg-akili-gold/20 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-akili-gold" />
                </div>
              </motion.div>

              <h2 className="text-xl font-bold text-white mb-1">
                {alreadyClaimed ? 'Come Back Tomorrow!' : 'Daily Reward'}
              </h2>
              <p className="text-white/60 text-sm">
                {alreadyClaimed
                  ? 'You already claimed today\'s reward'
                  : `Day ${consecutiveDays} streak bonus!`}
              </p>

              {isPremium && (
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-akili-gold/20 rounded-full text-akili-gold text-xs font-medium">
                  <span>👑</span> 2x Premium Rewards
                </span>
              )}
            </div>

            {/* Week Calendar */}
            <div className="px-6 pb-4">
              <div className="flex justify-between gap-1">
                {rewards.map((reward, index) => {
                  const dayNumber = index + 1
                  const isPast = index < currentDayIndex
                  const isCurrent = index === currentDayIndex
                  const isFuture = index > currentDayIndex

                  return (
                    <div
                      key={index}
                      className={`flex-1 p-2 rounded-lg text-center transition-all ${
                        isCurrent
                          ? 'bg-akili-gold/20 border-2 border-akili-gold'
                          : isPast
                            ? 'bg-green-500/20 border-2 border-green-500/50'
                            : 'bg-white/5 border-2 border-transparent'
                      }`}
                    >
                      <p className={`text-xs font-medium ${
                        isCurrent ? 'text-akili-gold' : isPast ? 'text-green-400' : 'text-white/40'
                      }`}>
                        Day {dayNumber}
                      </p>
                      <div className="mt-1">
                        {isPast ? (
                          <span className="text-green-400">✓</span>
                        ) : isCurrent ? (
                          <span className="text-lg">{reward.powerup ? '🎁' : '🪙'}</span>
                        ) : (
                          <span className="text-lg opacity-30">🎁</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Current Reward */}
            <div className="px-6 pb-4">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white/60 text-xs uppercase tracking-wide mb-3">
                  Today's Reward
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🪙</span>
                      <span className="text-white">Coins</span>
                    </div>
                    <span className="text-akili-gold font-bold">+{currentReward.coins}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <span className="text-white">XP</span>
                    </div>
                    <span className="text-akili-gold font-bold">+{currentReward.xp}</span>
                  </div>
                  {currentReward.powerup && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎁</span>
                        <span className="text-white">Power-up</span>
                      </div>
                      <span className="text-akili-gold font-bold">+1</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Claim Button */}
            <div className="p-6 pt-0">
              <button
                onClick={alreadyClaimed ? onClose : onClaim}
                disabled={alreadyClaimed}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  alreadyClaimed
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-akili-gold text-akili-black hover:bg-akili-gold/90'
                }`}
              >
                {alreadyClaimed ? 'Already Claimed' : 'Claim Reward!'}
              </button>

              {!alreadyClaimed && (
                <p className="text-center text-white/40 text-xs mt-3">
                  Come back tomorrow to keep your streak!
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DailyRewardModal
