// AKILI Question Card Component
// Displays trivia question with multiple choice answers

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QuestionCard = ({
  question,
  onAnswer,
  disabled = false,
  showResult = false,
  selectedAnswer = null,
  eliminatedOptions = [], // For 50/50 power-up
}) => {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  // Reset state when question changes
  useEffect(() => {
    setSelected(null)
    setRevealed(false)
  }, [question?.id])

  // Handle answer selection
  const handleSelect = (index) => {
    if (disabled || revealed) return

    // Check if option is eliminated
    if (eliminatedOptions.includes(index)) return

    setSelected(index)
    setRevealed(true)

    const isCorrect = index === question.correctAnswer

    // Delay before calling onAnswer to show feedback
    setTimeout(() => {
      onAnswer(index, isCorrect)
    }, 1200)
  }

  // Check if option is eliminated (50/50)
  const isEliminated = (index) => eliminatedOptions.includes(index)

  // Get option styling based on state
  const getOptionStyle = (index) => {
    // Eliminated by 50/50
    if (isEliminated(index)) {
      return 'border-white/5 bg-white/5 opacity-30 cursor-not-allowed line-through'
    }

    if (!revealed) {
      return selected === index
        ? 'border-akili-gold bg-akili-gold/10'
        : 'border-white/20 hover:border-akili-gold/50 hover:bg-white/5'
    }

    // After reveal
    if (index === question.correctAnswer) {
      return 'border-green-500 bg-green-500/20'
    }
    if (selected === index && index !== question.correctAnswer) {
      return 'border-red-500 bg-red-500/20'
    }
    return 'border-white/10 opacity-50'
  }

  // Get icon for answer feedback
  const getOptionIcon = (index) => {
    if (!revealed) return null

    if (index === question.correctAnswer) {
      return (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-green-500 text-xl"
        >
          ✓
        </motion.span>
      )
    }
    if (selected === index && index !== question.correctAnswer) {
      return (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-red-500 text-xl"
        >
          ✗
        </motion.span>
      )
    }
    return null
  }

  // Option labels (A, B, C, D)
  const optionLabels = ['A', 'B', 'C', 'D']

  if (!question) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      {/* Category & Difficulty Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-akili-gold/20 text-akili-gold text-xs font-medium rounded-full uppercase">
          {question.category?.replace('_', ' ')}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
          question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {question.difficulty}
        </span>
        {question.country && (
          <span className="text-white/40 text-xs ml-auto">
            {question.country}
          </span>
        )}
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 leading-relaxed">
        {question.question}
      </h2>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={disabled || revealed}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-3 ${getOptionStyle(index)}`}
            whileHover={!disabled && !revealed ? { scale: 1.01 } : {}}
            whileTap={!disabled && !revealed ? { scale: 0.99 } : {}}
          >
            {/* Option label */}
            <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
              revealed && index === question.correctAnswer
                ? 'bg-green-500 text-white'
                : revealed && selected === index
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-white/60'
            }`}>
              {optionLabels[index]}
            </span>

            {/* Option text */}
            <span className="flex-1 text-white font-medium">
              {option}
            </span>

            {/* Feedback icon */}
            {getOptionIcon(index)}
          </motion.button>
        ))}
      </div>

      {/* Explanation (shown after answer) */}
      <AnimatePresence>
        {revealed && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="flex items-start gap-2">
              <span className="text-akili-gold">💡</span>
              <p className="text-white/70 text-sm leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default QuestionCard
