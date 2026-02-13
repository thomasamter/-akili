// AKILI Cloud Functions
// Server-side validation and anti-cheat enforcement

const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()
const db = admin.firestore()

// ===========================================
// ANTI-CHEAT: Validate Game Session
// ===========================================

/**
 * Validates a completed game session
 * Called when a game ends to verify the score is legitimate
 */
exports.validateGameSession = functions.https.onCall(async (data, context) => {
  // Require authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in')
  }

  const { sessionId, answers, finalScore, category } = data
  const userId = context.auth.uid

  // Validate input
  if (!sessionId || !answers || !Array.isArray(answers)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid session data')
  }

  // Get session from database
  const sessionRef = db.collection('sessions').doc(sessionId)
  const session = await sessionRef.get()

  if (!session.exists) {
    throw new functions.https.HttpsError('not-found', 'Session not found')
  }

  const sessionData = session.data()

  // Verify session belongs to user
  if (sessionData.userId !== userId) {
    await logSuspiciousActivity(userId, 'session_hijack_attempt', { sessionId })
    throw new functions.https.HttpsError('permission-denied', 'Session mismatch')
  }

  // Verify session hasn't already been validated
  if (sessionData.validated) {
    throw new functions.https.HttpsError('already-exists', 'Session already validated')
  }

  // Anti-cheat checks
  const violations = []

  // Check 1: Answer timing (minimum 500ms per answer)
  for (const answer of answers) {
    if (answer.timeToAnswer && answer.timeToAnswer < 500) {
      violations.push({
        type: 'fast_answer',
        questionIndex: answer.questionIndex,
        time: answer.timeToAnswer,
      })
    }
  }

  // Check 2: Total game time (minimum 30 seconds for 10 questions)
  const gameStartTime = sessionData.startedAt.toMillis()
  const gameEndTime = Date.now()
  const totalTime = gameEndTime - gameStartTime
  const minGameTime = answers.length * 3000 // 3 seconds per question minimum

  if (totalTime < minGameTime) {
    violations.push({
      type: 'game_too_fast',
      totalTime,
      expected: minGameTime,
    })
  }

  // Check 3: Score sanity (max 100 points per correct answer)
  const correctCount = answers.filter(a => a.isCorrect).length
  const maxPossibleScore = correctCount * 100
  if (finalScore > maxPossibleScore) {
    violations.push({
      type: 'score_exceeds_max',
      claimed: finalScore,
      maxPossible: maxPossibleScore,
    })
  }

  // Check 4: Perfect game frequency (flag if too many)
  if (correctCount === answers.length) {
    const recentPerfectGames = await db.collection('sessions')
      .where('userId', '==', userId)
      .where('perfectGame', '==', true)
      .where('startedAt', '>', admin.firestore.Timestamp.fromMillis(Date.now() - 3600000))
      .get()

    if (recentPerfectGames.size >= 5) {
      violations.push({
        type: 'excessive_perfect_games',
        count: recentPerfectGames.size,
      })
    }
  }

  // If violations, log and potentially reject
  if (violations.length >= 3) {
    await logSuspiciousActivity(userId, 'multiple_violations', { sessionId, violations })

    // Update session as flagged
    await sessionRef.update({
      validated: true,
      flagged: true,
      violations,
      validatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return {
      success: false,
      flagged: true,
      message: 'Session flagged for review',
    }
  }

  // Calculate validated score
  const validatedScore = Math.min(finalScore, maxPossibleScore)

  // Update session
  await sessionRef.update({
    validated: true,
    flagged: false,
    validatedScore,
    perfectGame: correctCount === answers.length,
    validatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  // Update user progress with validated score
  const progressRef = db.collection('progress').doc(userId)
  await progressRef.set({
    lastValidatedScore: validatedScore,
    lastGameAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true })

  return {
    success: true,
    validatedScore,
    warnings: violations.length > 0 ? violations : undefined,
  }
})

// ===========================================
// LEADERBOARD: Update Weekly Standings
// ===========================================

exports.updateLeaderboard = functions.firestore
  .document('sessions/{sessionId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data()
    const after = change.after.data()

    // Only process when session becomes validated and not flagged
    if (!before.validated && after.validated && !after.flagged) {
      const userId = after.userId
      const score = after.validatedScore

      // Get current week ID
      const now = new Date()
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const weekId = weekStart.toISOString().split('T')[0]

      // Update weekly standings
      const standingRef = db.collection('leagues').doc(weekId).collection('standings').doc(userId)

      await db.runTransaction(async (transaction) => {
        const standing = await transaction.get(standingRef)

        if (standing.exists) {
          const data = standing.data()
          transaction.update(standingRef, {
            totalScore: data.totalScore + score,
            gamesPlayed: data.gamesPlayed + 1,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          })
        } else {
          // Get user info
          const userDoc = await db.collection('users').doc(userId).get()
          const username = userDoc.exists ? userDoc.data().username : 'Player'

          transaction.set(standingRef, {
            userId,
            username,
            totalScore: score,
            gamesPlayed: 1,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          })
        }
      })
    }
  })

// ===========================================
// PREMIUM: Validate Purchase
// ===========================================

exports.validatePurchase = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in')
  }

  const { receiptData, platform } = data
  const userId = context.auth.uid

  // In production, validate with:
  // - Apple: https://buy.itunes.apple.com/verifyReceipt
  // - Google: Google Play Developer API
  // - Stripe: Stripe API

  // For now, log the attempt
  await db.collection('purchaseAttempts').add({
    userId,
    platform,
    receiptData: receiptData.substring(0, 100), // Truncate for logging
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  throw new functions.https.HttpsError('unimplemented', 'Payment validation not configured')
})

// ===========================================
// REFERRALS: Process Referral
// ===========================================

exports.processReferral = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in')
  }

  const { referralCode } = data
  const referredId = context.auth.uid

  // Find referrer by code
  const referrerQuery = await db.collection('users')
    .where('referralCode', '==', referralCode)
    .limit(1)
    .get()

  if (referrerQuery.empty) {
    throw new functions.https.HttpsError('not-found', 'Invalid referral code')
  }

  const referrerId = referrerQuery.docs[0].id

  // Prevent self-referral
  if (referrerId === referredId) {
    throw new functions.https.HttpsError('invalid-argument', 'Cannot refer yourself')
  }

  // Check if already referred
  const existingRef = await db.collection('referrals')
    .where('referredId', '==', referredId)
    .limit(1)
    .get()

  if (!existingRef.empty) {
    throw new functions.https.HttpsError('already-exists', 'Already used a referral code')
  }

  // Create referral record
  await db.collection('referrals').add({
    referrerId,
    referredId,
    code: referralCode,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  // Award both users
  const batch = db.batch()

  // Award referrer: 100 coins + 1 power-up
  const referrerProgress = db.collection('progress').doc(referrerId)
  batch.update(referrerProgress, {
    coins: admin.firestore.FieldValue.increment(100),
    'powerups.fiftyFifty': admin.firestore.FieldValue.increment(1),
  })

  // Award referred: 50 coins
  const referredProgress = db.collection('progress').doc(referredId)
  batch.set(referredProgress, {
    coins: admin.firestore.FieldValue.increment(50),
  }, { merge: true })

  await batch.commit()

  return { success: true }
})

