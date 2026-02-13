// AKILI Player Level System
// XP-based progression with tier badges

export const levels = [
  { level: 1, xpRequired: 0, title: 'Newcomer', tier: 'bronze' },
  { level: 2, xpRequired: 100, title: 'Learner', tier: 'bronze' },
  { level: 3, xpRequired: 250, title: 'Student', tier: 'bronze' },
  { level: 4, xpRequired: 500, title: 'Apprentice', tier: 'bronze' },
  { level: 5, xpRequired: 850, title: 'Enthusiast', tier: 'bronze' },
  { level: 6, xpRequired: 1300, title: 'Dedicated', tier: 'silver' },
  { level: 7, xpRequired: 1850, title: 'Committed', tier: 'silver' },
  { level: 8, xpRequired: 2500, title: 'Skilled', tier: 'silver' },
  { level: 9, xpRequired: 3300, title: 'Proficient', tier: 'silver' },
  { level: 10, xpRequired: 4200, title: 'Expert', tier: 'silver' },
  { level: 11, xpRequired: 5200, title: 'Specialist', tier: 'gold' },
  { level: 12, xpRequired: 6400, title: 'Authority', tier: 'gold' },
  { level: 13, xpRequired: 7800, title: 'Virtuoso', tier: 'gold' },
  { level: 14, xpRequired: 9400, title: 'Master', tier: 'gold' },
  { level: 15, xpRequired: 11200, title: 'Grandmaster', tier: 'gold' },
  { level: 16, xpRequired: 13200, title: 'Champion', tier: 'diamond' },
  { level: 17, xpRequired: 15500, title: 'Legend', tier: 'diamond' },
  { level: 18, xpRequired: 18000, title: 'Mythic', tier: 'diamond' },
  { level: 19, xpRequired: 21000, title: 'Immortal', tier: 'diamond' },
  { level: 20, xpRequired: 25000, title: 'Transcendent', tier: 'master' },
  { level: 21, xpRequired: 30000, title: 'Enlightened', tier: 'master' },
  { level: 22, xpRequired: 36000, title: 'Ascended', tier: 'master' },
  { level: 23, xpRequired: 43000, title: 'Divine', tier: 'master' },
  { level: 24, xpRequired: 51000, title: 'Eternal', tier: 'master' },
  { level: 25, xpRequired: 60000, title: 'AKILI Legend', tier: 'master' },
]

// Tier configurations
export const tiers = {
  bronze: {
    name: 'Bronze',
    color: 'from-amber-700 to-amber-900',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-600/20',
    borderColor: 'border-amber-600',
    icon: '🥉',
  },
  silver: {
    name: 'Silver',
    color: 'from-gray-300 to-gray-500',
    textColor: 'text-gray-300',
    bgColor: 'bg-gray-400/20',
    borderColor: 'border-gray-400',
    icon: '🥈',
  },
  gold: {
    name: 'Gold',
    color: 'from-yellow-400 to-yellow-600',
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500',
    icon: '🥇',
  },
  diamond: {
    name: 'Diamond',
    color: 'from-cyan-300 to-blue-500',
    textColor: 'text-cyan-300',
    bgColor: 'bg-cyan-400/20',
    borderColor: 'border-cyan-400',
    icon: '💎',
  },
  master: {
    name: 'Master',
    color: 'from-purple-400 to-pink-500',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500',
    icon: '👑',
  },
}

// Get level info from XP
export const getLevelFromXP = (xp) => {
  let currentLevel = levels[0]

  for (const level of levels) {
    if (xp >= level.xpRequired) {
      currentLevel = level
    } else {
      break
    }
  }

  return currentLevel
}

// Get next level info
export const getNextLevel = (currentLevel) => {
  const index = levels.findIndex(l => l.level === currentLevel)
  if (index < levels.length - 1) {
    return levels[index + 1]
  }
  return null // Max level reached
}

// Calculate XP progress to next level
export const getXPProgress = (xp) => {
  const currentLevel = getLevelFromXP(xp)
  const nextLevel = getNextLevel(currentLevel.level)

  if (!nextLevel) {
    return { current: xp, required: currentLevel.xpRequired, progress: 100 }
  }

  const xpInCurrentLevel = xp - currentLevel.xpRequired
  const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired
  const progress = Math.round((xpInCurrentLevel / xpNeededForNext) * 100)

  return {
    current: xpInCurrentLevel,
    required: xpNeededForNext,
    progress: Math.min(progress, 100),
  }
}

// XP rewards for different actions
export const xpRewards = {
  correctAnswer: 10,
  perfectGame: 50,
  dailyChallenge: 25,
  weeklyQuiz: 100,
  firstGameOfDay: 15,
  streakBonus: (streak) => Math.min(streak * 5, 50), // Up to 50 bonus XP
  difficultyBonus: {
    easy: 0,
    medium: 5,
    hard: 10,
  },
}

export default levels
