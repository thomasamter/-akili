// AKILI Achievement Badges System
// Unlock achievements by completing various challenges

export const achievements = {
  // Getting Started
  firstWin: {
    id: 'firstWin',
    name: 'First Victory',
    description: 'Complete your first quiz',
    icon: '🎯',
    category: 'beginner',
    requirement: { type: 'gamesCompleted', value: 1 },
    reward: { coins: 50 },
    rarity: 'common',
  },
  perfectScore: {
    id: 'perfectScore',
    name: 'Perfect Mind',
    description: 'Get 100% on any quiz',
    icon: '💯',
    category: 'mastery',
    requirement: { type: 'perfectGames', value: 1 },
    reward: { coins: 200 },
    rarity: 'rare',
  },

  // Streak Achievements
  streak3: {
    id: 'streak3',
    name: 'On Fire',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'dedication',
    requirement: { type: 'streak', value: 3 },
    reward: { coins: 75 },
    rarity: 'common',
  },
  streak7: {
    id: 'streak7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    category: 'dedication',
    requirement: { type: 'streak', value: 7 },
    reward: { coins: 150 },
    rarity: 'uncommon',
  },
  streak30: {
    id: 'streak30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    category: 'dedication',
    requirement: { type: 'streak', value: 30 },
    reward: { coins: 500 },
    rarity: 'legendary',
  },

  // Score Achievements
  score500: {
    id: 'score500',
    name: 'Rising Star',
    description: 'Reach 500 total points',
    icon: '⭐',
    category: 'progress',
    requirement: { type: 'totalScore', value: 500 },
    reward: { coins: 100 },
    rarity: 'common',
  },
  score2000: {
    id: 'score2000',
    name: 'Knowledge Seeker',
    description: 'Reach 2,000 total points',
    icon: '🌟',
    category: 'progress',
    requirement: { type: 'totalScore', value: 2000 },
    reward: { coins: 250 },
    rarity: 'uncommon',
  },
  score10000: {
    id: 'score10000',
    name: 'African Scholar',
    description: 'Reach 10,000 total points',
    icon: '🏆',
    category: 'progress',
    requirement: { type: 'totalScore', value: 10000 },
    reward: { coins: 1000 },
    rarity: 'epic',
  },

  // Category Mastery
  historyMaster: {
    id: 'historyMaster',
    name: 'History Buff',
    description: 'Answer 50 history questions correctly',
    icon: '📜',
    category: 'mastery',
    requirement: { type: 'categoryCorrect', category: 'history', value: 50 },
    reward: { coins: 200 },
    rarity: 'rare',
  },
  geographyMaster: {
    id: 'geographyMaster',
    name: 'Explorer',
    description: 'Answer 50 geography questions correctly',
    icon: '🗺️',
    category: 'mastery',
    requirement: { type: 'categoryCorrect', category: 'geography', value: 50 },
    reward: { coins: 200 },
    rarity: 'rare',
  },
  cultureMaster: {
    id: 'cultureMaster',
    name: 'Culture Keeper',
    description: 'Answer 50 culture questions correctly',
    icon: '🎭',
    category: 'mastery',
    requirement: { type: 'categoryCorrect', category: 'culture', value: 50 },
    reward: { coins: 200 },
    rarity: 'rare',
  },
  sportsMaster: {
    id: 'sportsMaster',
    name: 'Sports Fan',
    description: 'Answer 50 sports questions correctly',
    icon: '⚽',
    category: 'mastery',
    requirement: { type: 'categoryCorrect', category: 'sports', value: 50 },
    reward: { coins: 200 },
    rarity: 'rare',
  },
  musicMaster: {
    id: 'musicMaster',
    name: 'Music Maven',
    description: 'Answer 50 music questions correctly',
    icon: '🎵',
    category: 'mastery',
    requirement: { type: 'categoryCorrect', category: 'music', value: 50 },
    reward: { coins: 200 },
    rarity: 'rare',
  },

  // Speed Achievements
  speedDemon: {
    id: 'speedDemon',
    name: 'Speed Demon',
    description: 'Answer a question in under 3 seconds',
    icon: '💨',
    category: 'skill',
    requirement: { type: 'fastAnswer', value: 3000 },
    reward: { coins: 75 },
    rarity: 'uncommon',
  },
  lightningFast: {
    id: 'lightningFast',
    name: 'Lightning Fast',
    description: 'Complete a quiz with average time under 5 seconds',
    icon: '⚡',
    category: 'skill',
    requirement: { type: 'avgTimeUnder', value: 5000 },
    reward: { coins: 150 },
    rarity: 'rare',
  },

  // Special Achievements
  nightOwl: {
    id: 'nightOwl',
    name: 'Night Owl',
    description: 'Play a quiz after midnight',
    icon: '🦉',
    category: 'special',
    requirement: { type: 'playAfterMidnight', value: true },
    reward: { coins: 50 },
    rarity: 'common',
  },
  earlyBird: {
    id: 'earlyBird',
    name: 'Early Bird',
    description: 'Play a quiz before 6 AM',
    icon: '🐦',
    category: 'special',
    requirement: { type: 'playBefore6AM', value: true },
    reward: { coins: 50 },
    rarity: 'common',
  },
  comeback: {
    id: 'comeback',
    name: 'Comeback King',
    description: 'Win after getting first 3 questions wrong',
    icon: '🔄',
    category: 'special',
    requirement: { type: 'comebackWin', value: true },
    reward: { coins: 200 },
    rarity: 'rare',
  },

  // Collection Achievements
  tenGames: {
    id: 'tenGames',
    name: 'Getting Started',
    description: 'Complete 10 quizzes',
    icon: '📚',
    category: 'progress',
    requirement: { type: 'gamesCompleted', value: 10 },
    reward: { coins: 100 },
    rarity: 'common',
  },
  fiftyGames: {
    id: 'fiftyGames',
    name: 'Dedicated Learner',
    description: 'Complete 50 quizzes',
    icon: '🎓',
    category: 'progress',
    requirement: { type: 'gamesCompleted', value: 50 },
    reward: { coins: 300 },
    rarity: 'uncommon',
  },
  hundredGames: {
    id: 'hundredGames',
    name: 'Trivia Veteran',
    description: 'Complete 100 quizzes',
    icon: '🏅',
    category: 'progress',
    requirement: { type: 'gamesCompleted', value: 100 },
    reward: { coins: 500 },
    rarity: 'rare',
  },
}

