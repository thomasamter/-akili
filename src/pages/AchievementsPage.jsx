// AKILI Achievements Page
// View all achievement badges and progress

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Star, Flame, Target, Music, Globe, BookOpen } from 'lucide-react'
import { usePlayerStore } from '../lib/store'
import { achievements, rarityColors, checkAchievement } from '../data/achievements'
import AchievementBadge from '../components/AchievementBadge'

const AchievementsPage = () => {
  const navigate = useNavigate()
  const { unlockedAchievements, stats, coins } = usePlayerStore()
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All', icon: Trophy },
    { id: 'beginner', name: 'Beginner', icon: Star },
    { id: 'dedication', name: 'Dedication', icon: Flame },
    { id: 'progress', name: 'Progress', icon: Target },
    { id: 'mastery', name: 'Mastery', icon: BookOpen },
    { id: 'skill', name: 'Skill', icon: Globe },
    { id: 'special', name: 'Special', icon: Music },
  ]

  // Get filtered achievements
  const filteredAchievements = Object.values(achievements).filter(
    a => selectedCategory === 'all' || a.category === selectedCategory
  )

  // Calculate progress for each achievement
  const getProgress = (achievement) => {
    const { requirement } = achievement

    switch (requirement.type) {
      case 'gamesCompleted':
        return Math.min((stats.gamesCompleted / requirement.value) * 100, 100)
      case 'perfectGames':
        return Math.min((stats.perfectGames / requirement.value) * 100, 100)
      case 'streak':
        return Math.min((stats.maxStreak / requirement.value) * 100, 100)
      case 'totalScore':
        return Math.min((stats.totalScore / requirement.value) * 100, 100)
      case 'categoryCorrect':
        const catCount = stats.categoryCorrect?.[requirement.category] || 0
        return Math.min((catCount / requirement.value) * 100, 100)
      default:
        return 0
    }
  }

  // Count stats
  const totalAchievements = Object.keys(achievements).length
  const unlockedCount = unlockedAchievements.length
  const progressPercent = Math.round((unlockedCount / totalAchievements) * 100)

  // Calculate total coins from achievements
  const totalCoinsFromAchievements = unlockedAchievements.reduce((sum, id) => {
    const achievement = achievements[id]
    return sum + (achievement?.reward?.coins || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-akili-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-akili-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <h1 className="text-xl font-bold text-white">Achievements</h1>

            <div className="flex items-center gap-1 text-akili-gold">
              <span>🪙</span>
              <span className="font-bold">{coins}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Progress Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-akili-gold" />
              <span className="text-3xl font-bold text-white">
                {unlockedCount}/{totalAchievements}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-akili-gold to-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>

            <p className="text-white/60 text-sm">
              {progressPercent}% Complete
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-akili-gold text-xl font-bold">{stats.gamesCompleted}</p>
                <p className="text-white/40 text-xs">Games Played</p>
              </div>
              <div>
                <p className="text-akili-gold text-xl font-bold">{stats.perfectGames}</p>
                <p className="text-white/40 text-xs">Perfect Games</p>
              </div>
              <div>
                <p className="text-akili-gold text-xl font-bold">{totalCoinsFromAchievements}</p>
                <p className="text-white/40 text-xs">Coins Earned</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Category Filter */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-akili-gold text-akili-black font-medium'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{cat.name}</span>
                </button>
              )
            })}
          </div>
        </motion.section>

        {/* Achievements Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement, index) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id)
              const progress = isUnlocked ? 100 : getProgress(achievement)

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className="glass-card p-4"
                >
                  <AchievementBadge
                    achievement={achievement}
                    unlocked={isUnlocked}
                    progress={progress}
                    showDetails={true}
                    size="normal"
                  />
                </motion.div>
              )
            })}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/40">No achievements in this category yet.</p>
            </div>
          )}
        </motion.section>

        {/* Rarity Legend */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 pt-6 border-t border-white/10"
        >
          <h3 className="text-sm text-white/40 mb-3 text-center">Rarity</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(rarityColors).map(([rarity, colors]) => (
              <div key={rarity} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors.bg} ${colors.border} border`} />
                <span className={`text-xs capitalize ${colors.text}`}>{rarity}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Bottom spacing */}
        <div className="h-8" />
      </main>
    </div>
  )
}

export default AchievementsPage
