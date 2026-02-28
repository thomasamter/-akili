// AKILI Social Features
// Friends, challenges, activity feed, and chat

import {
  getDatabase,
  ref,
  push,
  set,
  get,
  onValue,
  update,
  remove,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
} from 'firebase/database'
import { db } from './firebase'

const rtdb = getDatabase()

// ============ FRIENDS SYSTEM ============

// Send friend request
export const sendFriendRequest = async (fromUserId, fromUserName, toUserId) => {
  try {
    const requestRef = ref(rtdb, `friendRequests/${toUserId}/${fromUserId}`)
    await set(requestRef, {
      fromUserId,
      fromUserName,
      timestamp: serverTimestamp(),
      status: 'pending'
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Accept friend request
export const acceptFriendRequest = async (userId, userName, friendId, friendName) => {
  try {
    // Add to both users' friend lists
    await update(ref(rtdb), {
      [`friends/${userId}/${friendId}`]: {
        name: friendName,
        addedAt: serverTimestamp(),
      },
      [`friends/${friendId}/${userId}`]: {
        name: userName,
        addedAt: serverTimestamp(),
      },
      // Remove the request
      [`friendRequests/${userId}/${friendId}`]: null,
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Decline friend request
export const declineFriendRequest = async (userId, friendId) => {
  try {
    await remove(ref(rtdb, `friendRequests/${userId}/${friendId}`))
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get friends list
export const getFriends = async (userId) => {
  try {
    const friendsRef = ref(rtdb, `friends/${userId}`)
    const snapshot = await get(friendsRef)
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data
      }))
    }
    return []
  } catch (error) {
    console.error('Error getting friends:', error)
    return []
  }
}

// Subscribe to friend requests
export const subscribeFriendRequests = (userId, callback) => {
  const requestsRef = ref(rtdb, `friendRequests/${userId}`)
  return onValue(requestsRef, (snapshot) => {
    if (snapshot.exists()) {
      const requests = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data
      }))
      callback(requests)
    } else {
      callback([])
    }
  })
}

// Remove friend
export const removeFriend = async (userId, friendId) => {
  try {
    await update(ref(rtdb), {
      [`friends/${userId}/${friendId}`]: null,
      [`friends/${friendId}/${userId}`]: null,
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Search users by username (for adding friends)
export const searchUsers = async (searchTerm) => {
  try {
    const usersRef = ref(rtdb, 'users')
    const snapshot = await get(usersRef)
    if (snapshot.exists()) {
      const users = []
      snapshot.forEach((child) => {
        const userData = child.val()
        if (userData.displayName?.toLowerCase().includes(searchTerm.toLowerCase())) {
          users.push({
            id: child.key,
            displayName: userData.displayName,
            level: userData.level || 1,
          })
        }
      })
      return users.slice(0, 10) // Limit results
    }
    return []
  } catch (error) {
    console.error('Error searching users:', error)
    return []
  }
}

// ============ CHALLENGE SYSTEM ============

// Send challenge to friend
export const sendChallenge = async (fromUserId, fromUserName, toUserId, category = 'random', difficulty = 'medium') => {
  try {
    const challengeRef = push(ref(rtdb, `challenges/${toUserId}`))
    await set(challengeRef, {
      id: challengeRef.key,
      fromUserId,
      fromUserName,
      category,
      difficulty,
      timestamp: serverTimestamp(),
      status: 'pending',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
    return { success: true, challengeId: challengeRef.key }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Subscribe to challenges
export const subscribeChallenges = (userId, callback) => {
  const challengesRef = ref(rtdb, `challenges/${userId}`)
  return onValue(challengesRef, (snapshot) => {
    if (snapshot.exists()) {
      const challenges = Object.entries(snapshot.val())
        .map(([id, data]) => ({ id, ...data }))
        .filter(c => c.status === 'pending' && c.expiresAt > Date.now())
      callback(challenges)
    } else {
      callback([])
    }
  })
}

// Accept challenge
export const acceptChallenge = async (userId, challengeId) => {
  try {
    await update(ref(rtdb, `challenges/${userId}/${challengeId}`), {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Decline challenge
export const declineChallenge = async (userId, challengeId) => {
  try {
    await remove(ref(rtdb, `challenges/${userId}/${challengeId}`))
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ============ ACTIVITY FEED ============

// Post activity (game completed, achievement unlocked, etc.)
export const postActivity = async (userId, userName, activityType, data) => {
  try {
    const activityRef = push(ref(rtdb, `activities/${userId}`))
    await set(activityRef, {
      id: activityRef.key,
      userId,
      userName,
      type: activityType, // 'game_completed', 'achievement_unlocked', 'level_up', 'challenge_won'
      data,
      timestamp: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get activity feed (from friends)
export const getActivityFeed = async (userId, friendIds, limit = 20) => {
  try {
    const activities = []

    for (const friendId of friendIds.slice(0, 10)) {
      const activitiesRef = query(
        ref(rtdb, `activities/${friendId}`),
        orderByChild('timestamp'),
        limitToLast(5)
      )
      const snapshot = await get(activitiesRef)
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          activities.push({
            id: child.key,
            ...child.val()
          })
        })
      }
    }

    // Sort by timestamp and limit
    return activities
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting activity feed:', error)
    return []
  }
}

// ============ FOLLOWING CATEGORIES ============

// Follow a category
export const followCategory = async (userId, categoryId) => {
  try {
    await set(ref(rtdb, `followedCategories/${userId}/${categoryId}`), {
      followedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Unfollow a category
export const unfollowCategory = async (userId, categoryId) => {
  try {
    await remove(ref(rtdb, `followedCategories/${userId}/${categoryId}`))
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get followed categories
export const getFollowedCategories = async (userId) => {
  try {
    const snapshot = await get(ref(rtdb, `followedCategories/${userId}`))
    if (snapshot.exists()) {
      return Object.keys(snapshot.val())
    }
    return []
  } catch (error) {
    console.error('Error getting followed categories:', error)
    return []
  }
}

// ============ QUICK CHAT / REACTIONS ============

// Send reaction in multiplayer game
export const sendReaction = async (roomCode, playerId, reaction) => {
  try {
    await set(ref(rtdb, `rooms/${roomCode}/reactions/${playerId}`), {
      reaction,
      timestamp: serverTimestamp(),
    })
    // Auto-clear after 3 seconds
    setTimeout(() => {
      remove(ref(rtdb, `rooms/${roomCode}/reactions/${playerId}`))
    }, 3000)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Subscribe to reactions in room
export const subscribeReactions = (roomCode, callback) => {
  const reactionsRef = ref(rtdb, `rooms/${roomCode}/reactions`)
  return onValue(reactionsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val())
    } else {
      callback({})
    }
  })
}

// Quick reactions list
export const quickReactions = ['👏', '🔥', '😂', '😮', '💪🏾', '🎉', '😤', '🤔']

// Quick chat messages (pre-set for fast gameplay)
export const quickChatMessages = [
  { id: 'gg', text: 'Good game!', icon: '🤝' },
  { id: 'gl', text: 'Good luck!', icon: '🍀' },
  { id: 'nice', text: 'Nice one!', icon: '👍🏾' },
  { id: 'wow', text: 'Wow!', icon: '😮' },
  { id: 'close', text: 'So close!', icon: '😅' },
  { id: 'rematch', text: 'Rematch?', icon: '🔄' },
  { id: 'tough', text: 'Tough question!', icon: '🤯' },
  { id: 'easy', text: 'Too easy!', icon: '😎' },
]

// ============ IN-GAME CHAT ============

// Send chat message in room
export const sendChatMessage = async (roomCode, playerId, playerName, message, isQuickChat = false) => {
  try {
    const messageRef = push(ref(rtdb, `rooms/${roomCode}/chat`))
    await set(messageRef, {
      id: messageRef.key,
      playerId,
      playerName,
      message,
      isQuickChat,
      timestamp: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Subscribe to chat messages
export const subscribeChatMessages = (roomCode, callback) => {
  const chatRef = query(
    ref(rtdb, `rooms/${roomCode}/chat`),
    orderByChild('timestamp'),
    limitToLast(50)
  )

  return onValue(chatRef, (snapshot) => {
    if (snapshot.exists()) {
      const messages = []
      snapshot.forEach((child) => {
        messages.push({
          id: child.key,
          ...child.val()
        })
      })
      callback(messages)
    } else {
      callback([])
    }
  })
}

// ============ USER PROFILE ============

// Update user profile for searchability
export const updateUserProfile = async (userId, displayName, stats = {}) => {
  try {
    await update(ref(rtdb, `users/${userId}`), {
      displayName,
      level: Math.floor((stats.xp || 0) / 100) + 1,
      gamesPlayed: stats.gamesCompleted || 0,
      lastActive: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const snapshot = await get(ref(rtdb, `users/${userId}`))
    if (snapshot.exists()) {
      return { id: userId, ...snapshot.val() }
    }
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

export default {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  subscribeFriendRequests,
  removeFriend,
  searchUsers,
  sendChallenge,
  subscribeChallenges,
  acceptChallenge,
  declineChallenge,
  postActivity,
  getActivityFeed,
  followCategory,
  unfollowCategory,
  getFollowedCategories,
  sendReaction,
  subscribeReactions,
  quickReactions,
  updateUserProfile,
  getUserProfile,
}
