import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaClock, 
  FaRocket,
  FaLightbulb,
  FaCode,
  FaArrowLeft,
  FaHourglassHalf
} from 'react-icons/fa'
import codevergeLogo from './codeverge.svg'
import './CodingTestRelaxation.css'

const CodingTestRelaxation = () => {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes = 300 seconds
  const [isRelaxationComplete, setIsRelaxationComplete] = useState(false)

  useEffect(() => {
    // Check if user is eligible for coding round
    const codingEligibility = JSON.parse(localStorage.getItem('codingRoundEligibility') || '{}')
    if (!codingEligibility.eligibleForCodingRound) {
      alert('❌ Not eligible for coding round!\n\nYou must pass the technical test first.')
      navigate('/technical-test-relaxation')
      return
    }

    if (timeLeft <= 0) {
      setIsRelaxationComplete(true)
      // Auto-start after a small delay (3 seconds) when timer reaches 0
      const autoStartTimeout = setTimeout(() => {
        startCodingTest()
      }, 3000)
      return () => clearTimeout(autoStartTimeout)
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, navigate])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.max(0, seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const startCodingTest = () => {
    const codingEligibility = JSON.parse(localStorage.getItem('codingRoundEligibility') || '{}')
    if (!codingEligibility.eligibleForCodingRound) {
      alert('❌ Not eligible for coding round!\n\nYou must pass the technical test first.')
      navigate('/technical-test-relaxation')
      return
    }
    navigate('/compatibility-check', { state: { nextRoute: '/coding-test' } })
  }

  const goBack = () => {
    navigate('/technical-result')
  }

  const progressPercentage = ((300 - timeLeft) / 300) * 100

  return (
    <div className="coding-relaxation-page">
      {/* High-Intensity Background Blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>
      <div className="bg-blob blob-4"></div>

      <div className="premium-card animate-fadeIn">
        
        {/* LOGO */}
        <div className="brand-logo-container animate-fadeIn">
          <img src={codevergeLogo} alt="Codeverge Logo" className="brand-logo-svg" />
        </div>

        {/* TITLE */}
        <div className="title-stack">
          <h1 className="main-title">
            🎉 Congratulations! You Passed
          </h1>
          <h2 className="sub-title">
            Technical Test
          </h2>
          <p className="ready-text">
            🚀 Get ready for your Coding Round
          </p>
        </div>

        {/* INFO BOX */}
        <div className="relaxation-alert">
          <FaHourglassHalf className="me-2" /> 
          Take a 5-minute relaxation break before starting coding test.
        </div>

        {/* TIMER + PROGRESS (CENTERED) */}
        <div className="timer-focus-area">
          {/* TIMER */}
          <div className="timer-circle animate-pulseGlow">
            {formatTime(timeLeft)}
          </div>

          {/* PROGRESS BAR */}
          <div className="progress-box">
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%`, transition: 'width 1s linear' }}
              ></div>
            </div>
            <p className="progress-status">
              {isRelaxationComplete ? 'Relaxation Complete! Redirecting...' : 'Relaxation in Progress...'}
            </p>
          </div>
        </div>

        {/* SINGLE FOCUSED BUTTON */}
        <div className="button-group">
          <button 
            className="btn-cta-premium" 
            onClick={startCodingTest}
            disabled={!isRelaxationComplete}
            style={!isRelaxationComplete ? { opacity: 0.8, cursor: 'not-allowed' } : {}}
          >
            {isRelaxationComplete ? (
              <><FaRocket className="me-2" /> Start Coding Round</>
            ) : (
              <><FaClock className="me-2" /> Go for Coding Round ({formatTime(timeLeft)})</>
            )}
          </button>
        </div>

        {/* TIPS */}
        <div className="tips-panel">
          <p className="tips-title"><FaLightbulb /> Relaxation Tips:</p>
          <ul className="tips-list">
            <li>• Take deep breaths and relax your mind</li>
            <li>• Stretch your body and give your eyes a rest</li>
            <li>• Stay hydrated - drink some water</li>
            <li>• Mentally prepare for the coding challenges</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default CodingTestRelaxation
