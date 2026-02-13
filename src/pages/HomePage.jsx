import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain,
  User,
  Flame,
  Star,
  Trophy,
  Gamepad2,
  Users,
  Play,
  Swords,
  ChevronRight,
  Newspaper,
  Sparkles,
  Crown,
  ShoppingBag,
  Share2,
} from 'lucide-react'
import { getTodayChallenge, getTodayHeadline } from '../data/dailyContent'
import { useGameStore, usePlayerStore, useAuthStore } from '../lib/store'
import { getLevelFromXP, getXPProgress, tiers } from '../data/levels'
import { leagues, getLeagueFromXP } from '../data/leagues'
import LivesDisplay from '../components/LivesDisplay'
import LevelBadge from '../components/LevelBadge'
import CoinShop from '../components/CoinShop'
import OutOfLivesModal from '../components/OutOfLivesModal'
import { InviteFriendsModal } from '../components/ShareInvite'

const HomePage = () => {
  const navigate = useNavigate()
  const { streak, highScore } = useGameStore()
  const {
    coins,
    xp,
    lives,
    maxLives,
    lastLifeRegeneration,
    isPremium,
    loginStreak,
  } = usePlayerStore()
  const { isAuthenticated, user } = useAuthStore()

  const [todayChallenge, setTodayChallenge] = useState(null)
  const [headline, setHeadline] = useState(null)
  const [showCoinShop, setShowCoinShop] = useState(false)
  const [showOutOfLives, setShowOutOfLives] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const userName = user?.displayName || 'Player'
  const levelInfo = getLevelFromXP(xp)
  const xpProgress = getXPProgress(xp)
  const tierInfo = tiers[levelInfo.tier]
  const currentLeague = getLeagueFromXP(xp)

  useEffect(() => {
    setTodayChallenge(getTodayChallenge())
    setHeadline(getTodayHeadline())
  }, [])

  const handlePlayClick = (category) => {
    // Check lives before playing
    if (!isPremium && lives <= 0) {
      setShowOutOfLives(true)
      return
    }
    navigate(`/play?category=${category}`)
  }

  const quickActions = [
    { icon: Gamepad2, label: 'Quick Play', color: 'from-pan-red to-red-600', action: () => handlePlayClick('random') },
    { icon: Users, label: 'Invite Friends', color: 'from-gold-500 to-gold-600', action: () => setShowInviteModal(true) },
    { icon: Trophy, label: 'Achievements', color: 'from-pan-green to-green-600', action: () => navigate('/achievements') },
    { icon: Crown, label: 'League', color: 'from-purple-500 to-purple-600', action: () => navigate('/league') },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] pattern-bg">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 backdrop-blur-lg bg-akili-black/80 border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-akili-black" />
            </div>
            <span className="text-xl font-bold text-gold-gradient">AKILI</span>
          </motion.div>

          {/* Right side - Coins & Lives */}
          <div className="flex items-center gap-2">
            {/* Coins */}
            <motion.button
              onClick={() => setShowCoinShop(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 bg-akili-gold/20 px-3 py-1.5 rounded-full"
            >
              <span>🪙</span>
              <span className="text-akili-gold font-bold">{coins}</span>
              <span className="text-akili-gold/60 text-xs">+</span>
            </motion.button>

            {/* Lives */}
            <LivesDisplay
              lives={lives}
              maxLives={maxLives}
              lastRegeneration={lastLifeRegeneration}
              isPremium={isPremium}
              size="small"
              onClick={() => !isPremium && lives < maxLives && setShowOutOfLives(true)}
            />

            {/* Profile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isAuthenticated ? navigate('/profile') : navigate('/login')}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            >
              {isPremium && (
                <span className="absolute -top-1 -right-1 text-xs">👑</span>
              )}
              <User className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Welcome & Level Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome, {userName}! 👋
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                {loginStreak > 0 ? (
                  <span>Login streak: <span className="text-orange-500 font-semibold">{loginStreak} days</span></span>
                ) : (
                  <span>Start your streak today!</span>
                )}
              </p>
            </div>

            {/* Level Badge */}
            <div className={`px-3 py-1 rounded-full ${tierInfo.bgColor} ${tierInfo.borderColor} border`}>
              <span className={`font-bold ${tierInfo.textColor}`}>
                Lv.{levelInfo.level}
              </span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4 glass-card p-4">
            <LevelBadge xp={xp} showProgress={true} showTitle={true} size="normal" animate={false} />
          </div>
        </motion.section>

        {/* Premium Banner (for non-premium users) */}
        {!isPremium && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => navigate('/premium')}
              className="w-full glass-card p-4 bg-gradient-to-r from-akili-gold/10 to-yellow-500/10 border-akili-gold/30 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-akili-gold/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-akili-gold" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-akili-gold font-bold">Upgrade to Premium</p>
                <p className="text-white/60 text-sm">2x XP, unlimited lives, no ads</p>
              </div>
              <ChevronRight className="w-5 h-5 text-akili-gold" />
            </button>
          </motion.section>
        )}

        {/* Daily Headline Card */}
        {headline && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="glass-card p-4 border-l-4 border-pan-red">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-pan-red/20 flex items-center justify-center flex-shrink-0">
                  <Newspaper className="w-5 h-5 text-pan-red" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-pan-red font-medium uppercase tracking-wide mb-1">
                    Headline of the Day
                  </p>
                  <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1">
                    {headline.headline}
                  </h3>
                  <p className="text-xs text-gray-500">{headline.country}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
              </div>
            </div>
          </motion.section>
        )}

        {/* Today's Challenge Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="glass-card gold-glow p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 rounded-full px-3 py-1 mb-4">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span className="text-xs font-medium text-gold-400">Today's Challenge</span>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                {todayChallenge?.name || 'Loading...'}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                {lives > 0 || isPremium ? (
                  <span>Ready to play • <span className="text-gold-400">+25 XP</span></span>
                ) : (
                  <span className="text-red-400">Out of lives</span>
                )}
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlayClick(todayChallenge?.category || 'random')}
                  className="flex-1 btn-gold flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  PLAY SOLO
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlayClick(todayChallenge?.category || 'random')}
                  className="flex-1 bg-transparent border border-gold-500/50 text-gold-400 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-500/10 transition-colors"
                >
                  <Swords className="w-4 h-4" />
                  BATTLE
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* League Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={() => navigate('/league')}
            className={`w-full glass-card p-4 bg-gradient-to-r ${currentLeague.color} bg-opacity-10 flex items-center gap-4`}
          >
            <span className="text-3xl">{currentLeague.icon}</span>
            <div className="flex-1 text-left">
              <p className={`font-bold ${currentLeague.textColor}`}>{currentLeague.name}</p>
              <p className="text-white/60 text-sm">Compete in weekly leagues</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/40" />
          </button>
        </motion.section>

        {/* Stats Row */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass-card p-4 text-center"
          >
            <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <p className="text-lg font-bold text-white">{streak} days</p>
            <p className="text-xs text-gray-500">Streak</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass-card p-4 text-center"
          >
            <Star className="w-6 h-6 mx-auto mb-2 text-gold-400" />
            <p className="text-lg font-bold text-white">{highScore} pts</p>
            <p className="text-xs text-gray-500">Best Score</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass-card p-4 text-center"
          >
            <Trophy className="w-6 h-6 mx-auto mb-2 text-pan-green" />
            <p className="text-lg font-bold text-white">{xp}</p>
            <p className="text-xs text-gray-500">Total XP</p>
          </motion.div>
        </motion.section>

        {/* Quick Actions Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="glass-card p-4 flex flex-col items-center gap-3 group hover:border-gold-500/30 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Earn More Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Earn More
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setShowCoinShop(true)}
              className="w-full glass-card p-3 flex items-center gap-3 hover:border-green-500/30"
            >
              <span className="text-2xl">📺</span>
              <div className="flex-1 text-left">
                <p className="text-white font-medium text-sm">Watch Ads</p>
                <p className="text-white/40 text-xs">Earn free coins & lives</p>
              </div>
              <span className="text-green-400 text-xs font-medium">FREE</span>
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="w-full glass-card p-3 flex items-center gap-3 hover:border-akili-gold/30"
            >
              <span className="text-2xl">👥</span>
              <div className="flex-1 text-left">
                <p className="text-white font-medium text-sm">Invite Friends</p>
                <p className="text-white/40 text-xs">Get 100 coins per invite</p>
              </div>
              <Share2 className="w-4 h-4 text-akili-gold" />
            </button>
          </div>
        </motion.section>

        {/* Weekly Quiz Banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="glass-card p-4 pan-gradient relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/80 uppercase tracking-wide mb-1">
                  Weekly Challenge
                </p>
                <h3 className="text-lg font-bold text-white">
                  This Week in Africa
                </h3>
                <p className="text-sm text-white/70">5 questions • +100 XP</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlayClick('weekly')}
                className="bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition-colors"
              >
                Play
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Bottom Spacing */}
        <div className="h-8" />
      </main>

      {/* Modals */}
      <CoinShop isOpen={showCoinShop} onClose={() => setShowCoinShop(false)} />
      <OutOfLivesModal
        isOpen={showOutOfLives}
        onClose={() => setShowOutOfLives(false)}
        onLivesRestored={() => setShowOutOfLives(false)}
      />
      <InviteFriendsModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />
    </div>
  )
}

export default HomePage
