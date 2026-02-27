import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useGameStore, usePlayerStore, useAuthStore } from './lib/store'
import { onAuthChange, logOut } from './lib/firebase'

// Lazy load pages for better performance (code splitting)
const GamePage = lazy(() => import('./pages/GamePage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const PremiumPage = lazy(() => import('./pages/PremiumPage'))
const LeaguePage = lazy(() => import('./pages/LeaguePage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const MultiplayerPage = lazy(() => import('./pages/MultiplayerPage'))

// Loading spinner for lazy loaded components
const PageLoader = () => (
  <div className="min-h-screen bg-akili-black flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akili-gold mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
)

// Working HomePage with core features
function HomePage() {
  const navigate = useNavigate()
  const { streak, highScore } = useGameStore()
  const { coins, xp, lives, isPremium } = usePlayerStore()
  const { isAuthenticated, user, login, logout } = useAuthStore()
  const [difficulty, setDifficulty] = useState('medium')
  const [selectedCountry, setSelectedCountry] = useState(null)


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
    navigate(`/play?category=${category}&difficulty=${difficulty}${selectedCountry ? `&country=${selectedCountry}` : ''}`)
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

        {/* Difficulty Selector */}
        <div className="glass-card p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Select Difficulty</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setDifficulty('easy')}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                difficulty === 'easy'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              🍠 Easy
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                difficulty === 'medium'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              🌽 Medium
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                difficulty === 'hard'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              🌶️ Hard
            </button>
          </div>
        </div>

        {/* Country Selector - Swipeable Carousel */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Play by Country</p>
            {selectedCountry && (
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-xs text-akili-gold"
              >
                Clear ✕
              </button>
            )}
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {[
              { id: 'Nigeria', flag: '🇳🇬', name: 'Nigeria' },
              { id: 'Kenya', flag: '🇰🇪', name: 'Kenya' },
              { id: 'South Africa', flag: '🇿🇦', name: 'S. Africa' },
              { id: 'Ghana', flag: '🇬🇭', name: 'Ghana' },
              { id: 'Ethiopia', flag: '🇪🇹', name: 'Ethiopia' },
              { id: 'Egypt', flag: '🇪🇬', name: 'Egypt' },
              { id: 'Tanzania', flag: '🇹🇿', name: 'Tanzania' },
              { id: 'Senegal', flag: '🇸🇳', name: 'Senegal' },
              { id: 'DR Congo', flag: '🇨🇩', name: 'DRC' },
              { id: 'Uganda', flag: '🇺🇬', name: 'Uganda' },
              { id: 'Zimbabwe', flag: '🇿🇼', name: 'Zimbabwe' },
              { id: 'Sudan', flag: '🇸🇩', name: 'Sudan' },
            ].map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
                className={`flex-shrink-0 snap-start py-3 px-4 rounded-xl text-center transition-all min-w-[72px] ${
                  selectedCountry === country.id
                    ? 'bg-akili-gold text-black scale-105 shadow-lg shadow-akili-gold/30'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                <span className="text-2xl block mb-1">{country.flag}</span>
                <span className="text-xs font-medium">{country.name}</span>
              </button>
            ))}
          </div>
          {selectedCountry && (
            <p className="text-center text-akili-gold text-sm mt-2">
              Playing: {selectedCountry} only
            </p>
          )}
        </div>

        {/* Quick Categories - Swipeable Carousel */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Quick Play</h3>
            <button onClick={() => navigate('/categories')} className="text-akili-gold text-sm">
              See All →
            </button>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {[
              { id: 'history', icon: '📜', name: 'History', color: 'from-amber-500 to-orange-600' },
              { id: 'entertainment', icon: '🎬', name: 'Entertainment', color: 'from-orange-500 to-red-600' },
              { id: 'culture', icon: '🎭', name: 'Culture', color: 'from-yellow-500 to-amber-600' },
              { id: 'music', icon: '🎵', name: 'Music', color: 'from-purple-500 to-pink-600' },
              { id: 'sports', icon: '⚽', name: 'Sports', color: 'from-blue-500 to-cyan-600' },
              { id: 'geography', icon: '🗺️', name: 'Geography', color: 'from-green-500 to-emerald-600' },
              { id: 'science', icon: '🔬', name: 'Science', color: 'from-cyan-500 to-blue-600' },
              { id: 'politics', icon: '🏛️', name: 'Politics', color: 'from-pink-500 to-rose-600' },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => handlePlay(category.id)}
                className={`flex-shrink-0 snap-start p-4 rounded-xl text-center min-w-[90px] bg-gradient-to-br ${category.color} hover:scale-105 transition-transform shadow-lg`}
              >
                <span className="text-3xl block mb-1">{category.icon}</span>
                <span className="text-white text-xs font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Play Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/categories?difficulty=${difficulty}${selectedCountry ? `&country=${selectedCountry}` : ''}`)}
            className="w-full btn-gold text-xl py-4 flex items-center justify-center gap-2"
          >
            ▶ PLAY NOW {selectedCountry && `(${selectedCountry})`}
          </button>
          <button
            onClick={() => navigate('/multiplayer')}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            ⚡💪🏾 BATTLE A FRIEND
          </button>
        </div>

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
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/multiplayer" element={<MultiplayerPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