// Rarity colors
export const rarityColors = {
  common: { bg: 'bg-gray-500/20', border: 'border-gray-500', text: 'text-gray-400' },
  uncommon: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400' },
  rare: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' },
  epic: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400' },
  legendary: { bg: 'bg-akili-gold/20', border: 'border-akili-gold', text: 'text-akili-gold' },
}

// Get achievements by category
export const getAchievementsByCategory = (category) => {
  return Object.values(achievements).filter(a => a.category === category)
}

// Check if achievement is unlocked based on stats
export const checkAchievement = (achievement, stats) => {
  const { requirement } = achievement

  switch (requirement.type) {
    case 'gamesCompleted':
      return stats.gamesCompleted >= requirement.value
    case 'perfectGames':
      return stats.perfectGames >= requirement.value
    case 'streak':
      return stats.maxStreak >= requirement.value
    case 'totalScore':
      return stats.totalScore >= requirement.value
    case 'categoryCorrect':
      return (stats.categoryCorrect?.[requirement.category] || 0) >= requirement.value
    case 'fastAnswer':
      return stats.fastestAnswer && stats.fastestAnswer <= requirement.value
    case 'avgTimeUnder':
      return stats.bestAvgTime && stats.bestAvgTime <= requirement.value
    case 'playAfterMidnight':
      return stats.playedAfterMidnight === true
    case 'playBefore6AM':
      return stats.playedBefore6AM === true
    case 'comebackWin':
      return stats.comebackWins >= 1
    default:
      return false
  }
}

// Get all newly unlocked achievements
export const getNewlyUnlocked = (stats, unlockedIds = []) => {
  return Object.values(achievements).filter(achievement => {
    if (unlockedIds.includes(achievement.id)) return false
    return checkAchievement(achievement, stats)
  })
}

export default achievements
