// AKILI State Management with Zustand
// Includes security measures and anti-cheat protection

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  secureStore,
  validateScore,
  validateAnswerTiming,
  logSuspiciousActivity,
  generateSessionToken,
  checkRateLimit,
} from './security'

// Custom secure storage adapter for Zustand persist
const secureStorageAdapter = {
  getItem: (name) => {
    const data = secureStore.get(name)
    return data ? JSON.stringify(data) : null
  },
  setItem: (name, value) => {
    try {
      const parsed = JSON.parse(value)
      secureStore.set(name, parsed)
    } catch {
      secureStore.set(name, value)
    }
  },
  removeItem: (name) => {
    secureStore.remove(name)
  },
}

// Game Store with security
export const useGameStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      score: 0,
      streak: 0,
      highScore: 0,

      // Game state
      currentQuestion: null,
      questionIndex: 0,
      answers: [],
      isGameActive: false,
      sessionToken: null,
      questionShownTime: null,

      // Anti-cheat tracking
      suspiciousActions: 0,
      lastAnswerTime: null,

      // Actions
      setUser: (user) => set({ user }),

      // Secure score increment with validation
      incrementScore: (points) => {
        const state = get()

        // Validate points
        if (!validateScore(points) || points < 0 || points > 100) {
          logSuspiciousActivity('invalid_score_increment', { points })
          return
        }

        // Rate limit score updates
        const rateCheck = checkRateLimit('score_update', 20, 10000)
        if (!rateCheck.allowed) {
          logSuspiciousActivity('score_rate_limit', { points })
          return
        }

        const newScore = state.score + points
        const newHighScore = Math.max(state.highScore, newScore)

        set({
          score: newScore,
          highScore: newHighScore,
        })
      },

      incrementStreak: () => {
        const state = get()

        // Rate limit streak updates
        const rateCheck = checkRateLimit('streak_update', 5, 60000)
        if (!rateCheck.allowed) {
          logSuspiciousActivity('streak_rate_limit', {})
          return
        }

        set({ streak: state.streak + 1 })
      },

      resetStreak: () => set({ streak: 0 }),

      // Start game with session token
      startGame: () => {
        const sessionToken = generateSessionToken()
        set({
          isGameActive: true,
          questionIndex: 0,
          answers: [],
          score: 0,
          sessionToken,
          questionShownTime: Date.now(),
          suspiciousActions: 0,
        })
      },

      endGame: () => set({
        isGameActive: false,
        sessionToken: null,
        questionShownTime: null,
      }),

      // Show question and record time
      showQuestion: (question) => {
        set({
          currentQuestion: question,
          questionShownTime: Date.now(),
        })
      },

      // Submit answer with anti-cheat validation
      submitAnswer: (answerIndex, isCorrect) => {
        const state = get()
        const now = Date.now()

        // Validate answer timing
        if (state.questionShownTime) {
          const isValidTiming = validateAnswerTiming(state.questionShownTime, now, 500)

          if (!isValidTiming) {
            logSuspiciousActivity('fast_answer', {
              elapsed: now - state.questionShownTime,
              questionIndex: state.questionIndex,
            })

            // Increment suspicious action counter
            const newSuspiciousCount = state.suspiciousActions + 1
            set({ suspiciousActions: newSuspiciousCount })

            // If too many suspicious actions, flag the game
            if (newSuspiciousCount >= 5) {
              logSuspiciousActivity('flagged_session', {
                sessionToken: state.sessionToken,
                suspiciousCount: newSuspiciousCount,
              })
            }
          }
        }

        // Record answer
        set((state) => ({
          answers: [...state.answers, {
            questionIndex: state.questionIndex,
            answerIndex,
            isCorrect,
            timestamp: now,
            timeToAnswer: state.questionShownTime ? now - state.questionShownTime : null,
          }],
          lastAnswerTime: now,
        }))

        // Award points for correct answer
        if (isCorrect) {
          get().incrementScore(10)
        }
      },

      nextQuestion: () => set((state) => ({
        questionIndex: state.questionIndex + 1,
        questionShownTime: Date.now(),
      })),

      resetGame: () => set({
        score: 0,
        currentQuestion: null,
        questionIndex: 0,
        answers: [],
        isGameActive: false,
        sessionToken: null,
        questionShownTime: null,
        suspiciousActions: 0,
      }),

      // Validate session integrity
      validateSession: () => {
        const state = get()
        if (!state.isGameActive || !state.sessionToken) {
          return false
        }

        // Check for suspicious activity
        if (state.suspiciousActions >= 5) {
          return false
        }

        return true
      },
    }),
    {
      name: 'game-state',
      storage: secureStorageAdapter,
      // Only persist non-sensitive data
      partialize: (state) => ({
        highScore: state.highScore,
        streak: state.streak,
      }),
    }
  )
)

