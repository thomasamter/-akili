import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../data/questions'
import { usePlayerStore } from '../lib/store'

const CategoryPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const difficulty = searchParams.get('difficulty') || 'medium'
  const { lives, isPremium } = usePlayerStore()

  const handleSelectCategory = (categoryId) => {
    if (!isPremium && lives <= 0) {
      alert('Out of lives! Wait for regeneration or go Premium.')
      return
    }
    navigate(`/play?category=${categoryId}&difficulty=${difficulty}`)
  }

  return (
    <div className="min-h-screen bg-akili-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-akili-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-xl font-bold text-white">Choose Category</h1>
          <div className={`px-2 py-1 rounded text-xs font-bold ${
            difficulty === 'easy' ? 'bg-green-500 text-white' :
            difficulty === 'hard' ? 'bg-red-500 text-white' :
            'bg-yellow-500 text-black'
          }`}>
            {difficulty.toUpperCase()}
          </div>
        </div>
      </header>

      {/* Categories Grid */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Random / Mixed option */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => handleSelectCategory('random')}
          className="w-full mb-6 p-6 rounded-2xl bg-gradient-to-r from-akili-gold/20 to-akili-gold/10 border border-akili-gold/30 hover:border-akili-gold/60 transition-all"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">🎲</span>
            <div className="text-left">
              <h2 className="text-xl font-bold text-akili-gold">Random Mix</h2>
              <p className="text-white/60 text-sm">Questions from all categories</p>
            </div>
          </div>
        </motion.button>

        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Or choose a category
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelectCategory(category.id)}
              className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all text-left"
              style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
            >
              <span className="text-3xl block mb-2">{category.icon}</span>
              <h3 className="text-white font-semibold">{category.name}</h3>
            </motion.button>
          ))}
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-white/40 hover:text-white transition-colors"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  )
}

export default CategoryPage
