// AKILI Share & Invite Component
// Easy sharing of results and friend invitations

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Copy, Check, Users, Gift, X } from 'lucide-react'
import { usePlayerStore } from '../lib/store'

// Share game results
export const shareResults = async (results) => {
  const {
    score,
    correctAnswers,
    totalQuestions,
    category,
  } = results

  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  const shareText = `🧠 AKILI - African Trivia

🎯 Score: ${score} points
✅ ${correctAnswers}/${totalQuestions} correct (${percentage}%)
${category ? `📚 Category: ${category.name || category}` : ''}

How sharp is YOUR African knowledge? 🌍
Play now: https://akili.app`

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'AKILI Quiz Results',
        text: shareText,
      })
      return { success: true }
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText)
        return { success: true, copied: true }
      }
      return { success: false }
    }
  } else {
    // Fallback to clipboard
    await navigator.clipboard.writeText(shareText)
    return { success: true, copied: true }
  }
}

// Share app/invite friends
export const shareApp = async (referralCode = null) => {
  const shareText = referralCode
    ? `🧠 Join me on AKILI - the Pan-African trivia game!

Test your knowledge of African history, culture, geography & more.

Use my code "${referralCode}" for bonus rewards! 🎁

Download: https://akili.app/?ref=${referralCode}`
    : `🧠 Check out AKILI - the Pan-African trivia game!

Test your knowledge of African history, culture, geography & more. 🌍

Play now: https://akili.app`

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'AKILI - African Trivia Game',
        text: shareText,
      })
      return { success: true }
    } catch (error) {
      if (error.name !== 'AbortError') {
        await navigator.clipboard.writeText(shareText)
        return { success: true, copied: true }
      }
      return { success: false }
    }
  } else {
    await navigator.clipboard.writeText(shareText)
    return { success: true, copied: true }
  }
}

// Share Button Component
export const ShareButton = ({
  results = null,
  variant = 'default', // 'default', 'icon', 'full'
  className = '',
}) => {
  const [shared, setShared] = useState(false)

  const handleShare = async () => {
    const result = results
      ? await shareResults(results)
      : await shareApp()

    if (result.success) {
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  if (variant === 'icon') {
    return (
      <motion.button
        onClick={handleShare}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ${className}`}
      >
        {shared ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Share2 className="w-5 h-5 text-white" />
        )}
      </motion.button>
    )
  }

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors ${className}`}
    >
      {shared ? (
        <>
          <Check className="w-5 h-5 text-green-500" />
          <span className="text-green-500 font-medium">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5 text-white" />
          <span className="text-white font-medium">Share</span>
        </>
      )}
    </motion.button>
  )
}

// Invite Friends Modal
export const InviteFriendsModal = ({ isOpen, onClose }) => {
  const { referralCode, generateReferralCode, referralsCount } = usePlayerStore()
  const [copied, setCopied] = useState(false)

  // Generate code if not exists
  const code = referralCode || generateReferralCode()

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    await shareApp(code)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-akili-black border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-b from-akili-gold/20 to-transparent p-6 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-akili-gold/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-akili-gold" />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                Invite Friends
              </h2>
              <p className="text-white/60 text-sm">
                Share the love of African trivia!
              </p>
            </div>

            {/* Rewards Info */}
            <div className="px-6 py-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-white font-medium">Earn Rewards!</p>
                    <p className="text-white/60 text-sm">
                      Get 100 coins + 1 power-up for each friend who joins
                    </p>
                  </div>
                </div>
              </div>

              {/* Referral Stats */}
              <div className="text-center mb-4">
                <p className="text-white/40 text-sm">Friends invited</p>
                <p className="text-2xl font-bold text-akili-gold">{referralsCount}</p>
              </div>
            </div>

            {/* Referral Code */}
            <div className="px-6 pb-4">
              <p className="text-white/60 text-xs mb-2 text-center">Your referral code</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                  <span className="text-akili-gold font-bold text-lg tracking-wider">
                    {code}
                  </span>
                </div>
                <motion.button
                  onClick={copyCode}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                >
                  {copied ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : (
                    <Copy className="w-6 h-6 text-white" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="p-6 pt-0 space-y-3">
              <button
                onClick={handleShare}
                className="w-full py-4 bg-akili-gold text-akili-black font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Invite Link
              </button>

              {/* Social Share Options */}
              <div className="flex justify-center gap-4">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Join me on AKILI! Use code ${code}: https://akili.app/?ref=${code}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me on AKILI - the Pan-African trivia game! Use code ${code}: https://akili.app/?ref=${code}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-black flex items-center justify-center border border-white/20 hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://akili.app/?ref=${code}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default { ShareButton, InviteFriendsModal, shareResults, shareApp }
