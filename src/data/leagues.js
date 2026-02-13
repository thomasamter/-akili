// AKILI Leagues & Divisions System
// Weekly competitive leagues based on skill level

export const leagues = [
  {
    id: 'bronze',
    name: 'Bronze League',
    icon: '🥉',
    color: 'from-amber-700 to-amber-900',
    textColor: 'text-amber-600',
    minXP: 0,
    maxXP: 999,
    promotionSlots: 10, // Top 10 get promoted
    relegationSlots: 0, // No relegation from bronze
    weeklyReward: { coins: 100, xp: 50 },
    topReward: { coins: 250, xp: 100 }, // Top 3 bonus
  },
  {
    id: 'silver',
    name: 'Silver League',
    icon: '🥈',
    color: 'from-gray-300 to-gray-500',
    textColor: 'text-gray-400',
    minXP: 1000,
    maxXP: 4999,
    promotionSlots: 10,
    relegationSlots: 5, // Bottom 5 get relegated
    weeklyReward: { coins: 200, xp: 100 },
    topReward: { coins: 500, xp: 200 },
  },
  {
    id: 'gold',
    name: 'Gold League',
    icon: '🥇',
    color: 'from-yellow-400 to-yellow-600',
    textColor: 'text-yellow-500',
    minXP: 5000,
    maxXP: 14999,
    promotionSlots: 10,
    relegationSlots: 5,
    weeklyReward: { coins: 400, xp: 200 },
    topReward: { coins: 1000, xp: 400 },
  },
  {
    id: 'diamond',
    name: 'Diamond League',
    icon: '💎',
    color: 'from-cyan-300 to-blue-500',
    textColor: 'text-cyan-400',
    minXP: 15000,
    maxXP: 29999,
    promotionSlots: 5,
    relegationSlots: 5,
    weeklyReward: { coins: 750, xp: 350 },
    topReward: { coins: 2000, xp: 750 },
  },
  {
    id: 'master',
    name: 'Master League',
    icon: '👑',
    color: 'from-purple-400 to-pink-500',
    textColor: 'text-purple-400',
    minXP: 30000,
    maxXP: Infinity,
    promotionSlots: 0, // Top league
    relegationSlots: 10,
    weeklyReward: { coins: 1500, xp: 500 },
    topReward: { coins: 5000, xp: 1500 },
  },
]

// Get league from total XP
export const getLeagueFromXP = (xp) => {
  for (let i = leagues.length - 1; i >= 0; i--) {
    if (xp >= leagues[i].minXP) {
      return leagues[i]
    }
  }
  return leagues[0]
}

// Get next league
export const getNextLeague = (currentLeagueId) => {
  const index = leagues.findIndex(l => l.id === currentLeagueId)
  if (index < leagues.length - 1) {
    return leagues[index + 1]
  }
  return null
}

// Weekly leaderboard positions
export const leaderboardPositions = {
  promotion: { min: 1, max: 10, label: 'Promotion Zone', color: 'text-green-500' },
  safe: { min: 11, max: 20, label: 'Safe Zone', color: 'text-white' },
  danger: { min: 21, max: 25, label: 'Danger Zone', color: 'text-orange-500' },
  relegation: { min: 26, max: 30, label: 'Relegation Zone', color: 'text-red-500' },
}

// Get position status
export const getPositionStatus = (position, leagueId) => {
  const league = leagues.find(l => l.id === leagueId)
  if (!league) return null

  if (position <= league.promotionSlots && getNextLeague(leagueId)) {
    return { ...leaderboardPositions.promotion, willPromote: true }
  }

  if (league.relegationSlots > 0 && position > 30 - league.relegationSlots) {
    return { ...leaderboardPositions.relegation, willRelegate: true }
  }

  if (position > 20) {
    return leaderboardPositions.danger
  }

  return leaderboardPositions.safe
}

// Mock leaderboard data (would come from backend)
export const generateMockLeaderboard = (userScore, username = 'You') => {
  const names = [
    'AfricanQuizMaster', 'TriviaNinja', 'BrainStorm', 'QuizWhiz', 'KnowledgeKing',
    'SmartCookie', 'TriviaPro', 'QuizChamp', 'BrainBox', 'WisdomSeeker',
    'AfroGenius', 'QuizLegend', 'MindMaster', 'TriviaStar', 'BrainWave',
    'QuizAce', 'KnowledgeQueen', 'SmartMind', 'TriviaGuru', 'BrainTrust',
    'QuizKid', 'WiseOwl', 'TriviaKing', 'BrainPower', 'QuizBot',
    'SmartAlec', 'TriviaBoss', 'BrainChild', 'QuizMaven', 'WisdomTree',
  ]

  const leaderboard = []

  // Generate 30 players
  for (let i = 0; i < 30; i++) {
    const baseScore = Math.max(0, 1000 - (i * 30) + Math.random() * 50)
    leaderboard.push({
      rank: i + 1,
      username: names[i] || `Player${i + 1}`,
      weeklyXP: Math.round(baseScore),
      isCurrentUser: false,
    })
  }

  // Insert user at appropriate position
  let userPosition = leaderboard.findIndex(p => userScore > p.weeklyXP)
  if (userPosition === -1) userPosition = 29

  leaderboard.splice(userPosition, 0, {
    rank: userPosition + 1,
    username,
    weeklyXP: userScore,
    isCurrentUser: true,
  })

  // Re-rank and trim to 30
  return leaderboard.slice(0, 30).map((p, i) => ({ ...p, rank: i + 1 }))
}

export default leagues
