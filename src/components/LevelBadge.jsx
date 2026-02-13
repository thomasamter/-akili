// AKILI Level Badge Component
// Shows player level and XP progress

import { motion } from 'framer-motion'
import { getLevelFromXP, getXPProgress, tiers } from '../data/levels'

const LevelBadge = ({
  xp = 0,
  size = 'normal', // 'small', 'normal', 'large'
  showProgress = true,
  showTitle = true,
  animate = true,
}) => {
  const levelInfo = getLevelFromXP(xp)
  const xpProgress = getXPProgress(xp)
  const tierInfo = tiers[levelInfo.tier]

  const sizes = {
    small: {
      badge: 'w-10 h-10',
      text: 'text-sm',
      icon: 'text-base',
      progressHeight: 'h-1',
    },
    normal: {
      badge: 'w-14 h-14',
      text: 'text-base',
      icon: 'text-xl',
      progressHeight: 'h-1.5',
    },
    large: {
      badge: 'w-20 h-20',
      text: 'text-xl',
      icon: 'text-2xl',
      progressHeight: 'h-2',
    },
  }

  const config = sizes[size]

  return (
    <div className="flex items-center gap-3">
      {/* Level Badge */}
      <motion.div
        className={`${config.badge} rounded-full bg-gradient-to-br ${tierInfo.color} flex items-center justify-center relative`}
        animate={animate ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className={`font-bold text-white ${config.text}`}>
          {levelInfo.level}
        </span>

        {/* Tier icon */}
        <span className={`absolute -top-1 -right-1 ${config.icon}`}>
          {tierInfo.icon}
        </span>
      </motion.div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {showTitle && (
          <div className="flex items-center gap-2">
            <span className={`font-bold ${tierInfo.textColor} ${config.text}`}>
              {levelInfo.title}
            </span>
            <span className="text-white/40 text-xs">
              Lv.{levelInfo.level}
            </span>
          </div>
        )}

        {showProgress && (
          <div className="mt-1">
            {/* XP Progress Bar */}
            <div className={`w-full ${tierInfo.bgColor} rounded-full ${config.progressHeight} overflow-hidden`}>
              <motion.div
                className={`h-full bg-gradient-to-r ${tierInfo.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress.progress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>

            {/* XP Text */}
            <p className="text-white/40 text-xs mt-1">
              {xpProgress.current} / {xpProgress.required} XP
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LevelBadge
