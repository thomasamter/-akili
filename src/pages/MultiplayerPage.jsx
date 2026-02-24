// AKILI Multiplayer Battle Mode
// Real-time 1v1 trivia battles

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../lib/store'
import { getRandomQuestions } from '../data/questions'
import {
  createGameRoom,
  joinGameRoom,
  subscribeToRoom,
  updatePlayerScore,
  startMultiplayerGame,
  endMultiplayerGame,
  leaveRoom,
} from '../lib/firebase'

const QUESTIONS_PER_GAME = 10
const TIME_PER_QUESTION = 15

const MultiplayerPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  // Game state
  const [screen, setScreen] = useState('menu') // menu, create, join, lobby, countdown, playing, results
  const [roomCode, setRoomCode] = useState('')
  const [inputCode, setInputCode] = useState('')
  const [error, setError] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [roomData, setRoomData] = useState(null)
  const [difficulty, setDifficulty] = useState('medium')

  // Game play state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [myScore, setMyScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [countdown, setCountdown] = useState(3)

  // Get player name
  const playerName = user?.displayName || 'Guest'
  const playerId = user?.id || `guest_${Date.now()}`

  // Subscribe to room updates
  useEffect(() => {
    if (!roomCode) return

    const unsubscribe = subscribeToRoom(roomCode, (data) => {
      if (!data) {
        setError('Room was closed')
        setScreen('menu')
        return
      }
      setRoomData(data)

      // Handle status changes
      if (data.status === 'countdown' && screen === 'lobby') {
        setScreen('countdown')
        setCountdown(3)
      } else if (data.status === 'playing' && screen === 'countdown') {
        setScreen('playing')
      } else if (data.status === 'finished' && screen === 'playing') {
        setScreen('results')
      }
    })

    return () => unsubscribe()
  }, [roomCode, screen])

  // Countdown timer
  useEffect(() => {
    if (screen !== 'countdown') return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [screen])

  // Question timer
  useEffect(() => {
    if (screen !== 'playing' || showResult) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1) // Time's up
          return TIME_PER_QUESTION
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [screen, showResult, currentQuestionIndex])

  // Create a new room
  const handleCreateRoom = async () => {
    setError('')
    setError('Creating room...')

    try {
      const questions = getRandomQuestions(QUESTIONS_PER_GAME, difficulty)

      const { roomCode: newCode, error: createError } = await createGameRoom(
        playerId,
        playerName,
        questions,
        difficulty
      )

      if (createError) {
        setError('Error: ' + createError)
        return
      }

      if (!newCode) {
        setError('Failed to create room - no code returned')
        return
      }

      setRoomCode(newCode)
      setIsHost(true)
      setScreen('lobby')
    } catch (err) {
      setError('Error: ' + err.message)
      console.error('Create room error:', err)
    }
  }

  // Join an existing room
  const handleJoinRoom = async () => {
    setError('')
    if (inputCode.length !== 6) {
      setError('Please enter a 6-character code')
      return
    }

    const { success, error: joinError } = await joinGameRoom(
      inputCode.toUpperCase(),
      playerId,
      playerName
    )

    if (!success) {
      setError(joinError || 'Failed to join room')
      return
    }

    setRoomCode(inputCode.toUpperCase())
    setIsHost(false)
    setScreen('lobby')
  }

  // Start the game (host only)
  const handleStartGame = async () => {
    if (!isHost || !roomData?.guest) return
    await startMultiplayerGame(roomCode)
  }

  // Handle answer selection
  const handleAnswer = async (answerIndex) => {
    if (selectedAnswer !== null) return

    const currentQuestion = roomData?.questions?.[currentQuestionIndex]
    if (!currentQuestion) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const pointsEarned = isCorrect ? Math.max(10, timeLeft * 2) : 0
    const newScore = myScore + pointsEarned

    setMyScore(newScore)

    // Update score in Firebase
    await updatePlayerScore(roomCode, playerId, isHost, newScore, currentQuestionIndex + 1, {
      questionIndex: currentQuestionIndex,
      answer: answerIndex,
      correct: isCorrect,
      points: pointsEarned,
      timeLeft,
    })

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex + 1 >= QUESTIONS_PER_GAME) {
        // Game finished
        endMultiplayerGame(roomCode)
      } else {
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeLeft(TIME_PER_QUESTION)
      }
    }, 1500)
  }

  // Leave the room
  const handleLeave = async () => {
    if (roomCode) {
      await leaveRoom(roomCode, isHost)
    }
    setRoomCode('')
    setRoomData(null)
    setScreen('menu')
    setMyScore(0)
    setCurrentQuestionIndex(0)
  }

  // Get opponent data
  const opponent = isHost ? roomData?.guest : roomData?.host
  const opponentScore = opponent?.score || 0

  // Current question
  const currentQuestion = roomData?.questions?.[currentQuestionIndex]

  // Render menu screen
  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-akili-black flex flex-col">
        <header className="p-4">
          <button onClick={() => navigate('/')} className="text-white/40 hover:text-white">
            ← Back
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <span className="text-6xl mb-4 block">⚡💪🏾</span>
            <h1 className="text-3xl font-bold text-white mb-2">Battle Mode</h1>
            <p className="text-white/60">Challenge a friend to a trivia duel!</p>
          </motion.div>

          {/* Difficulty selector */}
          <div className="w-full max-w-sm mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 text-center">Difficulty</p>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                    difficulty === d
                      ? d === 'easy' ? 'bg-green-500 text-white'
                        : d === 'hard' ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-black'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {d === 'easy' ? '🍠' : d === 'medium' ? '🌽' : '🌶️'} {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={handleCreateRoom}
              className="w-full py-4 bg-akili-gold text-akili-black font-bold text-lg rounded-xl hover:bg-akili-gold/90 transition-colors"
            >
              Create Game
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/40 text-sm">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="Enter room code"
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl tracking-widest placeholder:text-white/30 focus:outline-none focus:border-akili-gold"
              />
              <button
                onClick={handleJoinRoom}
                disabled={inputCode.length !== 6}
                className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                Join Game
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Render lobby screen
  if (screen === 'lobby') {
    return (
      <div className="min-h-screen bg-akili-black flex flex-col">
        <header className="p-4 flex justify-between items-center">
          <button onClick={handleLeave} className="text-white/40 hover:text-white">
            ← Leave
          </button>
          <div className="text-akili-gold font-mono text-lg">{roomCode}</div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <h1 className="text-2xl font-bold text-white mb-8">Waiting Room</h1>

          <div className="w-full max-w-sm space-y-4 mb-8">
            {/* Host */}
            <div className="p-4 bg-white/10 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-akili-gold/20 flex items-center justify-center text-2xl">
                👑
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{roomData?.host?.name || 'Host'}</p>
                <p className="text-green-400 text-sm">Ready</p>
              </div>
              {isHost && <span className="text-akili-gold text-sm">You</span>}
            </div>

            {/* Guest */}
            <div className="p-4 bg-white/10 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                {roomData?.guest ? '⚔️' : '❓'}
              </div>
              <div className="flex-1">
                {roomData?.guest ? (
                  <>
                    <p className="text-white font-semibold">{roomData.guest.name}</p>
                    <p className="text-green-400 text-sm">Ready</p>
                  </>
                ) : (
                  <>
                    <p className="text-white/40">Waiting for opponent...</p>
                    <p className="text-white/20 text-sm">Share the code above</p>
                  </>
                )}
              </div>
              {!isHost && roomData?.guest && <span className="text-akili-gold text-sm">You</span>}
            </div>
          </div>

          {/* Share code */}
          {isHost && !roomData?.guest && (
            <div className="text-center mb-8">
              <p className="text-white/60 mb-2">Share this code with your friend:</p>
              <div className="text-4xl font-mono font-bold text-akili-gold tracking-widest">
                {roomCode}
              </div>
            </div>
          )}

          {/* Start button (host only) */}
          {isHost && roomData?.guest && (
            <button
              onClick={handleStartGame}
              className="w-full max-w-sm py-4 bg-akili-gold text-akili-black font-bold text-lg rounded-xl hover:bg-akili-gold/90 transition-colors"
            >
              Start Battle!
            </button>
          )}

          {!isHost && (
            <p className="text-white/60">Waiting for host to start...</p>
          )}
        </main>
      </div>
    )
  }

  // Render countdown screen
  if (screen === 'countdown') {
    return (
      <div className="min-h-screen bg-akili-black flex items-center justify-center">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-center"
        >
          <span className="text-8xl font-bold text-akili-gold">
            {countdown > 0 ? countdown : 'GO!'}
          </span>
        </motion.div>
      </div>
    )
  }

  // Render playing screen
  if (screen === 'playing' && currentQuestion) {
    return (
      <div className="min-h-screen bg-akili-black flex flex-col">
        {/* Header with scores */}
        <header className="p-4 border-b border-white/10">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            {/* My score */}
            <div className="text-center">
              <p className="text-white font-bold text-xl">{myScore}</p>
              <p className="text-white/60 text-xs">{isHost ? 'You' : playerName}</p>
            </div>

            {/* Timer */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
              timeLeft <= 5 ? 'bg-red-500 text-white' : 'bg-akili-gold text-black'
            }`}>
              {timeLeft}
            </div>

            {/* Opponent score */}
            <div className="text-center">
              <p className="text-white font-bold text-xl">{opponentScore}</p>
              <p className="text-white/60 text-xs">{opponent?.name || 'Opponent'}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="max-w-lg mx-auto mt-3">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-akili-gold transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS_PER_GAME) * 100}%` }}
              />
            </div>
            <p className="text-white/40 text-xs text-center mt-1">
              Question {currentQuestionIndex + 1} of {QUESTIONS_PER_GAME}
            </p>
          </div>
        </header>

        {/* Question */}
        <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = 'w-full p-4 rounded-xl text-left transition-all '

                if (showResult) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass += 'bg-green-500 text-white'
                  } else if (index === selectedAnswer) {
                    buttonClass += 'bg-red-500 text-white'
                  } else {
                    buttonClass += 'bg-white/10 text-white/40'
                  }
                } else if (selectedAnswer === index) {
                  buttonClass += 'bg-akili-gold text-black'
                } else {
                  buttonClass += 'bg-white/10 text-white hover:bg-white/20'
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={buttonClass}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // Render results screen
  if (screen === 'results') {
    const myFinalScore = isHost ? roomData?.host?.score || 0 : roomData?.guest?.score || 0
    const opponentFinalScore = isHost ? roomData?.guest?.score || 0 : roomData?.host?.score || 0
    const iWon = myFinalScore > opponentFinalScore
    const isTie = myFinalScore === opponentFinalScore

    return (
      <div className="min-h-screen bg-akili-black flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <span className="text-6xl mb-4 block">
            {isTie ? '🤝' : iWon ? '🏆' : '😢'}
          </span>
          <h1 className={`text-3xl font-bold mb-2 ${
            isTie ? 'text-yellow-400' : iWon ? 'text-green-400' : 'text-red-400'
          }`}>
            {isTie ? "It's a Tie!" : iWon ? 'You Won!' : 'You Lost!'}
          </h1>
        </motion.div>

        {/* Score comparison */}
        <div className="w-full max-w-sm mt-8 p-6 bg-white/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{myFinalScore}</p>
              <p className="text-white/60 text-sm">You</p>
            </div>
            <span className="text-white/40 text-2xl">vs</span>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{opponentFinalScore}</p>
              <p className="text-white/60 text-sm">{opponent?.name}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full max-w-sm mt-8 space-y-3">
          <button
            onClick={() => {
              handleLeave()
              setScreen('menu')
            }}
            className="w-full py-4 bg-akili-gold text-akili-black font-bold rounded-xl"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-white/10 text-white font-medium rounded-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default MultiplayerPage
