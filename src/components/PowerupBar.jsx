// AKILI Power-up Bar Component
// Display and activate power-ups during gameplay

import { motion, AnimatePresence } from 'framer-motion'
import { powerups } from '../data/powerups'

const PowerupBar = ({
  inventory = {},
  onUsePowerup,
  disabled = false,
  activePowerup = null,
  usedThisQuestion = [],
}) => {
  const powerupList = Object.values(powerups)

  return (
    <div className="flex justify-center gap-2">
      {powerupList.map((powerup) => {
        const count = inventory[powerup.id] || 0
        const isUsed = usedThisQuestion.includes(powerup.id)
        const isActive = activePowerup === powerup.id
        const isDisabled = disabled || count === 0 || isUsed

        return (
          <motion.button
            key={powerup.id}
            onClick={() => !isDisabled && onUsePowerup(powerup.id)}
            disabled={isDisabled}
            className={`relative flex flex-col items-center p-2 rounded-xl border transition-all ${
              isActive
                ? 'border-akili-gold bg-akili-gold/20 scale-105'
                : isDisabled
                  ? 'border-white/5 bg-white/5 opacity-40 cursor-not-allowed'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            }`}
            whileHover={!isDisabled ? { scale: 1.05 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
          >
            {/* Icon */}
            <span className="text-2xl mb-1">{powerup.icon}</span>

            {/* Name */}
            <span className="text-[10px] text-white/60 font-medium">
              {powerup.name}
            </span>

            {/* Count badge */}
            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              count > 0 ? 'bg-akili-gold text-akili-black' : 'bg-white/20 text-white/40'
            }`}>
              {count}
            </div>

            {/* Active indicator */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-akili-gold rounded-full"
                />
              )}
            </AnimatePresence>

            {/* Used checkmark */}
            {isUsed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                <span className="text-green-500">✓</span>
              </div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export default PowerupBar
