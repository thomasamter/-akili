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
const SocialPage = lazy(() => import('./pages/SocialPage'))

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

  // Calculate level from XP (100 XP per level)
  const level = Math.floor(xp / 100) + 1
  const { isAuthenticated, user, login, logout } = useAuthStore()
  const [difficulty, setDifficulty] = useState('medium')
  const [selectedCountry, setSelectedCountry] = useState(null)

  // Calculate level progress (100 XP per level)
  const xpInCurrentLevel = xp % 100
  const xpProgress = xpInCurrentLevel

  // Get today's daily challenge info
  const today = new Date()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dailyCategories = ['current_affairs', 'history', 'geography', 'culture', 'sports', 'music', 'politics']
  const dailyIcons = ['📰', '📜', '🗺️', '🎭', '⚽', '🎵', '🏛️']
  const todayCategory = dailyCategories[today.getDay()]
  const todayIcon = dailyIcons[today.getDay()]
  const todayCategoryName = todayCategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())


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
          <div className="flex items-center gap-3">
            {/* Level Progress Ring */}
            <div className="relative w-11 h-11">
              <svg className="w-11 h-11 -rotate-90">
                <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                <circle
                  cx="22" cy="22" r="18"
                  stroke="#FDB913"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${xpProgress * 1.13} 113`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-akili-gold">
                {level || 1}
              </span>
            </div>
            <div>
              <span className="text-lg font-bold text-akili-gold">AKILI</span>
              {isAuthenticated && (
                <p className="text-xs text-gray-400 truncate max-w-[100px]">
                  {user?.displayName?.split(' ')[0] || 'Player'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Streak */}
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-500/20 px-2.5 py-1.5 rounded-full">
                <span className="text-sm">🔥</span>
                <span className="text-orange-400 font-bold text-sm">{streak}</span>
              </div>
            )}
            <button onClick={() => navigate('/premium')} className="flex items-center gap-1 bg-akili-gold/20 px-2.5 py-1.5 rounded-full">
              <span className="text-sm">🪙</span>
              <span className="text-akili-gold font-bold text-sm">{coins}</span>
            </button>
            <div className="flex items-center gap-1 bg-red-500/20 px-2.5 py-1.5 rounded-full">
              <span className="text-sm">❤️</span>
              <span className="text-red-400 font-bold text-sm">{isPremium ? '∞' : lives}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* Hero Play Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-akili-gold/20 via-akili-black to-akili-gold/10 p-6 border border-akili-gold/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-akili-gold/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <h1 className="text-2xl font-bold text-white mb-1">
              {isAuthenticated ? `Hey, ${user?.displayName?.split(' ')[0] || 'Player'}!` : 'Test Your Knowledge'}
            </h1>
            <p className="text-gray-400 text-sm mb-4">Master African trivia</p>

            {/* Main Play Button */}
            <button
              onClick={() => navigate(`/categories?difficulty=${difficulty}${selectedCountry ? `&country=${selectedCountry}` : ''}`)}
              className="w-full bg-gradient-to-r from-akili-gold to-yellow-500 text-black text-lg font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-akili-gold/30 hover:shadow-akili-gold/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-xl">▶</span> PLAY NOW
            </button>
          </div>
        </div>

        {/* Daily Challenge Banner */}
        <button
          onClick={() => handlePlay(todayCategory)}
          className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 flex items-center gap-4 hover:border-purple-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
            {todayIcon}
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs text-purple-300 uppercase tracking-wider">Daily Challenge</p>
            <p className="text-white font-bold">{dayNames[today.getDay()]}: {todayCategoryName}</p>
          </div>
          <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
        </button>

        {/* Battle Mode */}
        <button
          onClick={() => navigate('/multiplayer')}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
        >
          ⚡ BATTLE A FRIEND
        </button>

        {/* Quick Settings Row */}
        <div className="flex gap-2">
          {/* Difficulty Pills */}
          <div className="flex-1 flex gap-1 p-1 bg-white/5 rounded-xl">
            {[
              { id: 'easy', label: '🍃', color: 'bg-green-500' },
              { id: 'medium', label: '⚡', color: 'bg-yellow-500' },
              { id: 'hard', label: '🔥', color: 'bg-red-500' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  difficulty === d.id
                    ? `${d.color} text-black shadow-md`
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Country Selector - Swipeable Carousel */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Choose Country</h3>
            {selectedCountry && (
              <button onClick={() => setSelectedCountry(null)} className="text-xs text-akili-gold">
                Clear ✕
              </button>
            )}
          </div>
          <div
            className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {[
              { id: 'Nigeria', flag: '🇳🇬', name: 'Nigeria', color: 'from-green-600 to-green-800' },
              { id: 'Kenya', flag: '🇰🇪', name: 'Kenya', color: 'from-red-600 to-red-800' },
              { id: 'South Africa', flag: '🇿🇦', name: 'S. Africa', color: 'from-emerald-500 to-yellow-500' },
              { id: 'Ghana', flag: '🇬🇭', name: 'Ghana', color: 'from-red-500 to-yellow-500' },
              { id: 'Ethiopia', flag: '🇪🇹', name: 'Ethiopia', color: 'from-green-600 to-yellow-500' },
              { id: 'Egypt', flag: '🇪🇬', name: 'Egypt', color: 'from-red-600 to-amber-600' },
              { id: 'Tanzania', flag: '🇹🇿', name: 'Tanzania', color: 'from-cyan-500 to-green-500' },
              { id: 'Senegal', flag: '🇸🇳', name: 'Senegal', color: 'from-green-500 to-yellow-500' },
              { id: 'DR Congo', flag: '🇨🇩', name: 'DRC', color: 'from-sky-500 to-yellow-500' },
              { id: 'Uganda', flag: '🇺🇬', name: 'Uganda', color: 'from-red-500 to-yellow-500' },
              { id: 'Zimbabwe', flag: '🇿🇼', name: 'Zimbabwe', color: 'from-green-500 to-yellow-400' },
              { id: 'Sudan', flag: '🇸🇩', name: 'Sudan', color: 'from-red-600 to-green-600' },
            ].map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
                className={`flex-shrink-0 snap-start py-2.5 px-3 rounded-xl text-center transition-all min-w-[68px] ${
                  selectedCountry === country.id
                    ? 'bg-akili-gold text-black scale-105 shadow-lg shadow-akili-gold/30 ring-2 ring-akili-gold'
                    : `bg-gradient-to-br ${country.color} text-white hover:scale-105 shadow-md`
                }`}
              >
                <span className="text-xl block">{country.flag}</span>
                <span className="text-[10px] font-medium">{country.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Categories</h3>
            <button onClick={() => navigate('/categories')} className="text-akili-gold text-xs">
              See All →
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'history', icon: '📜', name: 'History', color: 'from-amber-500 to-orange-600' },
              { id: 'entertainment', icon: '🎬', name: 'Movies', color: 'from-rose-500 to-red-600' },
              { id: 'music', icon: '🎵', name: 'Music', color: 'from-purple-500 to-pink-600' },
              { id: 'sports', icon: '⚽', name: 'Sports', color: 'from-blue-500 to-cyan-600' },
              { id: 'geography', icon: '🗺️', name: 'Places', color: 'from-green-500 to-emerald-600' },
              { id: 'culture', icon: '🎭', name: 'Culture', color: 'from-yellow-500 to-amber-600' },
              { id: 'science', icon: '🔬', name: 'Science', color: 'from-cyan-500 to-blue-600' },
              { id: 'politics', icon: '🏛️', name: 'Politics', color: 'from-slate-500 to-slate-700' },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => handlePlay(category.id)}
                className={`p-3 rounded-xl text-center bg-gradient-to-br ${category.color} hover:scale-105 active:scale-95 transition-transform shadow-lg`}
              >
                <span className="text-2xl block mb-0.5">{category.icon}</span>
                <span className="text-white text-[10px] font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 p-3 bg-white/5 rounded-xl">
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-white">{streak}</p>
            <p className="text-[10px] text-gray-500 uppercase">Streak</p>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-akili-gold">{highScore}</p>
            <p className="text-[10px] text-gray-500 uppercase">Best</p>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-white">{xp}</p>
            <p className="text-[10px] text-gray-500 uppercase">XP</p>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="grid grid-cols-5 gap-2">
          <button onClick={() => navigate('/social')} className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl text-center hover:from-purple-500/30 hover:to-pink-500/30 transition-colors">
            <span className="text-xl block mb-1">👥</span>
            <span className="text-[10px] text-purple-300">Friends</span>
          </button>
          <button onClick={() => navigate('/league')} className="p-3 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
            <span className="text-xl block mb-1">👑</span>
            <span className="text-[10px] text-gray-400">League</span>
          </button>
          <button onClick={() => navigate('/achievements')} className="p-3 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
            <span className="text-xl block mb-1">🏅</span>
            <span className="text-[10px] text-gray-400">Awards</span>
          </button>
          <button onClick={() => navigate('/premium')} className="p-3 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
            <span className="text-xl block mb-1">💎</span>
            <span className="text-[10px] text-gray-400">Premium</span>
          </button>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="p-3 bg-white/5 rounded-xl text-center hover:bg-red-500/20 transition-colors">
              <span className="text-xl block mb-1">🚪</span>
              <span className="text-[10px] text-gray-400">Logout</span>
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="p-3 bg-akili-gold/20 rounded-xl text-center hover:bg-akili-gold/30 transition-colors">
              <span className="text-xl block mb-1">👤</span>
              <span className="text-[10px] text-akili-gold">Sign In</span>
            </button>
          )}
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
          <Route path="/social" element={<SocialPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
