// AKILI Leaderboard System
// Per-topic rankings, global/national leaderboards, Bronze→Diamond progression

import {
  getDatabase,
  ref,
  set,
  get,
  update,
  query,
  orderByChild,
  limitToLast,
  equalTo,
} from 'firebase/database'

const rtdb = getDatabase()

// ============ RANK TIERS ============

export const rankTiers = [
  { id: 'bronze', name: 'Bronze', icon: '🥉', minXP: 0, color: 'from-amber-700 to-amber-900' },
  { id: 'silver', name: 'Silver', icon: '🥈', minXP: 500, color: 'from-gray-300 to-gray-500' },
  { id: 'gold', name: 'Gold', icon: '🥇', minXP: 2000, color: 'from-yellow-400 to-yellow-600' },
  { id: 'platinum', name: 'Platinum', icon: '💠', minXP: 5000, color: 'from-cyan-300 to-cyan-500' },
  { id: 'diamond', name: 'Diamond', icon: '💎', minXP: 10000, color: 'from-blue-400 to-purple-500' },
  { id: 'master', name: 'Master', icon: '👑', minXP: 25000, color: 'from-purple-500 to-pink-500' },
  { id: 'legend', name: 'Legend', icon: '🏆', minXP: 50000, color: 'from-akili-gold to-yellow-300' },
]

// Get rank tier from XP
export const getRankFromXP = (xp) => {
  for (let i = rankTiers.length - 1; i >= 0; i--) {
    if (xp >= rankTiers[i].minXP) {
      return rankTiers[i]
    }
  }
  return rankTiers[0]
}

// Get progress to next rank
export const getProgressToNextRank = (xp) => {
  const currentRank = getRankFromXP(xp)
  const currentIndex = rankTiers.findIndex(r => r.id === currentRank.id)

  if (currentIndex >= rankTiers.length - 1) {
    return { progress: 100, nextRank: null, xpNeeded: 0 }
  }

  const nextRank = rankTiers[currentIndex + 1]
  const xpInCurrentTier = xp - currentRank.minXP
  const xpNeededForNext = nextRank.minXP - currentRank.minXP
  const progress = Math.min(100, (xpInCurrentTier / xpNeededForNext) * 100)

  return {
    progress,
    nextRank,
    xpNeeded: nextRank.minXP - xp
  }
}

// ============ CATEGORY STATS ============

// Update player's category stats
export const updateCategoryStats = async (userId, userName, categoryId, stats, country = 'Global') => {
  try {
    const playerRef = ref(rtdb, `categoryLeaderboards/${categoryId}/${userId}`)

    // Get existing stats
    const snapshot = await get(playerRef)
    const existing = snapshot.exists() ? snapshot.val() : { xp: 0, games: 0, correct: 0 }

    const newStats = {
      userId: userId,
      userName,
      country,
      xp: existing.xp + (stats.xp || 0),
      games: existing.games + 1,
      correct: existing.correct + (stats.correct || 0),
      totalQuestions: (existing.totalQuestions || 0) + (stats.totalQuestions || 0),
      lastPlayed: Date.now(),
    }

    // Calculate accuracy
    newStats.accuracy = newStats.totalQuestions > 0
      ? Math.round((newStats.correct / newStats.totalQuestions) * 100)
      : 0

    // Get rank
    newStats.rank = getRankFromXP(newStats.xp).id

    await set(playerRef, newStats)

    // Also update global stats
    await updateGlobalStats(userId, userName, stats, country)

    return { success: true, stats: newStats }
  } catch (error) {
    console.error('Error updating category stats:', error)
    return { success: false, error: error.message }
  }
}

// Get player's stats for a category
export const getCategoryStats = async (userId, categoryId) => {
  try {
    const snapshot = await get(ref(rtdb, `categoryLeaderboards/${categoryId}/${userId}`))
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return { xp: 0, games: 0, correct: 0, rank: 'bronze' }
  } catch (error) {
    console.error('Error getting category stats:', error)
    return { xp: 0, games: 0, correct: 0, rank: 'bronze' }
  }
}

