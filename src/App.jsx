import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import GamePage from './pages/GamePage'

// Simple working HomePage
function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-akili-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-white mb-2">🧠 AKILI</h1>
        <p className="text-gray-400 mb-8">Pan-African Trivia Game</p>

        <button
          onClick={() => navigate('/play?category=random')}
          className="w-full btn-gold text-xl py-4 mb-4"
        >
          ▶ PLAY NOW
        </button>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => navigate('/play?category=history')}
            className="glass-card p-4 text-white hover:border-akili-gold/50"
          >
            📜 History
          </button>
          <button
            onClick={() => navigate('/play?category=geography')}
            className="glass-card p-4 text-white hover:border-akili-gold/50"
          >
            🗺️ Geography
          </button>
          <button
            onClick={() => navigate('/play?category=culture')}
            className="glass-card p-4 text-white hover:border-akili-gold/50"
          >
            🎭 Culture
          </button>
          <button
            onClick={() => navigate('/play?category=sports')}
            className="glass-card p-4 text-white hover:border-akili-gold/50"
          >
            ⚽ Sports
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
