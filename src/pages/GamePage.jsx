// AKILI Game Page
// Main trivia game screen with questions, timer, scoring, and power-ups

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, usePlayerStore } from '../lib/store'
import { questions, categories, getQuestionsByCategory, getRandomQuestions, getRandomFromCategory } from '../data/questions'
import { getCurrentWeekQuiz } from '../data/dailyContent'
import { applyFiftyFifty } from '../data/powerups'
import { achievements, getNewlyUnlocked } from '../data/achievements'
import Timer from '../components/Timer'
import ProgressBar from '../components/ProgressBar'
import QuestionCard from '../components/QuestionCard'
import GameResults from '../components/GameResults'
import PowerupBar from '../components/PowerupBar'
import AchievementUnlockedModal from '../components/AchievementUnlockedModal'

const QUESTIONS_PER_GAME = 10
const TIME_PER_QUESTION = 15 // seconds

const GamePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Game state
  const [gameState, setGameState] = useState('loading')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameQuestions, setGameQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [timerKey, setTimerKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [totalTime, setTotalTime] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [questionStartTime, setQuestionStartTime] = useState(null)

  // Power-up state
  const [eliminatedOptions, setEliminatedOptions] = useState([])
  const [extraTimeAdded, setExtraTimeAdded] = useState(0)
  const [doublePointsActive, setDoublePointsActive] = useState(false)
  const [usedPowerupsThisQuestion, setUsedPowerupsThisQuestion] = useState([])
  const [coinsEarned, setCoinsEarned] = useState(0)

  // Achievement state
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState(null)

  // Timer ref for extra time
  const timerDuration = useRef(TIME_PER_QUESTION)

  // Store actions
  const {
    startGame,
    endGame,
    showQuestion,
    submitAnswer,
    incrementStreak,
    highScore,
    streak,
  } = useGameStore()

  const {
    powerups: powerupInventory,
    usePowerup,
    recordGameCompletion,
    stats,
    unlockedAchievements,
    unlockAchievement,
    newAchievements,
    dismissAchievement,
    coins,
  } = usePlayerStore()

  // Get category, difficulty, and country from URL params
  const categoryId = searchParams.get('category') || 'random'
  const difficulty = searchParams.get('difficulty') || 'medium'
  const country = searchParams.get('country') || null
  const isWeeklyQuiz = searchParams.get('type') === 'weekly'

  // Get category info
  const categoryInfo = categories.find(c => c.id === categoryId)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [categoryId, difficulty, country, isWeeklyQuiz])

  // Show achievement modals when new achievements are unlocked
  useEffect(() => {
    if (newAchievements.length > 0 && !showAchievementModal) {
      const achievementId = newAchievements[0]
      const achievement = achievements[achievementId]
      if (achievement) {
        setCurrentAchievement(achievement)
        setShowAchievementModal(true)
      }
    }
  }, [newAchievements, showAchievementModal])

  const initializeGame = () => {
    setGameState('loading')

    let selectedQuestions

    if (isWeeklyQuiz) {
      const weeklyQuiz = getCurrentWeekQuiz()
      selectedQuestions = weeklyQuiz?.questions || []
    } else if (categoryId && categoryId !== 'random') {
      // Use the new function that avoids recently used questions
      selectedQuestions = getRandomFromCategory(categoryId, QUESTIONS_PER_GAME, difficulty, country)
    } else {
      // Random mix from all categories, avoiding repeats
      selectedQuestions = getRandomQuestions(QUESTIONS_PER_GAME, difficulty, country)
    }

    // Fallback if not enough questions (only when NO country is selected)
    // When a country IS selected, we strictly show only that country's questions
    if (!country && selectedQuestions.length < QUESTIONS_PER_GAME) {
      const remaining = QUESTIONS_PER_GAME - selectedQuestions.length
      const existingIds = selectedQuestions.map(q => q.id)

      // First try: same category
      if (categoryId && categoryId !== 'random') {
        let moreQuestions = getRandomFromCategory(categoryId, remaining, difficulty, null)
          .filter(q => !existingIds.includes(q.id))
        selectedQuestions = [...selectedQuestions, ...moreQuestions]
      }

      // Second try: if still not enough, get random questions from any category
      if (selectedQuestions.length < QUESTIONS_PER_GAME) {
        const stillRemaining = QUESTIONS_PER_GAME - selectedQuestions.length
        const allIds = selectedQuestions.map(q => q.id)
        let moreQuestions = getRandomQuestions(stillRemaining, difficulty, null)
          .filter(q => !allIds.includes(q.id))
        selectedQuestions = [...selectedQuestions, ...moreQuestions]
      }
    }

    setGameQuestions(selectedQuestions)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setScore(0)
    setCorrectCount(0)
    setTimerKey(0)
    setEliminatedOptions([])
    setExtraTimeAdded(0)
    setDoublePointsActive(false)
    setUsedPowerupsThisQuestion([])
    setCoinsEarned(0)
    timerDuration.current = TIME_PER_QUESTION

    setCountdown(3)
    setGameState('countdown')
  }

  // Countdown effect
  useEffect(() => {
    if (gameState !== 'countdown') return

    if (countdown <= 0) {
      startGame()
      setStartTime(Date.now())
      setQuestionStartTime(Date.now())
      setGameState('playing')
      showQuestion(gameQuestions[0])
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, gameState, gameQuestions])

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Handle power-up usage
  const handleUsePowerup = (powerupId) => {
    const currentQuestion = gameQuestions[currentQuestionIndex]
    if (!currentQuestion) return

    // Check if already used this question
    if (usedPowerupsThisQuestion.includes(powerupId)) return

    // Try to use the power-up
    const success = usePowerup(powerupId)
    if (!success) return

    setUsedPowerupsThisQuestion(prev => [...prev, powerupId])

    switch (powerupId) {
      case 'fiftyFifty':
        const toEliminate = applyFiftyFifty(currentQuestion)
        setEliminatedOptions(toEliminate)
        break

      case 'extraTime':
        setExtraTimeAdded(10)
        timerDuration.current = TIME_PER_QUESTION + 10
        setTimerKey(prev => prev + 1) // Reset timer with new duration
        break

      case 'skipQuestion':
        // Skip without penalty - move to next question
        handleSkipQuestion()
        break

      case 'doublePoints':
        setDoublePointsActive(true)
        break
    }
  }

  // Handle skip question
  const handleSkipQuestion = () => {
    const newAnswer = {
      questionIndex: currentQuestionIndex,
      answerIndex: -1,
      isCorrect: false,
      skipped: true,
      timestamp: Date.now(),
      timeToAnswer: questionStartTime ? Date.now() - questionStartTime : null,
    }
    setAnswers(prev => [...prev, newAnswer])

    moveToNextQuestion()
  }

  // Move to next question
  const moveToNextQuestion = () => {
    // Reset power-up states
    setEliminatedOptions([])
    setExtraTimeAdded(0)
    setDoublePointsActive(false)
    setUsedPowerupsThisQuestion([])
    timerDuration.current = TIME_PER_QUESTION

    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setTimerKey(prev => prev + 1)
      setQuestionStartTime(Date.now())
      showQuestion(gameQuestions[currentQuestionIndex + 1])
    } else {
      finishGame()
    }
  }

  // Handle answer
  const handleAnswer = useCallback((answerIndex, isCorrect) => {
    const currentQuestion = gameQuestions[currentQuestionIndex]
    const answerTime = Date.now()
    const timeToAnswer = questionStartTime ? answerTime - questionStartTime : null

    // Record answer
    const newAnswer = {
      questionIndex: currentQuestionIndex,
      answerIndex,
      isCorrect,
      timestamp: answerTime,
      timeToAnswer,
      category: currentQuestion.category,
    }
    setAnswers(prev => [...prev, newAnswer])

    // Update score
    if (isCorrect) {
      const basePoints = 10
      const difficultyBonus =
        currentQuestion.difficulty === 'easy' ? 0 :
        currentQuestion.difficulty === 'medium' ? 5 : 10

      let points = basePoints + difficultyBonus

      // Apply double points if active
      if (doublePointsActive) {
        points *= 2
      }

      setScore(prev => prev + points)
      setCorrectCount(prev => prev + 1)
    }

    // Submit to store (includes anti-cheat)
    submitAnswer(answerIndex, isCorrect)

    // Move to next question
    setTimeout(() => {
      moveToNextQuestion()
    }, 500)
  }, [currentQuestionIndex, gameQuestions, submitAnswer, showQuestion, questionStartTime, doublePointsActive])

  // Handle time up
  const handleTimeUp = useCallback(() => {
    handleAnswer(-1, false)
  }, [handleAnswer])

  // Finish game
  const finishGame = () => {
    const endTime = Date.now()
    const elapsed = Math.round((endTime - startTime) / 1000)
    setTotalTime(elapsed)
    setGameState('finished')
    endGame()

    // Update streak if good performance
    if (correctCount >= gameQuestions.length * 0.7) {
      incrementStreak()
    }

    // Record game completion and get coins earned
    const earned = recordGameCompletion({
      correctCount,
      totalQuestions: gameQuestions.length,
      score,
      answers,
      category: categoryInfo,
    })
    setCoinsEarned(earned)

    // Check for new achievements
    const updatedStats = {
      ...stats,
      gamesCompleted: stats.gamesCompleted + 1,
      totalScore: stats.totalScore + score,
      perfectGames: correctCount === gameQuestions.length ? stats.perfectGames + 1 : stats.perfectGames,
      maxStreak: Math.max(stats.maxStreak, streak),
    }

    const newlyUnlocked = getNewlyUnlocked(updatedStats, unlockedAchievements)
    newlyUnlocked.forEach(achievement => {
      unlockAchievement(achievement.id)
    })
  }

  // Handle achievement modal close
  const handleAchievementClose = () => {
    setShowAchievementModal(false)
    setCurrentAchievement(null)
    dismissAchievement()
  }

  // Play again
  const handlePlayAgain = () => {
    initializeGame()
  }

  // Current question
  const currentQuestion = gameQuestions[currentQuestionIndex]

  // Render based on game state
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-akili-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-akili-gold border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (gameState === 'countdown') {
    return (
      <div className="min-h-screen bg-akili-black flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-4xl mb-2 block">
            {categoryInfo?.icon || '🧠'}
          </span>
          <h2 className="text-xl font-bold text-white">
            {categoryInfo?.name || 'Mixed Questions'}
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {gameQuestions.length} questions
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="text-8xl font-bold text-akili-gold"
          >
            {countdown === 0 ? 'GO!' : countdown}
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/40 mt-8"
        >
          Get ready...
        </motion.p>
      </div>
    )
  }

  if (gameState === 'finished') {
    return (
      <>
        <GameResults
          score={score}
          totalQuestions={gameQuestions.length}
          correctAnswers={correctCount}
          category={categoryInfo}
          timeTaken={totalTime}
          answers={answers}
          onPlayAgain={handlePlayAgain}
          onGoHome={() => navigate('/')}
          coinsEarned={coinsEarned}
        />
        <AchievementUnlockedModal
          achievement={currentAchievement}
          isOpen={showAchievementModal}
          onClose={handleAchievementClose}
        />
      </>
    )
  }

  // Main game UI
  return (
    <div className="min-h-screen bg-akili-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-akili-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
                  endGame()
                  navigate('/')
                }
              }}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Timer */}
            <Timer
              key={timerKey}
              duration={timerDuration.current}
              onTimeUp={handleTimeUp}
              isPaused={isPaused}
              size="small"
            />

            {/* Score & Coins */}
            <div className="text-right">
              <span className="text-akili-gold font-bold text-xl">{score}</span>
              <div className="flex items-center justify-end gap-1 text-white/40 text-xs">
                <span>🪙</span>
                <span>{coins}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={gameQuestions.length}
              correctCount={correctCount}
              answers={answers}
              showDots={gameQuestions.length <= 15}
            />
          </div>
        </div>
      </header>

      {/* Question Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {/* Double Points Indicator */}
        <AnimatePresence>
          {doublePointsActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 text-center"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-akili-gold/20 text-akili-gold text-sm font-bold rounded-full">
                <span>💎</span> 2x POINTS ACTIVE
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion?.id || currentQuestionIndex}
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={isPaused}
            eliminatedOptions={eliminatedOptions}
          />
        </AnimatePresence>
      </main>

      {/* Power-ups Footer */}
      <footer className="bg-akili-black/90 backdrop-blur-lg border-t border-white/5 py-4">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-center text-white/30 text-xs mb-3">Power-ups</p>
          <PowerupBar
            inventory={powerupInventory}
            onUsePowerup={handleUsePowerup}
            disabled={isPaused}
            usedThisQuestion={usedPowerupsThisQuestion}
          />
        </div>
      </footer>

      {/* Achievement Modal */}
      <AchievementUnlockedModal
        achievement={currentAchievement}
        isOpen={showAchievementModal}
        onClose={handleAchievementClose}
      />
    </div>
  )
}

export default GamePage