// Get all category stats for a player
export const getAllCategoryStats = async (userId) => {
  try {
    const categories = ['history', 'geography', 'culture', 'sports', 'music', 'politics', 'science', 'entertainment', 'current_affairs']
    const stats = {}

    for (const categoryId of categories) {
      stats[categoryId] = await getCategoryStats(userId, categoryId)
    }

    return stats
  } catch (error) {
    console.error('Error getting all category stats:', error)
    return {}
  }
}

// ============ LEADERBOARDS ============

// Get category leaderboard
export const getCategoryLeaderboard = async (categoryId, limit = 50) => {
  try {
    const leaderboardRef = query(
      ref(rtdb, `categoryLeaderboards/${categoryId}`),
      orderByChild('xp'),
      limitToLast(limit)
    )

    const snapshot = await get(leaderboardRef)
    if (!snapshot.exists()) return []

    const players = []
    snapshot.forEach((child) => {
      players.push({
        userId: child.key,
        ...child.val()
      })
    })

    // Sort descending by XP
    return players.sort((a, b) => b.xp - a.xp)
  } catch (error) {
    console.error('Error getting category leaderboard:', error)
    return []
  }
}

// Get global leaderboard
export const getGlobalLeaderboard = async (limit = 50, country = null) => {
  try {
    let leaderboardRef

    if (country) {
      leaderboardRef = query(
        ref(rtdb, 'globalLeaderboard'),
        orderByChild('country'),
        equalTo(country),
        limitToLast(limit)
      )
    } else {
      leaderboardRef = query(
        ref(rtdb, 'globalLeaderboard'),
        orderByChild('totalXP'),
        limitToLast(limit)
      )
    }

    const snapshot = await get(leaderboardRef)
    if (!snapshot.exists()) return []

    const players = []
    snapshot.forEach((child) => {
      players.push({
        userId: child.key,
        ...child.val()
      })
    })

    // Sort descending by XP
    return players.sort((a, b) => b.totalXP - a.totalXP)
  } catch (error) {
    console.error('Error getting global leaderboard:', error)
    return []
  }
}

// Update global stats
export const updateGlobalStats = async (userId, userName, stats, country = 'Global') => {
  try {
    const playerRef = ref(rtdb, `globalLeaderboard/${userId}`)

    // Get existing stats
    const snapshot = await get(playerRef)
    const existing = snapshot.exists() ? snapshot.val() : { totalXP: 0, totalGames: 0, totalCorrect: 0 }

    const newStats = {
      userId: userId,
      userName,
      country,
      totalXP: existing.totalXP + (stats.xp || 0),
      totalGames: existing.totalGames + 1,
      totalCorrect: existing.totalCorrect + (stats.correct || 0),
      lastPlayed: Date.now(),
    }

    // Get overall rank
    newStats.rank = getRankFromXP(newStats.totalXP).id

    await set(playerRef, newStats)
    return { success: true }
  } catch (error) {
    console.error('Error updating global stats:', error)
    return { success: false }
  }
}

// Get player's global rank
export const getPlayerGlobalRank = async (userId) => {
  try {
    const leaderboard = await getGlobalLeaderboard(1000)
    const index = leaderboard.findIndex(p => p.userId === userId)
    return index >= 0 ? index + 1 : null
  } catch (error) {
    return null
  }
}

// Get player's rank in a category
export const getPlayerCategoryRank = async (userId, categoryId) => {
  try {
    const leaderboard = await getCategoryLeaderboard(categoryId, 1000)
    const index = leaderboard.findIndex(p => p.userId === userId)
    return index >= 0 ? index + 1 : null
  } catch (error) {
    return null
  }
}

// ============ COUNTRIES LIST ============

export const africanCountries = [
  'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia', 'Egypt',
  'Tanzania', 'Senegal', 'DR Congo', 'Uganda', 'Zimbabwe', 'Sudan',
  'Morocco', 'Algeria', 'Tunisia', 'Rwanda', 'Cameroon', 'Ivory Coast',
  'Angola', 'Mozambique', 'Zambia', 'Botswana', 'Namibia', 'Malawi',
]

export default {
  rankTiers,
  getRankFromXP,
  getProgressToNextRank,
  updateCategoryStats,
  getCategoryStats,
  getAllCategoryStats,
  getCategoryLeaderboard,
  getGlobalLeaderboard,
  updateGlobalStats,
  getPlayerGlobalRank,
  getPlayerCategoryRank,
  africanCountries,
}
