// African Proverbs Collection for AKILI
// Displayed on app launch as daily wisdom

export const proverbs = [
  // Swahili - East Africa
  {
    id: 1,
    language: "Swahili",
    country: "🇰🇪 East Africa",
    original: "Haraka haraka haina baraka",
    translation: "Hurry hurry has no blessing",
    meaning: "Patience brings rewards; rushing leads to mistakes.",
  },
  {
    id: 2,
    language: "Swahili",
    country: "🇹🇿 East Africa",
    original: "Mwacha mila ni mtumwa",
    translation: "One who abandons culture is a slave",
    meaning: "Your heritage and traditions define your freedom.",
  },

  // Akan/Twi - Ghana
  {
    id: 3,
    language: "Akan (Twi)",
    country: "🇬🇭 Ghana",
    original: "Obi nkyerɛ abɔfra Nyame",
    translation: "No one teaches a child about God",
    meaning: "Spirituality is innate; some truths are universal.",
  },
  {
    id: 4,
    language: "Akan (Twi)",
    country: "🇬🇭 Ghana",
    original: "Sɛ wo werɛ fi na wosan hwɛ a, wonkɔ akyiri",
    translation: "If you forget and look back, you don't go backwards",
    meaning: "Reflecting on the past helps you move forward wisely.",
  },

  // Yoruba - Nigeria
  {
    id: 5,
    language: "Yoruba",
    country: "🇳🇬 Nigeria",
    original: "Àgbà kì í wà lọ́jà kí orí ọmọ tuntun wọ́",
    translation: "An elder cannot be in the market and let a child's head tilt",
    meaning: "Elders have a duty to guide and protect the young.",
  },
  {
    id: 6,
    language: "Yoruba",
    country: "🇳🇬 Nigeria",
    original: "Bí a bá ń lọ, a ń bọ̀",
    translation: "As we go, we return",
    meaning: "Life is cyclical; what goes around comes around.",
  },

  // Zulu - South Africa
  {
    id: 7,
    language: "Zulu",
    country: "🇿🇦 South Africa",
    original: "Umuntu ngumuntu ngabantu",
    translation: "A person is a person through other people",
    meaning: "Ubuntu: We are defined by our connections to others.",
  },
  {
    id: 8,
    language: "Zulu",
    country: "🇿🇦 South Africa",
    original: "Indlela ibuzwa kwabaphambili",
    translation: "The path is asked from those who have traveled it",
    meaning: "Seek wisdom from those with experience.",
  },

  // Amharic - Ethiopia
  {
    id: 9,
    language: "Amharic",
    country: "🇪🇹 Ethiopia",
    original: "ሰው በሰው ይጠገናል",
    translation: "A person is repaired by another person",
    meaning: "We heal and grow through community support.",
  },
  {
    id: 10,
    language: "Amharic",
    country: "🇪🇹 Ethiopia",
    original: "ቀስ በቀስ እንቁላል በእግሩ ይሄዳል",
    translation: "Slowly, slowly, the egg will walk on its legs",
    meaning: "With patience and time, even the impossible becomes possible.",
  },
]

// Get random proverb
export const getRandomProverb = () => {
  return proverbs[Math.floor(Math.random() * proverbs.length)]
}

// Get proverb by language
export const getProverbsByLanguage = (language) => {
  return proverbs.filter(p => p.language.toLowerCase().includes(language.toLowerCase()))
}

// Get proverb by ID
export const getProverbById = (id) => {
  return proverbs.find(p => p.id === id)
}

export default proverbs
