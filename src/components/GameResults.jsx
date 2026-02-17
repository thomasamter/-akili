// AKILI Game Results Component
// Shows quiz completion summary and stats

import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../lib/store'
import { useMemo } from 'react'

// Confetti particle component
const ConfettiParticle = ({ index, color, delay }) => {
  const randomX = useMemo(() => Math.random() * 100, [])
  const randomRotation = useMemo(() => Math.random() * 720 - 360, [])
  const randomDuration = useMemo(() => 2 + Math.random() * 2, [])
  const size = useMemo(() => 8 + Math.random() * 8, [])

  return (
    <motion.div
      initial={{
        x: '50vw',
        y: '-10vh',
        rotate: 0,
        opacity: 1
      }}
      animate={{
        x: `${randomX}vw`,
        y: '110vh',
        rotate: randomRotation,
        opacity: [1, 1, 0]
      }}
      transition={{
        duration: randomDuration,
        delay: delay,
        ease: 'easeOut'
      }}
      style={{
        position: 'fixed',
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    />
  )
}

// Celebration confetti burst
const CelebrationConfetti = ({ show }) => {
  const colors = ['#FDB913', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FFD700']
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      delay: Math.random() * 0.5
    })), [])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(particle => (
        <ConfettiParticle
          key={particle.id}
          index={particle.id}
          color={particle.color}
          delay={particle.delay}
        />
      ))}
    </div>
  )
}

const GameResults = ({
  score,
  totalQuestions,
  correctAnswers,
  category,
  timeTaken,
  answers = [],
  onPlayAgain,
  onGoHome,
  coinsEarned = 0,
}) => {
  const navigate = useNavigate()
  const { highScore, streak } = useGameStore()

  // Calculate percentage
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  // Get performance message and emoji
  const getPerformance = () => {
    if (percentage === 100) return { message: 'Perfect Score!', emoji: '🏆', color: 'text-akili-gold' }
    if (percentage >= 80) return { message: 'Excellent!', emoji: '🌟', color: 'text-green-400' }
    if (percentage >= 60) return { message: 'Good Job!', emoji: '👏', color: 'text-blue-400' }
    if (percentage >= 40) return { message: 'Keep Learning!', emoji: '📚', color: 'text-yellow-400' }
    return { message: 'Try Again!', emoji: '💪', color: 'text-orange-400' }
  }

  const performance = getPerformance()

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  // Stats data
  const stats = [
    { label: 'Score', value: score, icon: '🎯' },
    { label: 'Correct', value: `${correctAnswers}/${totalQuestions}`, icon: '✓' },
    { label: 'Accuracy', value: `${percentage}%`, icon: '📊' },
    { label: 'Time', value: formatTime(timeTaken), icon: '⏱️' },
  ]

  // Show celebration for good scores (40%+)
  const showCelebration = percentage >= 40

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-akili-black flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Celebration Confetti */}
      <CelebrationConfetti show={showCelebration} />

      {/* Burst effect behind emoji */}
      {showCelebration && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(253,185,19,0.4) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Performance Emoji */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: [0, 1.3, 1],
          rotate: 0
        }}
        transition={{
          type: 'spring',
          delay: 0.2,
          duration: 0.8,
          times: [0, 0.6, 1]
        }}
        className="text-5xl mb-2 relative z-10"
      >
        {performance.emoji}
        {/* Sparkle effects for perfect score */}
        {percentage === 100 && (
          <>
            <motion.span
              className="absolute -top-2 -right-2 text-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute -bottom-1 -left-2 text-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
            >
              ⭐
            </motion.span>
          </>
        )}
      </motion.div>

      {/* Performance Message */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-2xl md:text-3xl font-bold ${performance.color} mb-1`}
      >
        {performance.message}
      </motion.h1>

      {/* Category */}
      {category && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 mb-4"
        >
          {category.name || category}
        </motion.p>
      )}

      {/* Coins Earned */}
      {coinsEarned > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, type: 'spring' }}
          className="flex items-center gap-2 bg-akili-gold/20 rounded-full px-4 py-2 mb-4"
        >
          <span className="text-xl">🪙</span>
          <span className="text-akili-gold font-bold">+{coinsEarned} coins earned!</span>
        </motion.div>
      )}

      {/* Score Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.5 }}
        className="relative w-32 h-32 mb-3"
      >
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="6"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="#FDB913"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 56}
            initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 56 * (1 - percentage / 100)
            }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white"
          >
            {percentage}%
          </motion.span>
          <span className="text-white/40 text-xs">Score</span>
        </div>
      </motion.div>

      {/* Play Again Button - Prominently placed under score */}
      <motion.div
        initial={{ opacity: 1, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0, duration: 0.3 }}
        className="flex flex-col gap-2 w-full max-w-sm mb-6"
      >
        <button
          onClick={onPlayAgain}
          className="w-full py-4 bg-akili-gold text-akili-black font-bold text-lg rounded-xl hover:bg-akili-gold/90 transition-colors"
          style={{
            border: '4px solid #FFD700',
            boxShadow: '0 0 20px rgba(253, 185, 19, 0.6)'
          }}
        >
          ▶ Play Again
        </button>

        <button
          onClick={onGoHome || (() => navigate('/'))}
          className="w-full py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
        >
          Back to Home
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8"
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white/5 rounded-xl p-4 text-center border border-white/10"
          >
            <span className="text-2xl mb-1 block">{stat.icon}</span>
            <span className="text-xl font-bold text-white">{stat.value}</span>
            <span className="text-white/40 text-xs block">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* High Score / Streak */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex gap-6 mb-8"
      >
        <div className="text-center">
          <span className="text-akili-gold text-xl font-bold">{highScore}</span>
          <span className="text-white/40 text-xs block">High Score</span>
        </div>
        <div className="w-px bg-white/20" />
        <div className="text-center">
          <span className="text-akili-gold text-xl font-bold">{streak}</span>
          <span className="text-white/40 text-xs block">Day Streak</span>
        </div>
      </motion.div>

      {/* Answer Summary */}
      {answers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-full max-w-sm mb-8"
        >
          <h3 className="text-white/60 text-sm mb-3 text-center">Answer Summary</h3>
          <div className="flex justify-center gap-1">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                  answer.isCorrect
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {answer.isCorrect ? '✓' : '✗'}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Share Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        onClick={() => {
          const shareText = `🧠 AKILI Quiz Results!\n\n🎯 Score: ${score}\n✅ Correct: ${correctAnswers}/${totalQuestions}\n📊 Accuracy: ${percentage}%\n\nHow sharp is YOUR African knowledge?`

          if (navigator.share) {
            navigator.share({
              title: 'AKILI Quiz Results',
              text: shareText,
            })
          } else {
            navigator.clipboard.writeText(shareText)
            alert('Results copied to clipboard!')
          }
        }}
        className="mt-4 text-white/40 hover:text-white/60 text-sm flex items-center gap-2 transition-colors"
      >
        <span>📤</span> Share Results
      </motion.button>
    </motion.div>
  )
}

export default GameResults