// UI Store (no persistence needed)
export const useUIStore = create((set) => ({
  isLoading: false,
  showModal: false,
  modalContent: null,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  openModal: (content) => set({ showModal: true, modalContent: content }),
  closeModal: () => set({ showModal: false, modalContent: null }),
}))

// Player Progress Store (power-ups, coins, achievements, stats, XP, premium, lives, leagues)
export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // Currency
      coins: 100, // Starting coins

      // XP & Leveling
      xp: 0,
      weeklyXP: 0,

      // Premium Status
      isPremium: false,
      premiumExpiry: null,

      // Lives System (for non-premium users)
      lives: 5,
      maxLives: 5,
      lastLifeRegeneration: null,

      // Daily Rewards
      loginStreak: 0,
      lastLoginReward: null,

      // League
      currentLeague: 'bronze',

      // Referrals
      referralCode: null,
      referralsCount: 0,

      // Power-ups inventory
      powerups: {
        fiftyFifty: 3,
        extraTime: 3,
        skipQuestion: 2,
        doublePoints: 2,
      },

      // Achievements
      unlockedAchievements: [],
      newAchievements: [], // Queue for showing unlock modals

      // Lifetime Stats
      stats: {
        gamesCompleted: 0,
        perfectGames: 0,
        totalScore: 0,
        maxStreak: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        fastestAnswer: null,
        bestAvgTime: null,
        playedAfterMidnight: false,
        playedBefore6AM: false,
        comebackWins: 0,
        categoryCorrect: {
          history: 0,
          geography: 0,
          culture: 0,
          sports: 0,
          music: 0,
          politics: 0,
          science: 0,
          current_affairs: 0,
        },
      },

      // Actions
      addCoins: (amount) => {
        if (amount <= 0) return
        set((state) => ({ coins: state.coins + amount }))
      },

      spendCoins: (amount) => {
        const state = get()
        if (state.coins < amount) return false
        set({ coins: state.coins - amount })
        return true
      },

      usePowerup: (powerupId) => {
        const state = get()
        if (!state.powerups[powerupId] || state.powerups[powerupId] <= 0) {
          return false
        }
        set({
          powerups: {
            ...state.powerups,
            [powerupId]: state.powerups[powerupId] - 1,
          },
        })
        return true
      },

      addPowerup: (powerupId, amount = 1) => {
        set((state) => ({
          powerups: {
            ...state.powerups,
            [powerupId]: (state.powerups[powerupId] || 0) + amount,
          },
        }))
      },

      unlockAchievement: (achievementId) => {
        const state = get()
        if (state.unlockedAchievements.includes(achievementId)) return false

        set({
          unlockedAchievements: [...state.unlockedAchievements, achievementId],
          newAchievements: [...state.newAchievements, achievementId],
        })
        return true
      },

      dismissAchievement: () => {
        set((state) => ({
          newAchievements: state.newAchievements.slice(1),
        }))
      },

      updateStats: (updates) => {
        set((state) => ({
          stats: {
            ...state.stats,
            ...updates,
            // Handle nested categoryCorrect updates
            categoryCorrect: updates.categoryCorrect
              ? { ...state.stats.categoryCorrect, ...updates.categoryCorrect }
              : state.stats.categoryCorrect,
          },
        }))
      },

      recordGameCompletion: (gameData) => {
        const state = get()
        const { correctCount, totalQuestions, score, answers, category } = gameData

        // Check time-based achievements
        const hour = new Date().getHours()
        const playedAfterMidnight = hour >= 0 && hour < 4
        const playedBefore6AM = hour >= 4 && hour < 6

        // Calculate average answer time
        const validTimes = answers
          .filter((a) => a.timeToAnswer)
          .map((a) => a.timeToAnswer)
        const avgTime = validTimes.length > 0
          ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length
          : null

        // Find fastest answer
        const fastestThisGame = validTimes.length > 0
          ? Math.min(...validTimes)
          : null

        // Check for comeback win (first 3 wrong, still won)
        const first3Wrong = answers.slice(0, 3).every((a) => !a.isCorrect)
        const wonGame = correctCount >= totalQuestions * 0.6
        const isComeback = first3Wrong && wonGame

        // Update stats
        const newStats = {
          gamesCompleted: state.stats.gamesCompleted + 1,
          perfectGames: correctCount === totalQuestions
            ? state.stats.perfectGames + 1
            : state.stats.perfectGames,
          totalScore: state.stats.totalScore + score,
          totalCorrect: state.stats.totalCorrect + correctCount,
          totalQuestions: state.stats.totalQuestions + totalQuestions,
          playedAfterMidnight: state.stats.playedAfterMidnight || playedAfterMidnight,
          playedBefore6AM: state.stats.playedBefore6AM || playedBefore6AM,
          comebackWins: isComeback
            ? state.stats.comebackWins + 1
            : state.stats.comebackWins,
        }

        // Update fastest answer if better
        if (fastestThisGame && (!state.stats.fastestAnswer || fastestThisGame < state.stats.fastestAnswer)) {
          newStats.fastestAnswer = fastestThisGame
        }

        // Update best average time if better
        if (avgTime && (!state.stats.bestAvgTime || avgTime < state.stats.bestAvgTime)) {
          newStats.bestAvgTime = avgTime
        }

        // Update category stats
        if (category) {
          const categoryKey = category.id || category
          newStats.categoryCorrect = {
            [categoryKey]: (state.stats.categoryCorrect[categoryKey] || 0) + correctCount,
          }
        }

        get().updateStats(newStats)

        // Award coins based on performance (2x for premium)
        const isPremium = get().isPremium
        const baseCoins = Math.round(score * 0.5) + (correctCount === totalQuestions ? 50 : 0)
        const coinsEarned = isPremium ? baseCoins * 2 : baseCoins
        get().addCoins(coinsEarned)

        // Award XP (2x for premium)
        const baseXP = correctCount * 10 + (correctCount === totalQuestions ? 50 : 0)
        const xpEarned = isPremium ? baseXP * 2 : baseXP
        get().addXP(xpEarned)

        // Use a life if not premium and not perfect game
        if (!isPremium && correctCount < totalQuestions) {
          get().useLife()
        }

        return coinsEarned
      },

      // XP Actions
      addXP: (amount) => {
        if (amount <= 0) return
        set((state) => ({
          xp: state.xp + amount,
          weeklyXP: state.weeklyXP + amount,
        }))
      },

      resetWeeklyXP: () => set({ weeklyXP: 0 }),

      // Lives Actions
      useLife: () => {
        const state = get()
        if (state.isPremium) return true // Premium has unlimited
        if (state.lives <= 0) return false

        set({
          lives: state.lives - 1,
          lastLifeRegeneration: state.lives === state.maxLives ? Date.now() : state.lastLifeRegeneration,
        })
        return true
      },

      regenerateLife: () => {
        const state = get()
        if (state.lives >= state.maxLives) return

        set({
          lives: Math.min(state.lives + 1, state.maxLives),
          lastLifeRegeneration: state.lives + 1 < state.maxLives ? Date.now() : null,
        })
      },

      refillLives: () => set({ lives: 5, lastLifeRegeneration: null }),

      // Premium Actions
      setPremium: (isPremium, expiryDate = null) => {
        set({
          isPremium,
          premiumExpiry: expiryDate,
        })
      },

      // Daily Rewards Actions
      claimDailyReward: (reward) => {
        const state = get()
        const now = new Date()
        const lastClaim = state.lastLoginReward ? new Date(state.lastLoginReward) : null

        // Check if already claimed today
        if (lastClaim) {
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const lastClaimDay = new Date(lastClaim.getFullYear(), lastClaim.getMonth(), lastClaim.getDate())
          if (todayStart.getTime() === lastClaimDay.getTime()) {
            return false // Already claimed
          }
        }

        // Check if streak is maintained (claimed yesterday)
        let newStreak = 1
        if (lastClaim) {
          const diffTime = now - lastClaim
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          if (diffDays === 1) {
            newStreak = state.loginStreak + 1
          }
        }

        // Apply rewards
        get().addCoins(reward.coins)
        get().addXP(reward.xp)
        if (reward.powerup) {
          get().addPowerup(reward.powerup, 1)
        }

        set({
          loginStreak: newStreak,
          lastLoginReward: now.toISOString(),
        })

        return true
      },

      // Referral Actions
      generateReferralCode: () => {
        const code = 'AKILI' + Math.random().toString(36).substring(2, 8).toUpperCase()
        set({ referralCode: code })
        return code
      },

      addReferral: () => {
        const state = get()
        set({ referralsCount: state.referralsCount + 1 })
        // Reward for referral
        get().addCoins(100)
        get().addPowerup('fiftyFifty', 1)
      },

      // League Actions
      updateLeague: (leagueId) => set({ currentLeague: leagueId }),
    }),
    {
      name: 'player-progress',
      storage: secureStorageAdapter,
    }
  )
)

// Auth Store with secure token handling
export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: (user, token) => {
        // Validate user object
        if (!user || typeof user !== 'object') {
          logSuspiciousActivity('invalid_login_user', {})
          return false
        }

        set({
          isAuthenticated: true,
          user,
          token,
        })
        return true
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        })
        // Clear all secure storage on logout
        secureStore.clear()
      },

      updateUser: (updates) => {
        const state = get()
        if (!state.isAuthenticated) return

        set({
          user: { ...state.user, ...updates },
        })
      },
    }),
    {
      name: 'auth-state',
      storage: secureStorageAdapter,
      partialize: (state) => ({
        // Don't persist tokens for security
        isAuthenticated: state.isAuthenticated,
        user: state.user ? {
          id: state.user.id,
          username: state.user.username,
        } : null,
      }),
    }
  )
)
