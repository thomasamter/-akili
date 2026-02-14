import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useGameStore, usePlayerStore } from './lib/store'
import { getTodayHeadline } from './data/dailyContent'
import GamePage from './pages/GamePage'
import AchievementsPage from './pages/AchievementsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PremiumPage from './pages/PremiumPage'
import LeaguePage from './pages/LeaguePage'

// Working HomePage with core features
function HomePage() {
  const navigate = useNavigate()
  const { streak, highScore } = useGameStore()
  const { coins, xp, lives, isPremium } = usePlayerStore()
  const [headline, setHeadline] = useState(null)

  useEffect(() => {
    setHeadline(getTodayHeadline())
  }, [])

  const handlePlay = (category) => {
    if (!isPremium && lives <= 0) {
      alert('Out of lives! Wait for regeneration or go Premium.')
      return
    }
    navigate(`/play?category=${category}`)
  }

  return (
    <div className="min-h-screen bg-akili-black">
      {/* Header */}
      <nav className="sticky top-0 z-40 backdrop-blur-lg bg-akili-black/80 border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="text-xl font-bold text-akili-gold">AKILI</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/premium')} className="flex items-center gap-1 bg-akili-gold/20 px-3 py-1.5 rounded-full">
              <span>🪙</span>
              <span className="text-akili-gold font-bold">{coins}</span>
            </button>
            <div className="flex items-center gap-1 bg-red-500/20 px-3 py-1.5 rounded-full">
              <span>❤️</span>
              <span className="text-red-400 font-bold">{isPremium ? '∞' : lives}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to AKILI! 👋</h1>
          <p className="text-gray-400">Test your African knowledge</p>
        </div>

        {/* Today's Headline */}
        {headline && (
          <div className="glass-card p-4 border-l-4 border-red-500">
            <p className="text-xs text-red-400 font-medium uppercase mb-1">📰 Today's News</p>
            <h3 className="text-white font-semibold mb-1">{headline.headline}</h3>
            <p className="text-gray-400 text-sm">{headline.summary}</p>
            <p className="text-gray-500 text-xs mt-2">{headline.country}</p>
          </div>
        )}

        {/* Play Button */}
        <button
          onClick={() => handlePlay('random')}
          className="w-full btn-gold text-xl py-4 flex items-center justify-center gap-2"
        >
          ▶ PLAY NOW
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl">🔥</p>
            <p className="text-lg font-bold text-white">{streak}</p>
            <p className="text-xs text-gray-500">Streak</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl">⭐</p>
            <p className="text-lg font-bold text-white">{highScore}</p>
            <p className="text-xs text-gray-500">Best Score</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl">🏆</p>
            <p className="text-lg font-bold text-white">{xp}</p>
            <p className="text-xs text-gray-500">Total XP</p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handlePlay('history')} className="glass-card p-4 text-white hover:border-akili-gold/50">
              📜 History
            </button>
            <button onClick={() => handlePlay('geography')} className="glass-card p-4 text-white hover:border-akili-gold/50">
              🗺️ Geography
            </button>
            <button onClick={() => handlePlay('culture')} className="glass-card p-4 text-white hover:border-akili-gold/50">
              🎭 Culture
            </button>
            <button onClick={() => handlePlay('sports')} className="glass-card p-4 text-white hover:border-akili-gold/50">
              ⚽ Sports
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">More</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/achievements')} className="glass-card p-4 text-white hover:border-akili-gold/50">
              🏅 Achievements
            </button>
            <button onClick={() => navigate('/league')} className="glass-card p-4 text-white hover:border-akili-gold/50">
              👑 League
            </button>
            <button onClick={() => navigate('/premium')} className="glass-card p-4 text-white hover:border-akili-gold/50">
              💎 Premium
            </button>
            <button onClick={() => navigate('/login')} className="glass-card p-4 text-white hover:border-akili-gold/50">
              👤 Account
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
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
