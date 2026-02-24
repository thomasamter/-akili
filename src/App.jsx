import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useGameStore, usePlayerStore, useAuthStore } from './lib/store'
import { getTodayHeadline } from './data/dailyContent'
import { onAuthChange, logOut } from './lib/firebase'
import GamePage from './pages/GamePage'
import CategoryPage from './pages/CategoryPage'
import AchievementsPage from './pages/AchievementsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PremiumPage from './pages/PremiumPage'
import LeaguePage from './pages/LeaguePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

// Working HomePage with core features
function HomePage() {
  const navigate = useNavigate()
  const { streak, highScore } = useGameStore()
  const { coins, xp, lives, isPremium } = usePlayerStore()
  const { isAuthenticated, user, login, logout } = useAuthStore()
  const [headline, setHeadline] = useState(null)
  const [newsLoading, setNewsLoading] = useState(true)

  // Fetch live African news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news')
        const data = await response.json()
        if (data.articles && data.articles.length > 0) {
          // Pick a random article from the top 5
          const topArticles = data.articles.slice(0, 5)
          const randomArticle = topArticles[Math.floor(Math.random() * topArticles.length)]
          setHeadline({
            headline: randomArticle.title,
            summary: randomArticle.description,
            source: randomArticle.source?.name || 'News',
            url: randomArticle.url,
            publishedAt: randomArticle.publishedAt
          })
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
        // Fallback to static headline
        setHeadline(getTodayHeadline())
      } finally {
        setNewsLoading(false)
      }
    }
    fetchNews()
  }, [])

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        // Use displayName, or extract name from email (part before @)
        const nameFromEmail = firebaseUser.email?.split('@')[0] || 'Player'
        const displayName = firebaseUser.displayName || nameFromEmail
        login({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName
        }, firebaseUser.accessToken)
      }
    })
    return () => unsubscribe()
  }, [login])


  const handleLogout = async () => {
    await logOut()
    logout()
  }

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
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1.5 rounded-full">
                <span>✓</span>
                <span className="text-green-400 font-bold text-sm truncate max-w-[80px]">
                  {user?.displayName?.split(' ')[0] || 'User'}
                </span>
              </div>
            )}
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
          <h1 className="text-3xl font-bold text-white mb-2">
            {isAuthenticated && user?.displayName
              ? `Welcome, ${user.displayName}!`
              : 'Welcome to AKILI!'}
          </h1>
          <p className="text-gray-400">Test your African knowledge</p>
        </div>

        {/* Today's Headline */}
        {newsLoading ? (
          <div className="glass-card p-4 border-l-4 border-red-500">
            <p className="text-xs text-red-400 font-medium uppercase mb-1">📰 Loading News...</p>
            <div className="h-4 bg-white/10 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-white/10 rounded animate-pulse w-3/4"></div>
          </div>
        ) : headline && (
          <div className="glass-card p-4 border-l-4 border-red-500">
            <p className="text-xs text-red-400 font-medium uppercase mb-1">📰 African News</p>
            <h3 className="text-white font-semibold mb-1">{headline.headline}</h3>
            <p className="text-gray-400 text-sm mb-2">{headline.summary}</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs">
                {headline.source || headline.country}
                {headline.publishedAt && ` • ${new Date(headline.publishedAt).toLocaleDateString()}`}
              </p>
              {headline.url && (
                <a
                  href={headline.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-akili-gold text-xs font-medium hover:underline"
                >
                  Read More →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Play Button */}
        <button
          onClick={() => navigate('/categories')}
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

        {/* Quick Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Quick Play</h3>
            <button onClick={() => navigate('/categories')} className="text-akili-gold text-sm">
              See All →
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => handlePlay('history')} className="glass-card p-3 text-center hover:border-akili-gold/50">
              <span className="text-2xl block">📜</span>
              <span className="text-white text-xs">History</span>
            </button>
            <button onClick={() => handlePlay('tribes')} className="glass-card p-3 text-center hover:border-akili-gold/50">
              <span className="text-2xl block">👥</span>
              <span className="text-white text-xs">People</span>
            </button>
            <button onClick={() => handlePlay('traditions')} className="glass-card p-3 text-center hover:border-akili-gold/50">
              <span className="text-2xl block">🪘</span>
              <span className="text-white text-xs">Traditions</span>
            </button>
            <button onClick={() => handlePlay('music')} className="glass-card p-3 text-center hover:border-akili-gold/50">
              <span className="text-2xl block">🎵</span>
              <span className="text-white text-xs">Music</span>
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
            {isAuthenticated ? (
              <button onClick={handleLogout} className="glass-card p-4 text-white hover:border-red-500/50">
                🚪 Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="p-4 text-akili-gold font-bold rounded-xl hover:bg-akili-gold/20 transition-colors"
                style={{
                  border: '2px solid #FDB913',
                  background: 'rgba(253, 185, 19, 0.1)'
                }}
              >
                👤 Sign In
              </button>
            )}
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
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/league" element={<LeaguePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
