// AKILI Firebase Configuration
// Authentication and database setup

import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore'
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  onValue,
  off,
  remove,
  push,
  serverTimestamp as rtdbTimestamp,
} from 'firebase/database'

// Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://akili-253a4-default-rtdb.europe-west1.firebasedatabase.app',
}

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0

// Initialize Firebase only if configured
let app = null
let auth = null
let db = null
let rtdb = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  rtdb = getDatabase(app)
} else {
  console.warn('Firebase not configured - running in offline mode')
}

export { auth, db, rtdb }

// Auth providers (only if Firebase is configured)
const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null
const appleProvider = isFirebaseConfigured ? new OAuthProvider('apple.com') : null

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Email/Password Sign Up
export const signUpWithEmail = async (email, password, displayName) => {
  if (!isFirebaseConfigured) {
    return { user: null, error: 'Firebase not configured. Please add Firebase credentials.' }
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update display name
    await updateProfile(user, { displayName })

    // Create user document in Firestore
    await createUserDocument(user, { displayName })

    return { user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  if (!isFirebaseConfigured) {
    return { user: null, error: 'Firebase not configured' }
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

// Google Sign In
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    return { user: null, error: 'Firebase not configured' }
  }
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Create/update user document
    await createUserDocument(user)

    return { user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

// Apple Sign In
export const signInWithApple = async () => {
  if (!isFirebaseConfigured) {
    return { user: null, error: 'Firebase not configured' }
  }
  try {
    const result = await signInWithPopup(auth, appleProvider)
    const user = result.user

    // Create/update user document
    await createUserDocument(user)

    return { user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

// Sign Out
export const logOut = async () => {
  if (!isFirebaseConfigured) {
    return { error: null }
  }
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Password Reset
export const resetPassword = async (email) => {
  if (!isFirebaseConfigured) {
    return { error: 'Firebase not configured' }
  }
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Auth State Observer
export const onAuthChange = (callback) => {
  if (!isFirebaseConfigured) {
    // Call callback with null user immediately
    callback(null)
    return () => {} // Return empty unsubscribe function
  }
  return onAuthStateChanged(auth, callback)
}

// ============================================
// FIRESTORE USER FUNCTIONS
// ============================================

// Create user document
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user || !isFirebaseConfigured) return null

  const userRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    const { email, displayName, photoURL } = user
    const createdAt = serverTimestamp()

    const newUserData = {
      email,
      displayName: displayName || additionalData.displayName || 'Player',
      photoURL: photoURL || null,
      createdAt,
      // Game stats
      xp: 0,
      level: 1,
      coins: 100,
      // Premium
      isPremium: false,
      premiumExpiry: null,
      // Lives
      lives: 5,
      lastLifeRegeneration: serverTimestamp(),
      // Daily rewards
      loginStreak: 0,
      lastLoginReward: null,
      // League
      currentLeague: 'bronze',
      weeklyXP: 0,
      // Stats
      gamesPlayed: 0,
      gamesWon: 0,
      perfectGames: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      // Power-ups
      powerups: {
        fiftyFifty: 3,
        extraTime: 3,
        skipQuestion: 2,
        doublePoints: 2,
      },
      // Achievements
      achievements: [],
      ...additionalData,
    }

    try {
      await setDoc(userRef, newUserData)
      return { ...newUserData, id: user.uid }
    } catch (error) {
      console.error('Error creating user document:', error)
      return null
    }
  }

  return { ...userSnap.data(), id: user.uid }
}

// Get user data
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return { ...userSnap.data(), id: userId }
    }
    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

// Update user data
export const updateUserData = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// ============================================
// LEADERBOARD FUNCTIONS
// ============================================

// Get weekly leaderboard
export const getWeeklyLeaderboard = async (league, limitCount = 30) => {
  try {
    const leaderboardRef = collection(db, 'users')
    const q = query(
      leaderboardRef,
      orderBy('weeklyXP', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    const leaderboard = []

    snapshot.forEach((doc, index) => {
      leaderboard.push({
        rank: index + 1,
        id: doc.id,
        ...doc.data(),
      })
    })

    return leaderboard
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}

// Update weekly XP
export const addWeeklyXP = async (userId, xpAmount) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const currentWeeklyXP = userSnap.data().weeklyXP || 0
      const currentXP = userSnap.data().xp || 0

      await updateDoc(userRef, {
        weeklyXP: currentWeeklyXP + xpAmount,
        xp: currentXP + xpAmount,
      })
    }

    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// ============================================
// MULTIPLAYER FUNCTIONS (Using Firestore)
// ============================================

// Generate a 6-digit room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Create a new multiplayer game room with timeout
export const createGameRoom = async (hostId, hostName, questions, difficulty = 'medium') => {
  if (!db) {
    return { roomCode: null, error: 'Database not configured. Please check Firebase setup.' }
  }

  const roomCode = generateRoomCode()

  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Connection timeout - check your internet connection')), 8000)
  })

  try {
    const roomRef = doc(db, 'rooms', roomCode)
    const writePromise = setDoc(roomRef, {
      host: {
        id: hostId,
        name: hostName,
        score: 0,
        currentQuestion: 0,
        answers: [],
        ready: true,
        connected: true,
      },
      guest: null,
      questions: questions,
      difficulty: difficulty,
      status: 'waiting',
      currentQuestionIndex: 0,
      createdAt: serverTimestamp(),
      gameStartTime: null,
    })

    // Race between write and timeout
    await Promise.race([writePromise, timeoutPromise])

    return { roomCode, error: null }
  } catch (error) {
    console.error('Firebase write error:', error)
    // Provide more helpful error messages
    let errorMessage = error.message
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied - check Firestore rules'
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Connection timeout - please try again'
    }
    return { roomCode: null, error: errorMessage }
  }
}

// Join an existing game room
export const joinGameRoom = async (roomCode, guestId, guestName) => {
  if (!db) return { success: false, error: 'Database not configured' }

  try {
    const roomRef = doc(db, 'rooms', roomCode)
    const roomSnap = await getDoc(roomRef)

    if (!roomSnap.exists()) {
      return { success: false, error: 'Room not found' }
    }

    const roomData = roomSnap.data()
    if (roomData.guest) {
      return { success: false, error: 'Room is full' }
    }

    if (roomData.status !== 'waiting') {
      return { success: false, error: 'Game already started' }
    }

    await updateDoc(roomRef, {
      guest: {
        id: guestId,
        name: guestName,
        score: 0,
        currentQuestion: 0,
        answers: [],
        ready: true,
        connected: true,
      },
    })

    return { success: true, error: null, roomData }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Listen to room updates
export const subscribeToRoom = (roomCode, callback) => {
  if (!db) return () => {}

  const roomRef = doc(db, 'rooms', roomCode)

  const unsubscribe = onSnapshot(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data())
    } else {
      callback(null)
    }
  })

  return unsubscribe
}

// Update player score
export const updatePlayerScore = async (roomCode, playerId, isHost, score, currentQuestion, answer) => {
  if (!db) return

  try {
    const roomRef = doc(db, 'rooms', roomCode)
    const roomSnap = await getDoc(roomRef)
    const roomData = roomSnap.data()

    const playerPath = isHost ? 'host' : 'guest'
    const currentAnswers = roomData[playerPath]?.answers || []

    await updateDoc(roomRef, {
      [`${playerPath}.score`]: score,
      [`${playerPath}.currentQuestion`]: currentQuestion,
      [`${playerPath}.answers`]: [...currentAnswers, answer],
    })
  } catch (error) {
    console.error('Error updating score:', error)
  }
}

// Start the game (host only)
export const startMultiplayerGame = async (roomCode) => {
  if (!db) return

  try {
    const roomRef = doc(db, 'rooms', roomCode)
    await updateDoc(roomRef, {
      status: 'countdown',
      gameStartTime: Date.now() + 3000,
    })

    setTimeout(async () => {
      await updateDoc(roomRef, { status: 'playing' })
    }, 3000)
  } catch (error) {
    console.error('Error starting game:', error)
  }
}

// End the game
export const endMultiplayerGame = async (roomCode) => {
  if (!db) return

  try {
    const roomRef = doc(db, 'rooms', roomCode)
    await updateDoc(roomRef, { status: 'finished' })
  } catch (error) {
    console.error('Error ending game:', error)
  }
}

// Leave/delete room
export const leaveRoom = async (roomCode, isHost) => {
  if (!db) return

  try {
    const roomRef = doc(db, 'rooms', roomCode)
    if (isHost) {
      await deleteDoc(roomRef)
    } else {
      await updateDoc(roomRef, { guest: null })
    }
  } catch (error) {
    console.error('Error leaving room:', error)
  }
}

// Update player connection status
export const updateConnectionStatus = async (roomCode, isHost, connected) => {
  if (!db) return

  try {
    const playerPath = isHost ? 'host' : 'guest'
    const roomRef = doc(db, 'rooms', roomCode)
    await updateDoc(roomRef, { [`${playerPath}.connected`]: connected })
  } catch (error) {
    console.error('Error updating connection:', error)
  }
}

export default {
  auth,
  db,
  rtdb,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  logOut,
  resetPassword,
  onAuthChange,
  getUserData,
  updateUserData,
  createUserDocument,
  getWeeklyLeaderboard,
  addWeeklyXP,
  // Multiplayer
  createGameRoom,
  joinGameRoom,
  subscribeToRoom,
  updatePlayerScore,
  startMultiplayerGame,
  endMultiplayerGame,
  leaveRoom,
  updateConnectionStatus,
}
