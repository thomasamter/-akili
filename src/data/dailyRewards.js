// AKILI Daily Login Rewards System
// Bonus rewards for consecutive logins

export const dailyRewards = [
  { day: 1, coins: 25, xp: 10, powerup: null, description: 'Day 1 Bonus' },
  { day: 2, coins: 50, xp: 15, powerup: null, description: 'Day 2 Bonus' },
  { day: 3, coins: 75, xp: 20, powerup: 'fiftyFifty', description: 'Day 3 + Power-up!' },
  { day: 4, coins: 100, xp: 25, powerup: null, description: 'Day 4 Bonus' },
  { day: 5, coins: 150, xp: 30, powerup: 'extraTime', description: 'Day 5 + Power-up!' },
  { day: 6, coins: 200, xp: 40, powerup: null, description: 'Day 6 Bonus' },
  { day: 7, coins: 500, xp: 100, powerup: 'doublePoints', description: 'Week Complete! 🎉' },
]

// Premium daily rewards (2x multiplier + exclusive items)
export const premiumDailyRewards = [
  { day: 1, coins: 50, xp: 20, powerup: null, description: 'Premium Day 1' },
  { day: 2, coins: 100, xp: 30, powerup: 'fiftyFifty', description: 'Premium Day 2' },
  { day: 3, coins: 150, xp: 40, powerup: 'extraTime', description: 'Premium Day 3' },
  { day: 4, coins: 200, xp: 50, powerup: 'skipQuestion', description: 'Premium Day 4' },
  { day: 5, coins: 300, xp: 60, powerup: 'doublePoints', description: 'Premium Day 5' },
  { day: 6, coins: 400, xp: 80, powerup: 'fiftyFifty', description: 'Premium Day 6' },
  { day: 7, coins: 1000, xp: 200, powerup: 'megaBoost', description: 'Premium Week! 👑' },
]

// Get reward for specific day (cycles after 7 days)
export const getDailyReward = (consecutiveDays, isPremium = false) => {
  const dayIndex = ((consecutiveDays - 1) % 7)
  const rewards = isPremium ? premiumDailyRewards : dailyRewards
  return rewards[dayIndex]
}

// Check if user can claim daily reward
export const canClaimDailyReward = (lastClaimDate) => {
  if (!lastClaimDate) return true

  const now = new Date()
  const lastClaim = new Date(lastClaimDate)

  // Reset at midnight
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastClaimDay = new Date(lastClaim.getFullYear(), lastClaim.getMonth(), lastClaim.getDate())

  return todayStart > lastClaimDay
}

// Check if streak is maintained (claimed yesterday)
export const isStreakMaintained = (lastClaimDate) => {
  if (!lastClaimDate) return false

  const now = new Date()
  const lastClaim = new Date(lastClaimDate)

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastClaimDay = new Date(lastClaim.getFullYear(), lastClaim.getMonth(), lastClaim.getDate())

  // Difference in days
  const diffTime = todayStart - lastClaimDay
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return diffDays === 1 // Exactly 1 day difference means streak maintained
}

export default dailyRewards
