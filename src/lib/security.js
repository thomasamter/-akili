// AKILI Security Utilities
// Comprehensive security measures for the trivia game

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize user input to prevent XSS attacks
 * Removes or escapes potentially dangerous characters
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input

  return input
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (except for safe data URLs)
    .replace(/data:(?!image\/(png|jpg|jpeg|gif|webp))/gi, '')
    .trim()
}

/**
 * Sanitize object recursively
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeInput(obj) : obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }

  const sanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    sanitized[sanitizeInput(key)] = sanitizeObject(value)
  }
  return sanitized
}

// ============================================
// INPUT VALIDATION
// ============================================

/**
 * Validate username (alphanumeric, 3-20 chars)
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') return false
  const sanitized = sanitizeInput(username)
  return /^[a-zA-Z0-9_]{3,20}$/.test(sanitized)
}

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const sanitized = sanitizeInput(email)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(sanitized) && sanitized.length <= 254
}

/**
 * Validate quiz answer (number within range)
 */
export const validateAnswer = (answer, maxOptions) => {
  const num = parseInt(answer, 10)
  return !isNaN(num) && num >= 0 && num < maxOptions
}

/**
 * Validate score (positive integer, reasonable limit)
 */
export const validateScore = (score) => {
  const num = parseInt(score, 10)
  return !isNaN(num) && num >= 0 && num <= 1000000
}

// ============================================
// SECURE STORAGE
// ============================================

const STORAGE_PREFIX = 'akili_'
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'akili_dev_key_change_in_prod'

/**
 * Simple obfuscation for localStorage (not true encryption)
 * For sensitive data, use proper encryption or secure backend
 */
const obfuscate = (data) => {
  try {
    const str = JSON.stringify(data)
    return btoa(encodeURIComponent(str))
  } catch {
    return null
  }
}

const deobfuscate = (data) => {
  try {
    return JSON.parse(decodeURIComponent(atob(data)))
  } catch {
    return null
  }
}

/**
 * Securely store data in localStorage
 */
export const secureStore = {
  set: (key, value) => {
    try {
      const sanitizedKey = STORAGE_PREFIX + sanitizeInput(key)
      const obfuscated = obfuscate(value)
      if (obfuscated) {
        localStorage.setItem(sanitizedKey, obfuscated)
        return true
      }
      return false
    } catch {
      return false
    }
  },

  get: (key) => {
    try {
      const sanitizedKey = STORAGE_PREFIX + sanitizeInput(key)
      const data = localStorage.getItem(sanitizedKey)
      return data ? deobfuscate(data) : null
    } catch {
      return null
    }
  },

  remove: (key) => {
    try {
      const sanitizedKey = STORAGE_PREFIX + sanitizeInput(key)
      localStorage.removeItem(sanitizedKey)
      return true
    } catch {
      return false
    }
  },

  clear: () => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key))
      return true
    } catch {
      return false
    }
  }
}

// ============================================
// RATE LIMITING (Client-side)
// ============================================

const rateLimitStore = new Map()

/**
 * Client-side rate limiting for API calls
 * @param {string} action - The action being rate limited
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 */
export const checkRateLimit = (action, maxAttempts = 10, windowMs = 60000) => {
  const now = Date.now()
  const key = sanitizeInput(action)

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { attempts: [], blocked: false })
  }

  const record = rateLimitStore.get(key)

  // Clean old attempts
  record.attempts = record.attempts.filter(time => now - time < windowMs)

  // Check if blocked
  if (record.attempts.length >= maxAttempts) {
    record.blocked = true
    return { allowed: false, remainingAttempts: 0, retryAfter: windowMs }
  }

  // Record this attempt
  record.attempts.push(now)
  record.blocked = false

  return {
    allowed: true,
    remainingAttempts: maxAttempts - record.attempts.length,
    retryAfter: 0
  }
}

/**
 * Reset rate limit for an action
 */
export const resetRateLimit = (action) => {
  rateLimitStore.delete(sanitizeInput(action))
}

// ============================================
// SECURE API CALLS
// ============================================

/**
 * Make a secure API call with validation
 */
export const secureApiCall = async (url, options = {}) => {
  // Validate URL
  try {
    const urlObj = new URL(url)
    // Only allow HTTPS in production
    if (import.meta.env.PROD && urlObj.protocol !== 'https:') {
      throw new Error('HTTPS required in production')
    }
  } catch (error) {
    console.error('Invalid URL:', error)
    return { error: 'Invalid URL', data: null }
  }

  // Check rate limit
  const rateCheck = checkRateLimit(`api_${url}`, 30, 60000)
  if (!rateCheck.allowed) {
    return { error: 'Rate limit exceeded', data: null, retryAfter: rateCheck.retryAfter }
  }

  // Add security headers
  const secureOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'same-origin', // Don't send cookies to other domains
  }

  // Sanitize body if present
  if (secureOptions.body && typeof secureOptions.body === 'string') {
    try {
      const parsed = JSON.parse(secureOptions.body)
      secureOptions.body = JSON.stringify(sanitizeObject(parsed))
    } catch {
      // Not JSON, sanitize as string
      secureOptions.body = sanitizeInput(secureOptions.body)
    }
  }

  try {
    const response = await fetch(url, secureOptions)

    if (!response.ok) {
      return { error: `HTTP ${response.status}`, data: null }
    }

    const data = await response.json()
    return { error: null, data: sanitizeObject(data) }
  } catch (error) {
    console.error('API call failed:', error)
    return { error: 'Network error', data: null }
  }
}

// ============================================
// ANTI-CHEAT MEASURES
// ============================================

/**
 * Generate a game session token
 */
export const generateSessionToken = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate answer timing (detect if answered too fast - likely cheating)
 */
export const validateAnswerTiming = (questionShownTime, answerTime, minTimeMs = 1000) => {
  const elapsed = answerTime - questionShownTime
  return elapsed >= minTimeMs // Must take at least 1 second to answer
}

/**
 * Track suspicious activity
 */
const suspiciousActivityLog = []

export const logSuspiciousActivity = (activity, details = {}) => {
  suspiciousActivityLog.push({
    timestamp: Date.now(),
    activity: sanitizeInput(activity),
    details: sanitizeObject(details),
  })

  // If too many suspicious activities, flag the session
  if (suspiciousActivityLog.length > 10) {
    console.warn('AKILI: Suspicious activity detected')
    // In production, report to backend
  }
}

// ============================================
// CONTENT SECURITY
// ============================================

/**
 * Validate that content is safe to display
 */
export const isSafeContent = (content) => {
  if (typeof content !== 'string') return true

  // Check for suspicious patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ]

  return !dangerousPatterns.some(pattern => pattern.test(content))
}

// ============================================
// EXPORT SECURITY UTILITIES
// ============================================

export default {
  sanitizeInput,
  sanitizeObject,
  validateUsername,
  validateEmail,
  validateAnswer,
  validateScore,
  secureStore,
  checkRateLimit,
  resetRateLimit,
  secureApiCall,
  generateSessionToken,
  validateAnswerTiming,
  logSuspiciousActivity,
  isSafeContent,
}
