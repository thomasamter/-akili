// AKILI Trivia Questions Database
// Categories: History, Geography, Culture, Sports, Music, Politics, Science

export const categories = [
  { id: 'current_affairs', name: 'Current Affairs', icon: '📰', color: '#EF4444', daily: true },
  { id: 'history', name: 'History', icon: '📜', color: '#F59E0B' },
  { id: 'geography', name: 'Geography', icon: '🗺️', color: '#10B981' },
  { id: 'culture', name: 'Culture', icon: '🎭', color: '#FDB913' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#3B82F6' },
  { id: 'music', name: 'Music', icon: '🎵', color: '#8B5CF6' },
  { id: 'politics', name: 'Politics', icon: '🏛️', color: '#EC4899' },
  { id: 'science', name: 'Science', icon: '🔬', color: '#06B6D4' },
]

export const questions = [
  // Current Affairs (Updated regularly)
  {
    id: 101,
    category: 'current_affairs',
    difficulty: 'medium',
    question: "Which African country recently hosted the 2024 Africa Climate Summit?",
    options: ["South Africa", "Kenya", "Egypt", "Morocco"],
    correctAnswer: 1,
    explanation: "Kenya hosted the inaugural Africa Climate Summit in Nairobi in September 2023.",
    country: "Kenya",
    dateAdded: "2024-02-01",
  },
  {
    id: 102,
    category: 'current_affairs',
    difficulty: 'easy',
    question: "Which African Union goal aims to end all conflicts by 2030?",
    options: ["Agenda 2063", "Silencing the Guns", "AfCFTA", "Vision 2030"],
    correctAnswer: 1,
    explanation: "Silencing the Guns is an AU initiative to achieve a conflict-free Africa.",
    country: "African Union",
    dateAdded: "2024-02-01",
  },
  {
    id: 103,
    category: 'current_affairs',
    difficulty: 'medium',
    question: "What is the name of Africa's continental free trade agreement that launched in 2021?",
    options: ["ECOWAS", "AfCFTA", "SADC", "COMESA"],
    correctAnswer: 1,
    explanation: "The African Continental Free Trade Area (AfCFTA) creates a single market for goods and services.",
    country: "African Union",
    dateAdded: "2024-02-01",
  },
  {
    id: 104,
    category: 'current_affairs',
    difficulty: 'hard',
    question: "Which Nigerian city became Africa's most populous city, surpassing Cairo?",
    options: ["Abuja", "Kano", "Lagos", "Ibadan"],
    correctAnswer: 2,
    explanation: "Lagos has grown to over 21 million people, making it Africa's largest city.",
    country: "Nigeria",
    dateAdded: "2024-02-01",
  },
  {
    id: 105,
    category: 'current_affairs',
    difficulty: 'medium',
    question: "Which East African country recently joined the BRICS economic bloc?",
    options: ["Kenya", "Tanzania", "Ethiopia", "Uganda"],
    correctAnswer: 2,
    explanation: "Ethiopia was invited to join BRICS in 2023, alongside Egypt from Africa.",
    country: "Ethiopia",
    dateAdded: "2024-02-01",
  },

  // History
  {
    id: 1,
    category: 'history',
    difficulty: 'easy',
    question: "Which African country was never colonized by European powers?",
    options: ["Nigeria", "Ethiopia", "Kenya", "Ghana"],
    correctAnswer: 1,
    explanation: "Ethiopia successfully resisted Italian colonization at the Battle of Adwa in 1896.",
    country: "Ethiopia",
  },
  {
    id: 2,
    category: 'history',
    difficulty: 'medium',
    question: "Who was the first democratically elected president of South Africa?",
    options: ["Thabo Mbeki", "F.W. de Klerk", "Nelson Mandela", "Jacob Zuma"],
    correctAnswer: 2,
    explanation: "Nelson Mandela became president in 1994 after spending 27 years in prison.",
    country: "South Africa",
  },
  {
    id: 3,
    category: 'history',
    difficulty: 'hard',
    question: "In what year did Ghana gain independence, becoming the first sub-Saharan African country to do so?",
    options: ["1955", "1957", "1960", "1963"],
    correctAnswer: 1,
    explanation: "Ghana gained independence on March 6, 1957, led by Kwame Nkrumah.",
    country: "Ghana",
  },

  // Geography
  {
    id: 4,
    category: 'geography',
    difficulty: 'easy',
    question: "What is the largest country in Africa by land area?",
    options: ["Sudan", "Democratic Republic of Congo", "Algeria", "Nigeria"],
    correctAnswer: 2,
    explanation: "Algeria covers about 2.38 million square kilometers.",
    country: "Algeria",
  },
  {
    id: 5,
    category: 'geography',
    difficulty: 'medium',
    question: "Which African lake is the largest by surface area?",
    options: ["Lake Tanganyika", "Lake Malawi", "Lake Chad", "Lake Victoria"],
    correctAnswer: 3,
    explanation: "Lake Victoria, shared by Uganda, Kenya, and Tanzania, is Africa's largest lake.",
    country: "Various",
  },
  {
    id: 6,
    category: 'geography',
    difficulty: 'medium',
    question: "What is the capital city of Nigeria?",
    options: ["Lagos", "Abuja", "Kano", "Ibadan"],
    correctAnswer: 1,
    explanation: "Abuja became Nigeria's capital in 1991, replacing Lagos.",
    country: "Nigeria",
  },

  // Culture
  {
    id: 7,
    category: 'culture',
    difficulty: 'easy',
    question: "What is the traditional Maasai jumping dance called?",
    options: ["Adumu", "Gumboot", "Kizomba", "Azonto"],
    correctAnswer: 0,
    explanation: "Adumu is a traditional jumping dance performed by Maasai warriors.",
    country: "Kenya/Tanzania",
  },
  {
    id: 8,
    category: 'culture',
    difficulty: 'medium',
    question: "Which country is home to the ancient rock-hewn churches of Lalibela?",
    options: ["Egypt", "Morocco", "Ethiopia", "Sudan"],
    correctAnswer: 2,
    explanation: "Lalibela's 11 medieval churches were carved from solid rock in the 12th century.",
    country: "Ethiopia",
  },

  // Sports
  {
    id: 9,
    category: 'sports',
    difficulty: 'easy',
    question: "Which country won the 2022 Africa Cup of Nations?",
    options: ["Egypt", "Senegal", "Cameroon", "Nigeria"],
    correctAnswer: 1,
    explanation: "Senegal won their first AFCON title, defeating Egypt in the final.",
    country: "Senegal",
  },
  {
    id: 10,
    category: 'sports',
    difficulty: 'medium',
    question: "Who is known as the greatest African footballer of all time?",
    options: ["Didier Drogba", "Samuel Eto'o", "George Weah", "Jay-Jay Okocha"],
    correctAnswer: 2,
    explanation: "George Weah won the Ballon d'Or in 1995 and later became Liberia's president.",
    country: "Liberia",
  },

  // Music
  {
    id: 11,
    category: 'music',
    difficulty: 'easy',
    question: "Which Nigerian artist is known as the 'African Giant'?",
    options: ["Wizkid", "Davido", "Burna Boy", "Tiwa Savage"],
    correctAnswer: 2,
    explanation: "Burna Boy's 2019 album was titled 'African Giant' and won a Grammy.",
    country: "Nigeria",
  },
  {
    id: 12,
    category: 'music',
    difficulty: 'medium',
    question: "Fela Kuti is credited with creating which music genre?",
    options: ["Highlife", "Afrobeat", "Jùjú", "Fuji"],
    correctAnswer: 1,
    explanation: "Fela Kuti pioneered Afrobeat, combining jazz, funk, and traditional Yoruba music.",
    country: "Nigeria",
  },

  // Additional History Questions
  {
    id: 13,
    category: 'history',
    difficulty: 'medium',
    question: "Which ancient African empire was known for its vast gold wealth and the pilgrimage of Mansa Musa?",
    options: ["Songhai Empire", "Mali Empire", "Ghana Empire", "Benin Empire"],
    correctAnswer: 1,
    explanation: "The Mali Empire (1235-1600) was famed for its wealth, and Mansa Musa's 1324 pilgrimage to Mecca displayed its gold riches.",
    country: "Mali",
  },
  {
    id: 14,
    category: 'history',
    difficulty: 'hard',
    question: "Who was the legendary queen who led the Hausa people and is still celebrated in Nigeria today?",
    options: ["Queen Nzinga", "Queen Amina", "Yaa Asantewaa", "Makeda"],
    correctAnswer: 1,
    explanation: "Queen Amina of Zazzau (1533-1610) was a warrior queen who expanded Hausa territory.",
    country: "Nigeria",
  },
  {
    id: 15,
    category: 'history',
    difficulty: 'easy',
    question: "Which African nation was founded by freed American slaves in the 19th century?",
    options: ["Sierra Leone", "Liberia", "Ghana", "Gambia"],
    correctAnswer: 1,
    explanation: "Liberia was founded in 1847 by freed American slaves, with its capital Monrovia named after U.S. President James Monroe.",
    country: "Liberia",
  },

  // Additional Geography Questions
  {
    id: 16,
    category: 'geography',
    difficulty: 'easy',
    question: "What is Africa's highest mountain?",
    options: ["Mount Kenya", "Mount Kilimanjaro", "Mount Elgon", "Rwenzori Mountains"],
    correctAnswer: 1,
    explanation: "Mount Kilimanjaro in Tanzania stands at 5,895 meters (19,341 feet), making it Africa's highest peak.",
    country: "Tanzania",
  },
  {
    id: 17,
    category: 'geography',
    difficulty: 'medium',
    question: "The Sahara Desert spans how many African countries?",
    options: ["5", "8", "11", "15"],
    correctAnswer: 2,
    explanation: "The Sahara spans 11 countries: Algeria, Chad, Egypt, Libya, Mali, Mauritania, Morocco, Niger, Sudan, Tunisia, and Western Sahara.",
    country: "Various",
  },
  {
    id: 18,
    category: 'geography',
    difficulty: 'hard',
    question: "Which African country has the most pyramids?",
    options: ["Egypt", "Sudan", "Ethiopia", "Libya"],
    correctAnswer: 1,
    explanation: "Sudan has over 200 pyramids, more than Egypt! They were built by the Kingdom of Kush.",
    country: "Sudan",
  },

  // Additional Culture Questions
  {
    id: 19,
    category: 'culture',
    difficulty: 'medium',
    question: "What is the traditional cloth made by the Kente weavers of Ghana called?",
    options: ["Ankara", "Kente", "Kitenge", "Dashiki"],
    correctAnswer: 1,
    explanation: "Kente cloth originated with the Ashanti people of Ghana and is known for its bright, interwoven patterns.",
    country: "Ghana",
  },
  {
    id: 20,
    category: 'culture',
    difficulty: 'easy',
    question: "Which language is widely spoken across East Africa as a lingua franca?",
    options: ["Yoruba", "Zulu", "Swahili", "Amharic"],
    correctAnswer: 2,
    explanation: "Swahili (Kiswahili) is spoken by over 100 million people across East Africa.",
    country: "East Africa",
  },
  {
    id: 21,
    category: 'culture',
    difficulty: 'hard',
    question: "The 'Ubuntu' philosophy originates from which region of Africa?",
    options: ["West Africa", "North Africa", "Southern Africa", "East Africa"],
    correctAnswer: 2,
    explanation: "Ubuntu ('I am because we are') is a Nguni Bantu philosophy from Southern Africa emphasizing community.",
    country: "Southern Africa",
  },

  // Additional Sports Questions
  {
    id: 22,
    category: 'sports',
    difficulty: 'medium',
    question: "Which country has won the most Africa Cup of Nations titles?",
    options: ["Nigeria", "Cameroon", "Egypt", "Ghana"],
    correctAnswer: 2,
    explanation: "Egypt has won the AFCON 7 times (1957, 1959, 1986, 1998, 2006, 2008, 2010).",
    country: "Egypt",
  },
  {
    id: 23,
    category: 'sports',
    difficulty: 'easy',
    question: "Which Kenyan athlete is known as the greatest marathon runner of all time?",
    options: ["Haile Gebrselassie", "Eliud Kipchoge", "Mo Farah", "Kenenisa Bekele"],
    correctAnswer: 1,
    explanation: "Eliud Kipchoge holds the marathon world record and was the first to run a marathon under 2 hours (unofficial).",
    country: "Kenya",
  },
  {
    id: 24,
    category: 'sports',
    difficulty: 'hard',
    question: "South Africa hosted the FIFA World Cup in which year?",
    options: ["2006", "2010", "2014", "2018"],
    correctAnswer: 1,
    explanation: "South Africa became the first African nation to host the FIFA World Cup in 2010.",
    country: "South Africa",
  },

  // Additional Music Questions
  {
    id: 25,
    category: 'music',
    difficulty: 'medium',
    question: "Which South African artist's song 'Pata Pata' became an international hit in the 1960s?",
    options: ["Brenda Fassie", "Miriam Makeba", "Hugh Masekela", "Lucky Dube"],
    correctAnswer: 1,
    explanation: "Miriam Makeba, known as 'Mama Africa', released 'Pata Pata' in 1967.",
    country: "South Africa",
  },
  {
    id: 26,
    category: 'music',
    difficulty: 'easy',
    question: "Which music genre originated in the Democratic Republic of Congo?",
    options: ["Highlife", "Soukous", "Kwaito", "Bongo Flava"],
    correctAnswer: 1,
    explanation: "Soukous (also called Congolese rumba) originated in the DRC and became popular across Africa.",
    country: "DRC",
  },

  // Politics Questions
  {
    id: 27,
    category: 'politics',
    difficulty: 'easy',
    question: "Which organization represents all 55 African nations?",
    options: ["United Nations", "African Union", "ECOWAS", "Commonwealth"],
    correctAnswer: 1,
    explanation: "The African Union (AU) was established in 2002, replacing the Organisation of African Unity.",
    country: "Africa",
  },
  {
    id: 28,
    category: 'politics',
    difficulty: 'medium',
    question: "Who was the first female president in Africa?",
    options: ["Joyce Banda", "Ellen Johnson Sirleaf", "Sahle-Work Zewde", "Ngozi Okonjo-Iweala"],
    correctAnswer: 1,
    explanation: "Ellen Johnson Sirleaf became Liberia's president in 2006, the first elected female head of state in Africa.",
    country: "Liberia",
  },
  {
    id: 29,
    category: 'politics',
    difficulty: 'hard',
    question: "Which African country was the first to gain independence from colonial rule in 1847?",
    options: ["Ethiopia", "Liberia", "Egypt", "South Africa"],
    correctAnswer: 1,
    explanation: "Liberia declared independence in 1847, though Ethiopia was never colonized (except for brief Italian occupation).",
    country: "Liberia",
  },

  // Science Questions
  {
    id: 30,
    category: 'science',
    difficulty: 'medium',
    question: "Which African country launched its first satellite, NigeriaSat-1, in 2003?",
    options: ["South Africa", "Egypt", "Nigeria", "Kenya"],
    correctAnswer: 2,
    explanation: "Nigeria launched NigeriaSat-1 in 2003, becoming one of Africa's space pioneers.",
    country: "Nigeria",
  },
  {
    id: 31,
    category: 'science',
    difficulty: 'easy',
    question: "The Great Rift Valley, one of Earth's most significant geological features, runs through which part of Africa?",
    options: ["West Africa", "North Africa", "East Africa", "Southern Africa"],
    correctAnswer: 2,
    explanation: "The East African Rift runs from Ethiopia to Mozambique, spanning about 6,000 km.",
    country: "East Africa",
  },
  {
    id: 32,
    category: 'science',
    difficulty: 'hard',
    question: "Which country is home to the Square Kilometre Array (SKA), part of the world's largest radio telescope?",
    options: ["Kenya", "Nigeria", "South Africa", "Morocco"],
    correctAnswer: 2,
    explanation: "South Africa hosts the African portion of the SKA, the world's largest radio telescope project.",
    country: "South Africa",
  },
]

// Get questions by category
export const getQuestionsByCategory = (categoryId) => {
  return questions.filter(q => q.category === categoryId)
}

// Get questions by difficulty
export const getQuestionsByDifficulty = (difficulty) => {
  return questions.filter(q => q.difficulty === difficulty)
}

// Get random questions
export const getRandomQuestions = (count = 10) => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default questions
