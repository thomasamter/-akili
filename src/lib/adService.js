// AKILI Ad Service
// Rewarded video ads for coins and lives
// Supports AdMob, Unity Ads, or mock ads for development

// Ad reward types
export const AD_REWARDS = {
  COINS_SMALL: { type: 'coins', amount: 25, label: '+25 Coins' },
  COINS_MEDIUM: { type: 'coins', amount: 50, label: '+50 Coins' },
  COINS_LARGE: { type: 'coins', amount: 100, label: '+100 Coins' },
  LIFE: { type: 'life', amount: 1, label: '+1 Life' },
  LIVES_FULL: { type: 'lives_full', amount: 5, label: 'Full Lives' },
  POWERUP_5050: { type: 'powerup', powerupId: 'fiftyFifty', amount: 1, label: '+1 50/50' },
  POWERUP_TIME: { type: 'powerup', powerupId: 'extraTime', amount: 1, label: '+1 Extra Time' },
  DOUBLE_REWARDS: { type: 'double', amount: 2, label: '2x Rewards' },
}

// Ad placement IDs (replace with your actual ad unit IDs)
const AD_UNITS = {
  REWARDED_COINS: import.meta.env.VITE_ADMOB_REWARDED_COINS || 'ca-app-pub-test/rewarded-coins',
  REWARDED_LIVES: import.meta.env.VITE_ADMOB_REWARDED_LIVES || 'ca-app-pub-test/rewarded-lives',
  REWARDED_POWERUP: import.meta.env.VITE_ADMOB_REWARDED_POWERUP || 'ca-app-pub-test/rewarded-powerup',
  INTERSTITIAL: import.meta.env.VITE_ADMOB_INTERSTITIAL || 'ca-app-pub-test/interstitial',
}

// Track ad watches for rate limiting
const adWatchHistory = {
  lastWatch: null,
  watchesToday: 0,
  lastReset: new Date().toDateString(),
}

// Max ads per day (to comply with policies and prevent abuse)
const MAX_ADS_PER_DAY = 20
const MIN_AD_INTERVAL = 30000 // 30 seconds between ads

// Check if user can watch an ad
export const canWatchAd = () => {
  // Reset daily counter
  const today = new Date().toDateString()
  if (adWatchHistory.lastReset !== today) {
    adWatchHistory.watchesToday = 0
    adWatchHistory.lastReset = today
  }

  // Check daily limit
  if (adWatchHistory.watchesToday >= MAX_ADS_PER_DAY) {
    return { allowed: false, reason: 'daily_limit', message: 'Daily ad limit reached. Come back tomorrow!' }
  }

  // Check cooldown
  if (adWatchHistory.lastWatch) {
    const timeSinceLastAd = Date.now() - adWatchHistory.lastWatch
    if (timeSinceLastAd < MIN_AD_INTERVAL) {
      const waitTime = Math.ceil((MIN_AD_INTERVAL - timeSinceLastAd) / 1000)
      return { allowed: false, reason: 'cooldown', message: `Please wait ${waitTime}s`, waitTime }
    }
  }

  return { allowed: true }
}

// Get remaining ads today
export const getRemainingAds = () => {
  const today = new Date().toDateString()
  if (adWatchHistory.lastReset !== today) {
    return MAX_ADS_PER_DAY
  }
  return Math.max(0, MAX_ADS_PER_DAY - adWatchHistory.watchesToday)
}

// Initialize ad SDK (call on app start)
export const initializeAds = async () => {
  // Check if running in development/mock mode
  if (import.meta.env.DEV || !window.admob) {
    console.log('AKILI Ads: Running in mock mode')
    return { initialized: true, mock: true }
  }

  try {
    // Initialize AdMob (if using admob-plus-cordova or similar)
    if (window.admob) {
      await window.admob.start()
      return { initialized: true, mock: false }
    }
  } catch (error) {
    console.error('Failed to initialize ads:', error)
    return { initialized: false, error: error.message }
  }

  return { initialized: true, mock: true }
}

// Load a rewarded ad
export const loadRewardedAd = async (adType = 'REWARDED_COINS') => {
  const adUnitId = AD_UNITS[adType] || AD_UNITS.REWARDED_COINS

  // Mock mode for development
  if (import.meta.env.DEV || !window.admob) {
    return { loaded: true, mock: true }
  }

  try {
    if (window.admob) {
      const ad = new window.admob.RewardedAd({
        adUnitId,
      })
      await ad.load()
      return { loaded: true, ad }
    }
  } catch (error) {
    console.error('Failed to load rewarded ad:', error)
    return { loaded: false, error: error.message }
  }

  return { loaded: true, mock: true }
}

// Show rewarded ad and return reward
export const showRewardedAd = async (rewardType = AD_REWARDS.COINS_SMALL) => {
  // Check if allowed
  const canWatch = canWatchAd()
  if (!canWatch.allowed) {
    return { success: false, ...canWatch }
  }

  // Mock mode - simulate ad watching
  if (import.meta.env.DEV || !window.admob) {
    return new Promise((resolve) => {
      // Simulate ad loading/watching time
      console.log('AKILI Ads: Showing mock rewarded ad...')

      setTimeout(() => {
        // Record the watch
        adWatchHistory.lastWatch = Date.now()
        adWatchHistory.watchesToday++

        resolve({
          success: true,
          reward: rewardType,
          mock: true,
        })
      }, 2000) // 2 second mock ad
    })
  }

  // Real ad implementation
  try {
    const adResult = await loadRewardedAd()
    if (!adResult.loaded) {
      return { success: false, reason: 'load_failed', message: 'Ad not available. Try again later.' }
    }

    if (adResult.ad) {
      const result = await adResult.ad.show()

      if (result && result.reward) {
        // Record the watch
        adWatchHistory.lastWatch = Date.now()
        adWatchHistory.watchesToday++

        return {
          success: true,
          reward: rewardType,
        }
      }
    }

    return { success: false, reason: 'not_completed', message: 'Watch the full ad to earn rewards!' }
  } catch (error) {
    console.error('Error showing rewarded ad:', error)
    return { success: false, reason: 'error', message: 'Something went wrong. Try again.' }
  }
}

// Show interstitial ad (between games, etc.)
export const showInterstitialAd = async () => {
  // Skip in development
  if (import.meta.env.DEV || !window.admob) {
    console.log('AKILI Ads: Skipping interstitial in dev mode')
    return { shown: false, mock: true }
  }

  try {
    if (window.admob) {
      const ad = new window.admob.InterstitialAd({
        adUnitId: AD_UNITS.INTERSTITIAL,
      })
      await ad.load()
      await ad.show()
      return { shown: true }
    }
  } catch (error) {
    console.error('Error showing interstitial:', error)
    return { shown: false, error: error.message }
  }

  return { shown: false }
}

export default {
  AD_REWARDS,
  canWatchAd,
  getRemainingAds,
  initializeAds,
  loadRewardedAd,
  showRewardedAd,
  showInterstitialAd,
}
