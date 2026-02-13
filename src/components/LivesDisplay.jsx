// AKILI Lives Display Component
// Shows remaining lives and regeneration timer

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Infinity } from 'lucide-react'
import { livesConfig } from '../data/premium'

const LivesDisplay = ({
  lives = 5,
  maxLives = livesConfig.maxLives,
  lastRegeneration = null,
  isPremium = false,
  size = 'normal', // 'small', 'normal'
  onClick,
}) => {
  const [timeToNextLife, setTimeToNextLife] = useState('')

  // Calculate time to next life regeneration
  useEffect(() => {
    if (isPremium || lives >= maxLives) {
      setTimeToNextLife('')
      return
    }

    const calculateTime = () => {
      if (!lastRegeneration) {
        setTimeToNextLife('')
        return
      }

      const now = Date.now()
      const nextRegen = new Date(lastRegeneration).getTime() + livesConfig.regenerationTime
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
  }, [lives, maxLives, lastRegeneration, isPremium])

  const sizes = {
    small: {
      container: 'px-2 py-1',
      heart: 'w-4 h-4',
      text: 'text-xs',
    },
    normal: {
      container: 'px-3 py-2',
      heart: 'w-5 h-5',
      text: 'text-sm',
    },
  }

  const config = sizes[size]

  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 bg-white/5 rounded-full ${config.container} hover:bg-white/10 transition-colors`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Hearts */}
      <div className="flex items-center gap-0.5">
        {isPremium ? (
          // Premium - Unlimited lives
          <>
            <Heart className={`${config.heart} text-red-500 fill-red-500`} />
            <Infinity className={`${config.heart} text-akili-gold`} />
          </>
        ) : (
          // Regular - Show hearts
          Array.from({ length: maxLives }).map((_, index) => (
            <Heart
              key={index}
              className={`${config.heart} transition-colors ${
                index < lives
                  ? 'text-red-500 fill-red-500'
                  : 'text-white/20'
              }`}
            />
          ))
        )}
      </div>

      {/* Timer or count */}
      {!isPremium && lives < maxLives && timeToNextLife && (
        <span className={`text-white/60 ${config.text}`}>
          {timeToNextLife}
        </span>
      )}

      {isPremium && (
        <span className={`text-akili-gold font-medium ${config.text}`}>
          Premium
        </span>
      )}
    </motion.button>
  )
}

export default LivesDisplay
