// AKILI Daily Content - Weekly Quizzes & Daily Challenges

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
    completedBy: 0,
    averageScore: 0,
  },
]

// Get current week's quiz
export const getCurrentWeekQuiz = () => {
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

export default {
  weeklyQuizzes,
  dailyChallengeSchedule,
  getCurrentWeekQuiz,
  getTodayChallenge,
}
