// AKILI Progress Bar Component
// Shows progress through the quiz

import { motion } from 'framer-motion'

const ProgressBar = ({
  current,
  total,
  correctCount = 0,
  showDots = true,
  answers = [] // Array of { isCorrect: boolean } for each answered question
}) => {
  const progress = (current / total) * 100

  return (
    <div className="w-full">
      {/* Question counter */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/60 text-sm">
          Question {current} of {total}
        </span>
        <span className="text-akili-gold text-sm font-medium">
          {correctCount} correct
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-akili-gold to-yellow-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Question dots indicator */}
      {showDots && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: total }).map((_, index) => {
            const answer = answers[index]
            const isCurrent = index === current - 1
            const isAnswered = index < current - 1

            let dotColor = 'bg-white/20' // Default unanswered
            if (isAnswered && answer) {
              dotColor = answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
            } else if (isCurrent) {
              dotColor = 'bg-akili-gold'
            }

            return (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${dotColor}`}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  opacity: isCurrent ? 1 : 0.8
                }}
                transition={{ duration: 0.2 }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProgressBar
