// AKILI Social Page
// Friends, challenges, activity feed, and following

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore, usePlayerStore } from '../lib/store'
import { categories } from '../data/questions'
import {
  getFriends,
  subscribeFriendRequests,
  subscribeChallenges,
  acceptFriendRequest,
  declineFriendRequest,
  acceptChallenge,
  declineChallenge,
  sendChallenge,
  searchUsers,
  sendFriendRequest,
  removeFriend,
  getActivityFeed,
  getFollowedCategories,
  followCategory,
  unfollowCategory,
  updateUserProfile,
} from '../lib/social'

const SocialPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { stats, xp } = usePlayerStore()

  // State
  const [activeTab, setActiveTab] = useState('friends') // friends, challenges, feed, following
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [challenges, setChallenges] = useState([])
  const [activityFeed, setActivityFeed] = useState([])
  const [followedCategories, setFollowedCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [challengeModal, setChallengeModal] = useState(null)
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Load data
  useEffect(() => {
    if (!user?.id) return

    const loadData = async () => {
      setLoading(true)

      // Update user profile
      await updateUserProfile(user.id, user.displayName, { xp, ...stats })

      // Get friends
      const friendsList = await getFriends(user.id)
      setFriends(friendsList)

      // Get followed categories
      const followed = await getFollowedCategories(user.id)
      setFollowedCategories(followed)

      // Get activity feed
      const friendIds = friendsList.map(f => f.id)
      const feed = await getActivityFeed(user.id, friendIds)
      setActivityFeed(feed)

      setLoading(false)
    }

    loadData()

    // Subscribe to friend requests
    const unsubRequests = subscribeFriendRequests(user.id, setFriendRequests)

    // Subscribe to challenges
    const unsubChallenges = subscribeChallenges(user.id, setChallenges)

    return () => {
      unsubRequests()
      unsubChallenges()
    }
  }, [user?.id])

  // Search users
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const search = async () => {
      setIsSearching(true)
      const results = await searchUsers(searchQuery)
      // Filter out self and existing friends
      const filtered = results.filter(
        u => u.id !== user?.id && !friends.some(f => f.id === u.id)
      )
      setSearchResults(filtered)
      setIsSearching(false)
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, friends, user?.id])

  // Handlers
  const handleAcceptRequest = async (request) => {
    await acceptFriendRequest(user.id, user.displayName, request.fromUserId, request.fromUserName)
    // Refresh friends
    const friendsList = await getFriends(user.id)
    setFriends(friendsList)
  }

  const handleDeclineRequest = async (request) => {
    await declineFriendRequest(user.id, request.fromUserId)
  }

  const handleSendRequest = async (toUser) => {
    await sendFriendRequest(user.id, user.displayName, toUser.id)
    setSearchQuery('')
    setSearchResults([])
    setShowAddFriend(false)
  }

  const handleRemoveFriend = async (friendId) => {
    if (confirm('Remove this friend?')) {
      await removeFriend(user.id, friendId)
      setFriends(friends.filter(f => f.id !== friendId))
    }
  }

  const handleChallengeFriend = (friend) => {
    setChallengeModal(friend)
  }

  const handleSendChallenge = async (friend, category, difficulty) => {
    await sendChallenge(user.id, user.displayName, friend.id, category, difficulty)
    setChallengeModal(null)
  }

  const handleAcceptChallenge = async (challenge) => {
    await acceptChallenge(user.id, challenge.id)
    // Navigate to multiplayer with challenge params
    navigate(`/multiplayer?challenge=${challenge.id}&from=${challenge.fromUserId}`)
  }

  const handleDeclineChallenge = async (challenge) => {
    await declineChallenge(user.id, challenge.id)
  }

  const handleToggleFollow = async (categoryId) => {
    if (followedCategories.includes(categoryId)) {
      await unfollowCategory(user.id, categoryId)
      setFollowedCategories(followedCategories.filter(c => c !== categoryId))
    } else {
      await followCategory(user.id, categoryId)
      setFollowedCategories([...followedCategories, categoryId])
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-akili-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akili-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-akili-black">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-akili-black/80 border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-white/60 hover:text-white">
            ← Back
          </button>
          <h1 className="text-lg font-bold text-white">Social</h1>
          <div className="w-10"></div>
        </div>

        {/* Tabs */}
        <div className="max-w-lg mx-auto px-4 pb-2">
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
            {[
              { id: 'friends', label: 'Friends', icon: '👥', count: friends.length },
              { id: 'challenges', label: 'Battles', icon: '⚔️', count: challenges.length },
              { id: 'feed', label: 'Feed', icon: '📰' },
              { id: 'following', label: 'Topics', icon: '⭐' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-akili-gold text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id ? 'bg-black/20' : 'bg-akili-gold/20 text-akili-gold'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <>
            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                <h3 className="text-sm font-medium text-purple-300 mb-3">
                  Friend Requests ({friendRequests.length})
                </h3>
                <div className="space-y-2">
                  {friendRequests.map(request => (
                    <div key={request.fromUserId} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center text-lg">
                        👤
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{request.fromUserName}</p>
                        <p className="text-gray-500 text-xs">wants to be friends</p>
                      </div>
                      <button
                        onClick={() => handleAcceptRequest(request)}
                        className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(request)}
                        className="px-3 py-1.5 bg-white/10 text-white text-xs font-medium rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Friend Button */}
            <button
              onClick={() => setShowAddFriend(!showAddFriend)}
              className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-gray-400 hover:border-akili-gold hover:text-akili-gold transition-colors flex items-center justify-center gap-2"
            >
              <span>➕</span> Add Friend
            </button>

            {/* Add Friend Search */}
            <AnimatePresence>
              {showAddFriend && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-white/5 rounded-xl space-y-3"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by username..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-akili-gold"
                  />
                  {isSearching && (
                    <p className="text-gray-500 text-sm text-center">Searching...</p>
                  )}
                  {searchResults.length > 0 && (
                    <div className="space-y-2">
                      {searchResults.map(result => (
                        <div key={result.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-akili-gold/20 flex items-center justify-center text-lg">
                            👤
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{result.displayName}</p>
                            <p className="text-gray-500 text-xs">Level {result.level || 1}</p>
                          </div>
                          <button
                            onClick={() => handleSendRequest(result)}
                            className="px-3 py-1.5 bg-akili-gold text-black text-xs font-medium rounded-lg"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                    <p className="text-gray-500 text-sm text-center">No users found</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Friends List */}
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">👥</span>
                <p className="text-gray-400">No friends yet</p>
                <p className="text-gray-500 text-sm">Add friends to challenge them!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map(friend => (
                  <div key={friend.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-akili-gold to-yellow-500 flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{friend.name}</p>
                      <p className="text-gray-500 text-xs">Tap to view profile</p>
                    </div>
                    <button
                      onClick={() => handleChallengeFriend(friend)}
                      className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg"
                    >
                      ⚔️ Battle
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="p-2 text-gray-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <>
            {challenges.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">⚔️</span>
                <p className="text-gray-400">No pending challenges</p>
                <p className="text-gray-500 text-sm">Challenge a friend from the Friends tab!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {challenges.map(challenge => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center text-2xl">
                        ⚔️
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold">{challenge.fromUserName}</p>
                        <p className="text-purple-300 text-sm">challenges you!</p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs mb-3">
                      <span className="px-2 py-1 bg-white/10 rounded-full text-gray-300">
                        {challenge.category === 'random' ? '🎲 Random' : categories.find(c => c.id === challenge.category)?.name || challenge.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${
                        challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        challenge.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptChallenge(challenge)}
                        className="flex-1 py-2.5 bg-akili-gold text-black font-bold rounded-lg"
                      >
                        Accept Battle
                      </button>
                      <button
                        onClick={() => handleDeclineChallenge(challenge)}
                        className="px-4 py-2.5 bg-white/10 text-white rounded-lg"
                      >
                        Decline
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Activity Feed Tab */}
        {activeTab === 'feed' && (
          <>
            {activityFeed.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">📰</span>
                <p className="text-gray-400">No recent activity</p>
                <p className="text-gray-500 text-sm">Add friends to see their achievements!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activityFeed.map(activity => (
                  <div key={activity.id} className="p-3 bg-white/5 rounded-xl flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-akili-gold/20 flex items-center justify-center text-lg">
                      {activity.type === 'game_completed' ? '🎮' :
                       activity.type === 'achievement_unlocked' ? '🏆' :
                       activity.type === 'level_up' ? '⬆️' : '🎉'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-medium">{activity.userName}</span>
                        {activity.type === 'game_completed' && ` scored ${activity.data?.score || 0} points`}
                        {activity.type === 'achievement_unlocked' && ` unlocked "${activity.data?.name}"`}
                        {activity.type === 'level_up' && ` reached level ${activity.data?.level}`}
                        {activity.type === 'challenge_won' && ` won a battle!`}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <>
            <p className="text-gray-400 text-sm mb-4">
              Follow your favorite topics to get personalized recommendations and see how you rank!
            </p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(category => {
                const isFollowed = followedCategories.includes(category.id)
                return (
                  <button
                    key={category.id}
                    onClick={() => handleToggleFollow(category.id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      isFollowed
                        ? 'bg-akili-gold/20 border-2 border-akili-gold'
                        : 'bg-white/5 border-2 border-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{category.icon}</span>
                      {isFollowed && <span className="text-akili-gold">⭐</span>}
                    </div>
                    <p className={`font-medium ${isFollowed ? 'text-akili-gold' : 'text-white'}`}>
                      {category.name}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {isFollowed ? 'Following' : 'Tap to follow'}
                    </p>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </main>

      {/* Challenge Modal */}
      <AnimatePresence>
        {challengeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setChallengeModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-akili-black border border-white/10 rounded-2xl p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4 text-center">
                ⚔️ Challenge {challengeModal.name}
              </h2>

              <ChallengeForm
                onSend={(category, difficulty) => handleSendChallenge(challengeModal, category, difficulty)}
                onCancel={() => setChallengeModal(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Challenge form component
const ChallengeForm = ({ onSend, onCancel }) => {
  const [category, setCategory] = useState('random')
  const [difficulty, setDifficulty] = useState('medium')

  return (
    <div className="space-y-4">
      {/* Category */}
      <div>
        <p className="text-gray-400 text-sm mb-2">Category</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-akili-gold"
        >
          <option value="random">🎲 Random</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
      </div>

      {/* Difficulty */}
      <div>
        <p className="text-gray-400 text-sm mb-2">Difficulty</p>
        <div className="grid grid-cols-3 gap-2">
          {['easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`py-2 rounded-lg font-medium text-sm ${
                difficulty === d
                  ? d === 'easy' ? 'bg-green-500 text-white' :
                    d === 'hard' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-black'
                  : 'bg-white/10 text-gray-400'
              }`}
            >
              {d === 'easy' ? '🍃' : d === 'hard' ? '🔥' : '⚡'} {d}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 bg-white/10 text-white font-medium rounded-xl"
        >
          Cancel
        </button>
        <button
          onClick={() => onSend(category, difficulty)}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl"
        >
          Send Challenge
        </button>
      </div>
    </div>
  )
}

export default SocialPage
