// AKILI Daily Content - Headlines & Weekly Quizzes
// Updated regularly with African news and current affairs

// Daily Headline of the Day
// This can be updated daily or fetched from an API
export const dailyHeadline = {
  date: "2024-02-12",
  headline: "African Union Summit 2024 Focuses on Continental Integration",
  summary: "Leaders from 54 African nations gather in Addis Ababa to discuss economic cooperation, peace initiatives, and the implementation of AfCFTA.",
  source: "African Union",
  country: "🇪🇹 Ethiopia",
  category: "Politics",
  relatedQuestion: {
    question: "Where is the African Union headquarters located?",
    options: ["Cairo, Egypt", "Addis Ababa, Ethiopia", "Nairobi, Kenya", "Pretoria, South Africa"],
    correctAnswer: 1,
    explanation: "The African Union headquarters is in Addis Ababa, Ethiopia, established in 2002."
  }
}

// Get today's headline (can be extended to fetch from API)
export const getTodayHeadline = () => {
  // In production, this could fetch from NewsAPI or a custom backend
  return dailyHeadline
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
  dailyHeadline,
  weeklyQuizzes,
  dailyChallengeSchedule,
  getTodayHeadline,
  getCurrentWeekQuiz,
  getTodayChallenge,
}
