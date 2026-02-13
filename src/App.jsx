import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProverbScreen from './components/ProverbScreen'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import AchievementsPage from './pages/AchievementsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PremiumPage from './pages/PremiumPage'
import LeaguePage from './pages/LeaguePage'
import DailyRewardModal from './components/DailyRewardModal'
import { usePlayerStore } from './lib/store'
import { canClaimDailyReward, getDailyReward } from './data/dailyRewards'

function App() {
  const [showProverb, setShowProverb] = useState(true)
  const [showDailyReward, setShowDailyReward] = useState(false)

  const {
    loginStreak,
    lastLoginReward,
    isPremium,
    claimDailyReward,
  } = usePlayerStore()

  // Check for daily reward on app load
  useEffect(() => {
    if (!showProverb && canClaimDailyReward(lastLoginReward)) {
      // Small delay after proverb screen
      const timer = setTimeout(() => {
        setShowDailyReward(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [showProverb, lastLoginReward])

  const handleClaimReward = () => {
    const nextDay = loginStreak + 1
    const reward = getDailyReward(nextDay, isPremium)
    claimDailyReward(reward)
    setShowDailyReward(false)
  }

  return (
    <BrowserRouter>
      {/* Proverb Splash Screen */}
      {showProverb && (
        <ProverbScreen onComplete={() => setShowProverb(false)} />
      )}

      {/* Daily Reward Modal */}
      <DailyRewardModal
        isOpen={showDailyReward}
        onClose={() => setShowDailyReward(false)}
        onClaim={handleClaimReward}
        consecutiveDays={loginStreak + 1}
        isPremium={isPremium}
        alreadyClaimed={!canClaimDailyReward(lastLoginReward)}
      />

      {/* Main App Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/league" element={<LeaguePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
