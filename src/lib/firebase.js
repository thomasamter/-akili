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
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'

// Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0

// Initialize Firebase only if configured
let app = null
let auth = null
let db = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
} else {
  console.warn('Firebase not configured - running in offline mode')
}

export { auth, db }

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

export default {
  auth,
  db,
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
}
