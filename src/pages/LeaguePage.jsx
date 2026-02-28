// AKILI League Page
// Weekly competitive leagues, per-topic leaderboards, and global rankings

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trophy, ChevronUp, ChevronDown, Clock, Gift, Globe, Flag } from 'lucide-react'
import { usePlayerStore, useAuthStore } from '../lib/store'
import { leagues, getLeagueFromXP, getNextLeague, generateMockLeaderboard, getPositionStatus } from '../data/leagues'
import { categories } from '../data/questions'
import {
  rankTiers,
  getRankFromXP,
  getProgressToNextRank,
  getCategoryLeaderboard,
  getGlobalLeaderboard,
  getAllCategoryStats,
  africanCountries,
} from '../lib/leaderboard'

const LeaguePage = () => {
  const navigate = useNavigate()
  const { stats, xp, weeklyXP } = usePlayerStore()
  const { user, isAuthenticated } = useAuthStore()

  // State
  const [activeTab, setActiveTab] = useState('weekly') // weekly, topics, global
  const [leaderboard, setLeaderboard] = useState([])
  const [timeLeft, setTimeLeft] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryLeaderboard, setCategoryLeaderboard] = useState([])
  const [categoryStats, setCategoryStats] = useState({})
  const [globalLeaderboard, setGlobalLeaderboard] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [loading, setLoading] = useState(false)

  // Get current league
  const currentLeague = getLeagueFromXP(xp || 0)
  const nextLeague = getNextLeague(currentLeague.id)

  // Generate mock leaderboard for weekly
  useEffect(() => {
    const userWeeklyXP = weeklyXP || stats?.weeklyXP || Math.floor(Math.random() * 500)
    setLeaderboard(generateMockLeaderboard(userWeeklyXP, user?.displayName || 'You'))
  }, [stats, weeklyXP, user])

  // Load category stats
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadCategoryStats()
    }
  }, [isAuthenticated, user?.id])

  const loadCategoryStats = async () => {
    if (!user?.id) return
    const stats = await getAllCategoryStats(user.id)
    setCategoryStats(stats)
  }

  // Load category leaderboard when selected
  useEffect(() => {
    if (selectedCategory) {
      loadCategoryLeaderboard(selectedCategory)
    }
  }, [selectedCategory])

  const loadCategoryLeaderboard = async (categoryId) => {
    setLoading(true)
    const leaderboard = await getCategoryLeaderboard(categoryId, 50)
    setCategoryLeaderboard(leaderboard)
    setLoading(false)
  }

  // Load global leaderboard
  useEffect(() => {
    if (activeTab === 'global') {
      loadGlobalLeaderboard()
    }
  }, [activeTab, selectedCountry])

  const loadGlobalLeaderboard = async () => {
    setLoading(true)
    const leaderboard = await getGlobalLeaderboard(50, selectedCountry)
    setGlobalLeaderboard(leaderboard)
    setLoading(false)
  }

  // Calculate time until weekly reset (Sunday midnight)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const nextSunday = new Date()
      nextSunday.setDate(now.getDate() + (7 - now.getDay()))
      nextSunday.setHours(0, 0, 0, 0)

      const diff = nextSunday - now
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      setTimeLeft(`${days}d ${hours}h ${minutes}m`)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(interval)
  }, [])

  // Find user position
  const userPosition = leaderboard.find(p => p.isCurrentUser)?.rank || 0
  const positionStatus = getPositionStatus(userPosition, currentLeague.id)

  return (
    <div className="min-h-screen bg-akili-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-akili-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white">Leaderboards</h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
            {[
              { id: 'weekly', label: 'Weekly', icon: '🏆' },
              { id: 'topics', label: 'Topics', icon: '📚' },
              { id: 'global', label: 'Global', icon: '🌍' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-akili-gold text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Weekly League Tab */}
        {activeTab === 'weekly' && (
          <>
            {/* Current League Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className={`glass-card p-6 bg-gradient-to-br ${currentLeague.color} bg-opacity-20`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{currentLeague.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold text-white">{currentLeague.name}</h2>
                      <p className="text-white/60 text-sm">Your current league</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${currentLeague.textColor}`}>
                      #{userPosition}
                    </p>
                    <p className="text-white/40 text-xs">Your rank</p>
                  </div>
                </div>

                {/* Position Status */}
                {positionStatus && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    positionStatus.willPromote ? 'bg-green-500/20' :
                    positionStatus.willRelegate ? 'bg-red-500/20' : 'bg-white/5'
                  }`}>
                    {positionStatus.willPromote ? (
                      <ChevronUp className="w-5 h-5 text-green-500" />
                    ) : positionStatus.willRelegate ? (
                      <ChevronDown className="w-5 h-5 text-red-500" />
                    ) : null}
                    <span className={`text-sm font-medium ${positionStatus.color}`}>
                      {positionStatus.label}
                    </span>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Time Remaining */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <div className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-white/60 text-sm">Week ends in</p>
                    <p className="text-white font-bold">{timeLeft}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-akili-gold">
                  <Gift className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    +{currentLeague.weeklyReward.coins} coins
                  </span>
                </div>
              </div>
            </motion.section>

            {/* Weekly Leaderboard */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm text-white/40 uppercase tracking-wide mb-3">This Week</h3>
              <LeaderboardList
                leaderboard={leaderboard}
                currentLeagueId={currentLeague.id}
                showXP
              />
            </motion.section>
          </>
        )}

        {/* Topics/Category Tab */}
        {activeTab === 'topics' && (
          <>
            {/* Category Ranks Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-sm text-white/40 uppercase tracking-wide mb-3">Your Topic Ranks</h3>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(category => {
                  const stats = categoryStats[category.id] || { xp: 0, rank: 'bronze' }
                  const rank = getRankFromXP(stats.xp)
                  const progress = getProgressToNextRank(stats.xp)

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        selectedCategory === category.id
                          ? 'bg-akili-gold/20 ring-2 ring-akili-gold'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl block mb-1">{category.icon}</span>
                      <span className="text-xs text-white block truncate">{category.name}</span>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="text-sm">{rank.icon}</span>
                        <span className="text-[10px] text-gray-400">{stats.xp} XP</span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${rank.color}`}
                          style={{ width: `${progress.progress}%` }}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.section>

            {/* Rank Tiers Legend */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <h3 className="text-sm text-white/40 uppercase tracking-wide mb-3">Rank Tiers</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {rankTiers.map(tier => (
                  <div
                    key={tier.id}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg bg-gradient-to-r ${tier.color} text-white text-center min-w-[70px]`}
                  >
                    <span className="text-lg block">{tier.icon}</span>
                    <span className="text-[10px] font-medium">{tier.name}</span>
                    <span className="text-[9px] block opacity-70">{tier.minXP}+ XP</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Category Leaderboard */}
            {selectedCategory && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-white/40 uppercase tracking-wide">
                    {categories.find(c => c.id === selectedCategory)?.name} Leaderboard
                  </h3>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs text-akili-gold"
                  >
                    Close ✕
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-akili-gold mx-auto"></div>
                  </div>
                ) : categoryLeaderboard.length > 0 ? (
                  <LeaderboardList
                    leaderboard={categoryLeaderboard.map((p, i) => ({
                      rank: i + 1,
                      username: p.userName,
                      weeklyXP: p.xp,
                      isCurrentUser: p.userId === user?.id,
                      rankTier: getRankFromXP(p.xp),
                    }))}
                    showRankBadge
                  />
                ) : (
                  <div className="text-center py-8 bg-white/5 rounded-xl">
                    <span className="text-3xl mb-2 block">🏆</span>
                    <p className="text-gray-400">No rankings yet</p>
                    <p className="text-gray-500 text-sm">Be the first to play!</p>
                  </div>
                )}
              </motion.section>
            )}
          </>
        )}

        {/* Global Tab */}
        {activeTab === 'global' && (
          <>
            {/* Country Filter */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-white/40" />
                <h3 className="text-sm text-white/40 uppercase tracking-wide">Filter by Country</h3>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCountry === null
                      ? 'bg-akili-gold text-black'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  🌍 All
                </button>
                {africanCountries.slice(0, 12).map(country => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedCountry === country
                        ? 'bg-akili-gold text-black'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Global Leaderboard */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-sm text-white/40 uppercase tracking-wide mb-3">
                {selectedCountry ? `${selectedCountry} Rankings` : 'Global Rankings'}
              </h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-akili-gold mx-auto"></div>
                </div>
              ) : globalLeaderboard.length > 0 ? (
                <LeaderboardList
                  leaderboard={globalLeaderboard.map((p, i) => ({
                    rank: i + 1,
                    username: p.userName,
                    weeklyXP: p.totalXP,
                    country: p.country,
                    isCurrentUser: p.userId === user?.id,
                    rankTier: getRankFromXP(p.totalXP),
                  }))}
                  showCountry
                  showRankBadge
                />
              ) : (
                <div className="text-center py-8 bg-white/5 rounded-xl">
                  <span className="text-3xl mb-2 block">🌍</span>
                  <p className="text-gray-400">No global rankings yet</p>
                  <p className="text-gray-500 text-sm">Play games to appear here!</p>
                </div>
              )}
            </motion.section>
          </>
        )}

        <div className="h-8" />
      </main>
    </div>
  )
}

// Reusable Leaderboard List Component
const LeaderboardList = ({ leaderboard, currentLeagueId, showXP = false, showCountry = false, showRankBadge = false }) => {
  return (
    <div className="glass-card overflow-hidden">
      {/* Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="p-4 bg-gradient-to-b from-akili-gold/10 to-transparent">
          <div className="flex justify-center items-end gap-4 mb-4">
            {/* 2nd Place */}
            <TopThreePlayer player={leaderboard[1]} position={2} showRankBadge={showRankBadge} />

            {/* 1st Place */}
            <TopThreePlayer player={leaderboard[0]} position={1} showRankBadge={showRankBadge} />

            {/* 3rd Place */}
            <TopThreePlayer player={leaderboard[2]} position={3} showRankBadge={showRankBadge} />
          </div>
        </div>
      )}

      {/* Rest of leaderboard */}
      <div className="divide-y divide-white/5">
        {leaderboard.slice(3).map((player) => {
          const status = currentLeagueId ? getPositionStatus(player.rank, currentLeagueId) : null
          return (
            <div
              key={player.rank}
              className={`flex items-center gap-3 px-4 py-3 ${
                player.isCurrentUser ? 'bg-akili-gold/10' : ''
              }`}
            >
              {/* Rank */}
              <span className={`w-8 text-center font-bold ${
                status?.willPromote ? 'text-green-500' :
                status?.willRelegate ? 'text-red-500' :
                'text-white/40'
              }`}>
                {player.rank}
              </span>

              {/* Rank Badge */}
              {showRankBadge && player.rankTier && (
                <span className="text-lg">{player.rankTier.icon}</span>
              )}

              {/* Avatar placeholder */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white/60 text-sm">
                  {player.username?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>

              {/* Name & Country */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${
                  player.isCurrentUser ? 'text-akili-gold' : 'text-white'
                }`}>
                  {player.username}
                  {player.isCurrentUser && ' (You)'}
                </p>
                {showCountry && player.country && (
                  <p className="text-xs text-gray-500">{player.country}</p>
                )}
              </div>

              {/* XP */}
              <span className="text-white/60 text-sm">
                {player.weeklyXP?.toLocaleString()} XP
              </span>

              {/* Status indicator */}
              {status?.willPromote && <ChevronUp className="w-4 h-4 text-green-500" />}
              {status?.willRelegate && <ChevronDown className="w-4 h-4 text-red-500" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Top 3 Player Component
const TopThreePlayer = ({ player, position, showRankBadge }) => {
  if (!player) return null

  const positionStyles = {
    1: { size: 'w-18 h-18', crown: true, border: 'border-akili-gold', bg: 'bg-akili-gold/20', text: 'text-akili-gold' },
    2: { size: 'w-14 h-14', crown: false, border: 'border-gray-400', bg: 'bg-gray-400/20', text: 'text-gray-400' },
    3: { size: 'w-14 h-14', crown: false, border: 'border-amber-700', bg: 'bg-amber-700/20', text: 'text-amber-600' },
  }

  const style = positionStyles[position]

  return (
    <div className={`text-center ${position === 1 ? '-mb-4' : ''}`}>
      <div className={`${style.size} rounded-full ${style.bg} border-2 ${style.border} flex items-center justify-center mb-2 relative mx-auto`}>
        <span className={`text-lg font-bold ${style.text}`}>{position}</span>
        {style.crown && <span className="absolute -top-2 text-lg">👑</span>}
      </div>
      {showRankBadge && player.rankTier && (
        <span className="text-sm">{player.rankTier.icon}</span>
      )}
      <p className={`text-xs font-medium truncate w-16 mx-auto ${
        player.isCurrentUser ? 'text-akili-gold' : 'text-white'
      }`}>
        {player.username}
      </p>
      <p className={`text-xs ${style.text}`}>{player.weeklyXP?.toLocaleString()} XP</p>
    </div>
  )
}

export default LeaguePage
