// AKILI Power-ups System
// Boosters that help players during trivia games

export const powerups = {
  fiftyFifty: {
    id: 'fiftyFifty',
    name: '50/50',
    icon: '✂️',
    description: 'Eliminate 2 wrong answers',
    color: 'from-purple-500 to-purple-600',
    defaultCount: 3,
    cost: 50, // coins to purchase more
  },
  extraTime: {
    id: 'extraTime',
    name: '+10 Seconds',
    icon: '⏰',
    description: 'Add 10 seconds to the timer',
    color: 'from-blue-500 to-blue-600',
    defaultCount: 3,
    cost: 30,
  },
  skipQuestion: {
    id: 'skipQuestion',
    name: 'Skip',
    icon: '⏭️',
    description: 'Skip without penalty',
    color: 'from-orange-500 to-orange-600',
    defaultCount: 2,
    cost: 75,
  },
  doublePoints: {
    id: 'doublePoints',
    name: '2x Points',
    icon: '💎',
    description: 'Double points for this question',
    color: 'from-akili-gold to-yellow-600',
    defaultCount: 2,
    cost: 100,
  },
}

// Get initial power-up inventory for new players
export const getInitialPowerups = () => {
  return Object.keys(powerups).reduce((acc, key) => {
    acc[key] = powerups[key].defaultCount
    return acc
  }, {})
}

// Power-up effects
export const applyFiftyFifty = (question) => {
  const correctIndex = question.correctAnswer
  const wrongIndices = question.options
    .map((_, index) => index)
    .filter(index => index !== correctIndex)

  // Randomly select 2 wrong answers to eliminate
  const shuffled = wrongIndices.sort(() => Math.random() - 0.5)
  const toEliminate = shuffled.slice(0, 2)

  return toEliminate
}

export default powerups
