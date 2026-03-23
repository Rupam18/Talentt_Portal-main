import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useProctoring Hook
 * 
 * Detects tab switching and window blur events.
 * Persists violations in localStorage.
 * Triggers auto-submission when violation limit is reached.
 * 
 * @param {Object} options Configuration options
 * @param {string} options.candidateId ID of the candidate
 * @param {string} options.testId ID of the current test
 * @param {Function} options.onViolation Callback on violation detection
 * @param {Function} options.onAutoSubmit Callback when limit is reached
 * @returns {Object} proctoring state and handlers
 */
export const useProctoring = ({ 
    candidateId, 
    testId, 
    onViolation, 
    onAutoSubmit 
}) => {
    const [violationCount, setViolationCount] = useState(0)
    const [suspicionScore, setSuspicionScore] = useState(0)
    const [lastViolationTime, setLastViolationTime] = useState(0)
    
    const DEBOUNCE_TIME = 2000 // 2 seconds between violations
    const STORAGE_KEY = `proctoring_violations_${candidateId}_${testId}`

    // Clear stale violations from any previous session so every test starts at 0.
    // (Do NOT read old counts and trigger auto-submit — that caused immediate submission.)
    useEffect(() => {
        localStorage.removeItem(STORAGE_KEY)
        setViolationCount(0)
        setSuspicionScore(0)
    }, [STORAGE_KEY])

    const reportViolation = useCallback(async (type) => {
        const now = Date.now()
        if (now - lastViolationTime < DEBOUNCE_TIME) return
        
        const newCount = violationCount + 1
        const newScore = suspicionScore + 10
        
        setViolationCount(newCount)
        setSuspicionScore(newScore)
        setLastViolationTime(now)
        
        // Persist to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
            count: newCount, 
            score: newScore 
        }))

        // Trigger UI callback
        onViolation && onViolation({ 
            type, 
            count: newCount, 
            score: newScore,
            attemptsLeft: Math.max(0, 10 - newCount)
        })

        // Backend Integration
        try {
            await fetch('/api/violations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    candidateId,
                    testId,
                    type,
                    timestamp: new Date().toISOString(),
                    suspicionScore: newScore
                })
            })
        } catch (error) {
            console.error('Failed to log violation to backend:', error)
        }

        // Auto-submission check
        if (newCount >= 10) {
            onAutoSubmit && onAutoSubmit()
        }
    }, [violationCount, suspicionScore, lastViolationTime, STORAGE_KEY, candidateId, testId, onViolation, onAutoSubmit])

    const handleVisibilityChange = useCallback(() => {
        if (document.hidden) {
            reportViolation('TAB_SWITCH')
        }
    }, [reportViolation])

    // Window blur removed - too many false positives from clicking browser UI
    // const handleWindowBlur = useCallback(() => {
    //     reportViolation('WINDOW_BLUR')
    // }, [reportViolation])

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange)
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [handleVisibilityChange])

    return {
        violationCount,
        suspicionScore,
        attemptsLeft: Math.max(0, 10 - violationCount)
    }
}
