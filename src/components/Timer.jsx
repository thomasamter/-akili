// AKILI Timer Component
// Countdown timer for trivia questions

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

const Timer = ({
  duration = 15,
  onTimeUp,
  isPaused = false,
  onTick,
  size = 'normal' // 'small', 'normal', 'large'
}) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isWarning, setIsWarning] = useState(false)
  const [isCritical, setIsCritical] = useState(false)

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration)
    setIsWarning(false)
    setIsCritical(false)
  }, [duration])

  // Countdown logic
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1

        // Call onTick if provided
        if (onTick) onTick(newTime)

        // Set warning states
        if (newTime <= 5 && newTime > 3) {
          setIsWarning(true)
        } else if (newTime <= 3) {
          setIsCritical(true)
        }

        // Time's up
        if (newTime <= 0) {
          if (onTimeUp) onTimeUp()
          return 0
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, timeLeft, onTimeUp, onTick])

  // Calculate progress percentage
  const progress = (timeLeft / duration) * 100

  // Size configurations
  const sizes = {
    small: { width: 60, height: 60, stroke: 4, fontSize: 'text-lg' },
    normal: { width: 80, height: 80, stroke: 5, fontSize: 'text-2xl' },
    large: { width: 100, height: 100, stroke: 6, fontSize: 'text-3xl' },
  }

  const config = sizes[size]
  const radius = (config.width - config.stroke) / 2
  const circumference = 2 * Math.PI * radius

  // Color based on time remaining
  const getColor = () => {
    if (isCritical) return '#EF4444' // Red
    if (isWarning) return '#F59E0B' // Amber
    return '#FDB913' // Gold
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG Circle Timer */}
      <svg
        width={config.width}
        height={config.height}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={config.stroke}
        />

        {/* Progress circle */}
        <motion.circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          initial={{ strokeDashoffset: 0 }}
          animate={{
            strokeDashoffset: circumference - (progress / 100) * circumference,
            stroke: getColor(),
          }}
          transition={{ duration: 0.3 }}
        />
      </svg>

      {/* Time display */}
      <motion.span
        className={`absolute ${config.fontSize} font-bold`}
        style={{ color: getColor() }}
        animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
      >
        {timeLeft}
      </motion.span>
    </div>
  )
}

export default Timer
