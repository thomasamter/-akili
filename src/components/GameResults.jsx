// AKILI Game Results Component
// Shows quiz completion summary and stats

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../lib/store'

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-akili-black flex flex-col items-center justify-center p-6"
    >
      {/* Performance Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="text-7xl mb-4"
      >
        {performance.emoji}
      </motion.div>

      {/* Performance Message */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-3xl md:text-4xl font-bold ${performance.color} mb-2`}
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
          className="flex items-center gap-2 bg-akili-gold/20 rounded-full px-4 py-2 mb-8"
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
        className="relative w-40 h-40 mb-8"
      >
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#FDB913"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 70}
            initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 70 * (1 - percentage / 100)
            }}
            transition={{ duration: 1, delay: 0.6 }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-4xl font-bold text-white"
          >
            {percentage}%
          </motion.span>
          <span className="text-white/40 text-sm">Score</span>
        </div>
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

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        <button
          onClick={onPlayAgain}
          className="w-full py-4 bg-akili-gold text-akili-black font-bold rounded-xl hover:bg-akili-gold/90 transition-colors"
        >
          Play Again
        </button>

        <button
          onClick={onGoHome || (() => navigate('/'))}
          className="w-full py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
        >
          Back to Home
        </button>
      </motion.div>

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