// ===========================================
// HELPER: Log Suspicious Activity
// ===========================================

async function logSuspiciousActivity(userId, type, details) {
  await db.collection('suspiciousActivity').add({
    userId,
    type,
    details,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ip: 'server-logged', // In production, get from request
  })

  // If user has too many violations, consider banning
  const recentViolations = await db.collection('suspiciousActivity')
    .where('userId', '==', userId)
    .where('createdAt', '>', admin.firestore.Timestamp.fromMillis(Date.now() - 86400000))
    .get()

  if (recentViolations.size >= 10) {
    await db.collection('users').doc(userId).update({
      flaggedForReview: true,
      flaggedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }
}

// ===========================================
// SCHEDULED: Weekly League Reset
// ===========================================

exports.weeklyLeagueReset = functions.pubsub
  .schedule('0 0 * * 0') // Every Sunday at midnight
  .timeZone('UTC')
  .onRun(async (context) => {
    // Get last week's standings
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastWeekId = lastWeek.toISOString().split('T')[0]

    // Process rewards for top players
    const standingsRef = db.collection('leagues').doc(lastWeekId).collection('standings')
    const topPlayers = await standingsRef.orderBy('totalScore', 'desc').limit(100).get()

    const batch = db.batch()

    topPlayers.docs.forEach((doc, index) => {
      const rank = index + 1
      const userId = doc.id
      const progressRef = db.collection('progress').doc(userId)

      // Award coins based on rank
      let coins = 0
      if (rank === 1) coins = 1000
      else if (rank <= 3) coins = 500
      else if (rank <= 10) coins = 250
      else if (rank <= 50) coins = 100
      else coins = 50

      batch.update(progressRef, {
        coins: admin.firestore.FieldValue.increment(coins),
        weeklyXP: 0, // Reset weekly XP
      })
    })

    await batch.commit()

    console.log(`Weekly reset complete. Rewarded ${topPlayers.size} players.`)
    return null
  })
