// AKILI League Page
// Weekly competitive leagues and leaderboard

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, ChevronUp, ChevronDown, Clock, Gift } from 'lucide-react'
import { usePlayerStore } from '../lib/store'
import { leagues, getLeagueFromXP, getNextLeague, generateMockLeaderboard, getPositionStatus } from '../data/leagues'

const LeaguePage = () => {
  const navigate = useNavigate()
  const { stats, xp } = usePlayerStore()
  const [leaderboard, setLeaderboard] = useState([])
  const [timeLeft, setTimeLeft] = useState('')

  // Get current league
  const currentLeague = getLeagueFromXP(xp || 0)
  const nextLeague = getNextLeague(currentLeague.id)

  // Generate mock leaderboard
  useEffect(() => {
    const weeklyXP = stats?.weeklyXP || Math.floor(Math.random() * 500)
    setLeaderboard(generateMockLeaderboard(weeklyXP, 'You'))
  }, [stats])

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
            <h1 className="text-xl font-bold text-white">Weekly League</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
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

        {/* League Tiers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <h3 className="text-sm text-white/40 uppercase tracking-wide mb-3">All Leagues</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {leagues.map((league) => {
              const isCurrentLeague = league.id === currentLeague.id
              return (
                <div
                  key={league.id}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all ${
                    isCurrentLeague
                      ? `${league.textColor} border-current bg-white/10`
                      : 'border-white/10 bg-white/5 opacity-50'
                  }`}
                >
                  <span className="text-2xl block text-center mb-1">{league.icon}</span>
                  <span className={`text-xs font-medium ${isCurrentLeague ? league.textColor : 'text-white/60'}`}>
                    {league.name.split(' ')[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* Leaderboard */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm text-white/40 uppercase tracking-wide mb-3">Leaderboard</h3>
          <div className="glass-card overflow-hidden">
            {/* Top 3 */}
            <div className="p-4 bg-gradient-to-b from-akili-gold/10 to-transparent">
              <div className="flex justify-center items-end gap-4 mb-4">
                {/* 2nd Place */}
                {leaderboard[1] && (
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-gray-400/20 border-2 border-gray-400 flex items-center justify-center mb-2">
                      <span className="text-lg font-bold text-gray-400">2</span>
                    </div>
                    <p className={`text-xs font-medium truncate w-16 ${
                      leaderboard[1].isCurrentUser ? 'text-akili-gold' : 'text-white'
                    }`}>
                      {leaderboard[1].username}
                    </p>
                    <p className="text-xs text-white/40">{leaderboard[1].weeklyXP} XP</p>
                  </div>
                )}

                {/* 1st Place */}
                {leaderboard[0] && (
                  <div className="text-center -mb-4">
                    <div className="w-18 h-18 rounded-full bg-akili-gold/20 border-2 border-akili-gold flex items-center justify-center mb-2 relative">
                      <span className="text-xl font-bold text-akili-gold">1</span>
                      <span className="absolute -top-2 text-lg">👑</span>
                    </div>
                    <p className={`text-sm font-bold truncate w-20 ${
                      leaderboard[0].isCurrentUser ? 'text-akili-gold' : 'text-white'
                    }`}>
                      {leaderboard[0].username}
                    </p>
                    <p className="text-xs text-akili-gold">{leaderboard[0].weeklyXP} XP</p>
                  </div>
                )}

                {/* 3rd Place */}
                {leaderboard[2] && (
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-amber-700/20 border-2 border-amber-700 flex items-center justify-center mb-2">
                      <span className="text-lg font-bold text-amber-600">3</span>
                    </div>
                    <p className={`text-xs font-medium truncate w-16 ${
                      leaderboard[2].isCurrentUser ? 'text-akili-gold' : 'text-white'
                    }`}>
                      {leaderboard[2].username}
                    </p>
                    <p className="text-xs text-white/40">{leaderboard[2].weeklyXP} XP</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rest of leaderboard */}
            <div className="divide-y divide-white/5">
              {leaderboard.slice(3).map((player) => {
                const status = getPositionStatus(player.rank, currentLeague.id)
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

                    {/* Avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-white/60 text-sm">
                        {player.username.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        player.isCurrentUser ? 'text-akili-gold' : 'text-white'
                      }`}>
                        {player.username}
                        {player.isCurrentUser && ' (You)'}
                      </p>
                    </div>

                    {/* XP */}
                    <span className="text-white/60 text-sm">
                      {player.weeklyXP} XP
                    </span>

                    {/* Status indicator */}
                    {status?.willPromote && <ChevronUp className="w-4 h-4 text-green-500" />}
                    {status?.willRelegate && <ChevronDown className="w-4 h-4 text-red-500" />}
                  </div>
                )
              })}
            </div>
          </div>
        </motion.section>

        {/* Weekly Rewards */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h3 className="text-sm text-white/40 uppercase tracking-wide mb-3">Weekly Rewards</h3>
          <div className="glass-card p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Participation Reward</span>
                <span className="text-akili-gold font-medium">
                  +{currentLeague.weeklyReward.coins} coins, +{currentLeague.weeklyReward.xp} XP
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Top 3 Bonus</span>
                <span className="text-akili-gold font-medium">
                  +{currentLeague.topReward.coins} coins, +{currentLeague.topReward.xp} XP
                </span>
              </div>
              {nextLeague && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Promotion Bonus</span>
                  <span className="text-green-400 font-medium">
                    Unlock {nextLeague.name}!
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        <div className="h-8" />
      </main>
    </div>
  )
}

export default LeaguePage
