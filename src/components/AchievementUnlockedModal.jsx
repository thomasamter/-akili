// AKILI Achievement Unlocked Modal
// Celebrates when a player unlocks a new achievement

import { motion, AnimatePresence } from 'framer-motion'
import { rarityColors } from '../data/achievements'
import AchievementBadge from './AchievementBadge'

const AchievementUnlockedModal = ({
  achievement,
  isOpen,
  onClose,
}) => {
  if (!achievement) return null

  const rarity = rarityColors[achievement.rarity] || rarityColors.common

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
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-akili-black border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden"
          >
            {/* Background glow */}
            <div className={`absolute inset-0 ${rarity.bg} opacity-20`} />

            {/* Confetti-like particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    backgroundColor: ['#FDB913', '#EF4444', '#10B981', '#3B82F6'][i % 4],
                  }}
                  initial={{ y: -10, opacity: 1 }}
                  animate={{
                    y: 400,
                    opacity: 0,
                    x: (Math.random() - 0.5) * 100,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    delay: Math.random() * 0.5,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-5xl">🎉</span>
                <h2 className="text-xl font-bold text-white mt-2">
                  Achievement Unlocked!
                </h2>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="my-6"
              >
                <AchievementBadge
                  achievement={achievement}
                  unlocked={true}
                  showDetails={true}
                  size="large"
                />
              </motion.div>

              {/* Reward */}
              {achievement.reward && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-2 bg-akili-gold/20 rounded-xl py-3 px-4 mb-6"
                >
                  <span className="text-2xl">🪙</span>
                  <span className="text-akili-gold font-bold text-lg">
                    +{achievement.reward.coins} Coins
                  </span>
                </motion.div>
              )}

              {/* Close button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={onClose}
                className="w-full py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
              >
                Awesome!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AchievementUnlockedModal
