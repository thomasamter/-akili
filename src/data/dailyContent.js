// AKILI Daily Content - Headlines & Weekly Quizzes
// Updated regularly with African news and current affairs

// Rotating headlines - shows different ones based on day
const headlines = [
  {
    headline: "AfCFTA Trade Volume Hits Record $1.2 Trillion",
    summary: "The African Continental Free Trade Area reaches milestone as intra-African trade surges, creating millions of jobs across the continent.",
    country: "🌍 Africa",
    category: "Economy",
  },
  {
    headline: "Kenya Launches Africa's Largest Wind Farm",
    summary: "Lake Turkana Wind Power expansion makes Kenya a renewable energy leader, powering 2 million homes with clean energy.",
    country: "🇰🇪 Kenya",
    category: "Technology",
  },
  {
    headline: "Nigeria's Tech Unicorns Top $50 Billion Valuation",
    summary: "Lagos emerges as Africa's undisputed tech capital with record startup investments and innovation hubs.",
    country: "🇳🇬 Nigeria",
    category: "Technology",
  },
  {
    headline: "Rwanda Hosts Africa AI Summit 2026",
    summary: "African leaders and tech giants gather in Kigali to discuss AI ethics, digital transformation, and homegrown innovation.",
    country: "🇷🇼 Rwanda",
    category: "Technology",
  },
  {
    headline: "Ethiopia's Grand Renaissance Dam Reaches Full Capacity",
    summary: "The largest hydroelectric project in Africa is now fully operational, providing electricity to 60 million people.",
    country: "🇪🇹 Ethiopia",
    category: "Infrastructure",
  },
  {
    headline: "South Africa Wins Bid to Host 2034 FIFA World Cup",
    summary: "Historic decision makes South Africa the first African nation to host a second World Cup after 2010 success.",
    country: "🇿🇦 South Africa",
    category: "Sports",
  },
  {
    headline: "Ghana Becomes Africa's Newest Oil Powerhouse",
    summary: "New offshore discoveries double Ghana's oil reserves, positioning it among Africa's top energy producers.",
    country: "🇬🇭 Ghana",
    category: "Energy",
  },
]

// Get today's headline (rotates daily)
export const getTodayHeadline = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  return headlines[dayOfYear % headlines.length]
}

// Weekly Current Affairs Quiz
// Each week features 10 questions about recent African news
export const weeklyQuizzes = [
  {
    id: "week-2024-07",
    weekOf: "February 12-18, 2024",
    title: "This Week in Africa",
    description: "Test your knowledge of this week's African headlines",
    questions: [
      {
        id: 1,
        question: "Which African country recently announced plans to build a new capital city?",
        options: ["Nigeria", "Egypt", "Tanzania", "Indonesia"],
        correctAnswer: 1,
        explanation: "Egypt is building a new administrative capital east of Cairo to ease congestion.",
        difficulty: "medium",
      },
      {
        id: 2,
        question: "What major sporting event did Ivory Coast host in early 2024?",
        options: ["Africa Cup of Nations", "African Games", "World Athletics", "Rugby World Cup"],
        correctAnswer: 0,
        explanation: "Ivory Coast hosted AFCON 2024, with the host nation winning the tournament.",
        difficulty: "easy",
      },
      {
        id: 3,
        question: "Which African tech hub is known as 'Silicon Savannah'?",
        options: ["Lagos, Nigeria", "Cape Town, South Africa", "Nairobi, Kenya", "Accra, Ghana"],
        correctAnswer: 2,
        explanation: "Nairobi is nicknamed Silicon Savannah due to its thriving tech startup ecosystem.",
        difficulty: "medium",
      },
      {
        id: 4,
        question: "Which African currency recently introduced new polymer banknotes?",
        options: ["South African Rand", "Nigerian Naira", "Kenyan Shilling", "Ghanaian Cedi"],
        correctAnswer: 1,
        explanation: "Nigeria introduced redesigned naira notes to combat counterfeiting.",
        difficulty: "hard",
      },
      {
        id: 5,
        question: "What is the name of Rwanda's initiative to become Africa's leading tech hub?",
        options: ["Vision 2030", "Smart Rwanda", "Kigali Innovation City", "Digital Rwanda"],
        correctAnswer: 2,
        explanation: "Kigali Innovation City aims to create Africa's first technology and innovation hub.",
        difficulty: "hard",
      },
    ],
    completedBy: 0, // Track how many users completed
    averageScore: 0,
  },
]

// Get current week's quiz
export const getCurrentWeekQuiz = () => {
  // Return most recent quiz
  return weeklyQuizzes[weeklyQuizzes.length - 1]
}

// Daily Challenge Categories (rotates each day)
export const dailyChallengeSchedule = {
  0: { category: 'current_affairs', name: 'Sunday - Current Affairs', icon: '📰' },
  1: { category: 'history', name: 'Monday - History', icon: '📜' },
  2: { category: 'geography', name: 'Tuesday - Geography', icon: '🗺️' },
  3: { category: 'culture', name: 'Wednesday - Culture', icon: '🎭' },
  4: { category: 'sports', name: 'Thursday - Sports', icon: '⚽' },
  5: { category: 'music', name: 'Friday - Music', icon: '🎵' },
  6: { category: 'politics', name: 'Saturday - Politics', icon: '🏛️' },
}

// Get today's challenge category
export const getTodayChallenge = () => {
  const dayOfWeek = new Date().getDay()
  return dailyChallengeSchedule[dayOfWeek]
}

// News sources for potential API integration
export const africanNewsSources = [
  { id: 'bbc-africa', name: 'BBC Africa', domain: 'bbc.com/africa' },
  { id: 'aljazeera', name: 'Al Jazeera Africa', domain: 'aljazeera.com/africa' },
  { id: 'the-africa-report', name: 'The Africa Report', domain: 'theafricareport.com' },
  { id: 'daily-maverick', name: 'Daily Maverick', domain: 'dailymaverick.co.za' },
  { id: 'nation-africa', name: 'Nation Africa', domain: 'nation.africa' },
  { id: 'punch-ng', name: 'Punch Nigeria', domain: 'punchng.com' },
]

export default {
  headlines,
  weeklyQuizzes,
  dailyChallengeSchedule,
  getTodayHeadline,
  getCurrentWeekQuiz,
  getTodayChallenge,
}
