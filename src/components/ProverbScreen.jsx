import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Quote } from 'lucide-react'
import { getRandomProverb } from '../data/proverbs'

// Adinkra Symbol SVG - "Sankofa" (Learn from the past)
const AdinkraSymbol = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-16 h-16"
    fill="currentColor"
  >
    <path d="M50 10c-22 0-40 18-40 40s18 40 40 40 40-18 40-40-18-40-40-40zm0 70c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z"/>
    <path d="M50 25c-13.8 0-25 11.2-25 25s11.2 25 25 25 25-11.2 25-25-11.2-25-25-25zm0 40c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z"/>
    <circle cx="50" cy="50" r="8"/>
    <path d="M50 30v-15M50 85v-15M30 50h-15M85 50h-15" stroke="currentColor" strokeWidth="4" fill="none"/>
  </svg>
)

// Alternative Adinkra - "Gye Nyame" (Except God)
const GyeNyame = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20" fill="currentColor">
    <path d="M50 5C25 5 5 25 5 50s20 45 45 45 45-20 45-45S75 5 50 5zm0 80c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z"/>
    <path d="M50 20c-5 0-9 4-9 9v12c0 2.5-2 4.5-4.5 4.5H25c-5 0-9 4-9 9s4 9 9 9h11.5c2.5 0 4.5 2 4.5 4.5v12c0 5 4 9 9 9s9-4 9-9V68c0-2.5 2-4.5 4.5-4.5H75c5 0 9-4 9-9s-4-9-9-9H63.5c-2.5 0-4.5-2-4.5-4.5V29c0-5-4-9-9-9z"/>
  </svg>
)

const ProverbScreen = ({ onComplete }) => {
  const [proverb, setProverb] = useState(null)
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Get random proverb on mount
    setProverb(getRandomProverb())

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      handleDismiss()
    }, 4000)

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2.5, 100))
    }, 100)

    // Listen for any key press to dismiss
    const handleKeyPress = (e) => {
      handleDismiss()
    }
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onComplete?.()
    }, 500)
  }

  if (!proverb) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A] p-4 cursor-pointer"
          onClick={handleDismiss}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pan-green/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pan-red/5 rounded-full blur-3xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Glassmorphism Card */}
            <div className="glass-card p-8 relative overflow-hidden">
              {/* Rotating Adinkra Symbol */}
              <div className="flex justify-center mb-6">
                <motion.div
                  className="text-gold-500/80"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <GyeNyame />
                </motion.div>
              </div>

              {/* Daily Wisdom Label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-6"
              >
                <span className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium tracking-wider uppercase">
                  <Quote className="w-4 h-4" />
                  Daily Wisdom
                  <Quote className="w-4 h-4 rotate-180" />
                </span>
              </motion.div>

              {/* Original Proverb */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-2xl md:text-3xl font-bold text-center text-white mb-4 leading-relaxed"
              >
                "{proverb.original}"
              </motion.p>

              {/* Translation */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-lg text-center text-gold-400 mb-4 italic"
              >
                "{proverb.translation}"
              </motion.p>

              {/* Meaning */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-center text-gray-400 mb-6"
              >
                {proverb.meaning}
              </motion.p>

              {/* Language & Country */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center items-center gap-3"
              >
                <span className="text-2xl">{proverb.country.split(' ')[0]}</span>
                <div className="text-center">
                  <p className="text-sm font-medium text-white">{proverb.language}</p>
                  <p className="text-xs text-gray-500">{proverb.country.split(' ').slice(1).join(' ')}</p>
                </div>
              </motion.div>

              {/* Progress Bar */}
              <div className="mt-8 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pan-red via-gold-500 to-pan-green"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
            </div>

            {/* Skip Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute -bottom-12 left-0 right-0 text-center text-gray-500 text-sm"
            >
              Tap anywhere or press any key to continue
            </motion.p>
          </motion.div>

          {/* Bottom decoration - Pan-African colors */}
          <div className="absolute bottom-0 left-0 right-0 h-1 flex">
            <div className="flex-1 bg-pan-red/50" />
            <div className="flex-1 bg-gold-500/50" />
            <div className="flex-1 bg-pan-green/50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProverbScreen
