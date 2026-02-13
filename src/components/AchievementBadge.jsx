// AKILI Achievement Badge Component
// Display individual achievement badges

import { motion } from 'framer-motion'
import { rarityColors } from '../data/achievements'

const AchievementBadge = ({
  achievement,
  unlocked = false,
  progress = 0,
  showDetails = false,
  size = 'normal', // 'small', 'normal', 'large'
  onClick,
}) => {
  const rarity = rarityColors[achievement.rarity] || rarityColors.common

  const sizes = {
    small: { badge: 'w-12 h-12', icon: 'text-xl', text: 'text-xs' },
    normal: { badge: 'w-16 h-16', icon: 'text-3xl', text: 'text-sm' },
    large: { badge: 'w-20 h-20', icon: 'text-4xl', text: 'text-base' },
  }

  const config = sizes[size]

  return (
    <motion.div
      onClick={onClick}
      className={`flex flex-col items-center ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      {/* Badge Circle */}
      <div
        className={`${config.badge} rounded-full flex items-center justify-center border-2 relative ${
          unlocked
            ? `${rarity.bg} ${rarity.border}`
            : 'bg-white/5 border-white/10'
        }`}
      >
        {/* Icon */}
        <span className={`${config.icon} ${unlocked ? '' : 'grayscale opacity-30'}`}>
          {achievement.icon}
        </span>

        {/* Lock overlay for locked achievements */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/20 text-lg">🔒</span>
          </div>
        )}

        {/* Glow effect for unlocked */}
        {unlocked && achievement.rarity === 'legendary' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-akili-gold/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Achievement name */}
      {showDetails && (
        <>
          <p className={`${config.text} font-medium text-white mt-2 text-center`}>
            {achievement.name}
          </p>
          <p className="text-xs text-white/40 text-center mt-0.5">
            {achievement.description}
          </p>

          {/* Progress bar for locked achievements */}
          {!unlocked && progress > 0 && (
            <div className="w-full mt-2">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-akili-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-white/30 text-center mt-1">
                {Math.round(progress)}%
              </p>
            </div>
          )}

          {/* Reward info */}
          {unlocked && achievement.reward && (
            <p className="text-xs text-akili-gold mt-1">
              +{achievement.reward.coins} coins
            </p>
          )}

          {/* Rarity label */}
          <span className={`text-[10px] uppercase tracking-wide mt-1 ${rarity.text}`}>
            {achievement.rarity}
          </span>
        </>
      )}
    </motion.div>
  )
}

export default AchievementBadge
