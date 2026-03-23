import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  FaClock, 
  FaLightbulb,
  FaCheckCircle,
  FaRocket,
  FaBrain,
  FaHeart,
  FaCoffee,
  FaHourglassHalf
} from 'react-icons/fa'
import { stopProctoring, startProctoring } from './proctoringSession'
import './TechnicalTestRelaxation.css'

const TechnicalTestRelaxation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes = 300 seconds
  const [isRelaxationComplete, setIsRelaxationComplete] = useState(false)

  useEffect(() => {
    // Stop camera during relaxation period
    stopProctoring()
    
    if (timeLeft <= 0) {
      setIsRelaxationComplete(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const startTechnicalTest = () => {
    // Restart camera for technical test
    startProctoring()
    // First go to compatibility check
    navigate('/compatibility-check', { state: { nextRoute: '/technical-test' } })
  }

  const progressPercentage = ((300 - timeLeft) / 300) * 100

  return (
    <div className="relaxation-page">
      {/* Dynamic Background Elements */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>
      
      <div className="relaxation-card">
        
        {/* LOGO */}
        <div className="cv-logo anim-fade-in-down">
          <span className="cv-tag">{"{cv}"}</span>
          <span className="cv-name">CODEVERGE</span>
        </div>

        {/* ICON */}
        <span className="celebration-emoji anim-bounce">🎓</span>

        {/* TITLE */}
        <h1 className="relaxation-title anim-slide-up" style={{ animationDelay: '0.1s' }}>
          CONGRATULATIONS! YOU PASSED THE APTITUDE TEST!
        </h1>

        <p className="relaxation-subtitle anim-slide-up" style={{ animationDelay: '0.2s' }}>
          <FaRocket className="me-2 text-primary" />
          Get ready for your Technical Round
        </p>

        {/* INFO BOX */}
        <div className="relaxation-alert anim-slide-up" style={{ animationDelay: '0.3s' }}>
          <FaHourglassHalf className="me-1" /> Take a 5-minute relaxation break before starting the technical test.
        </div>

        {/* TIMER SECTION */}
        <div className="timer-section anim-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="timer-container">
            <svg className="timer-svg" viewBox="0 0 160 160">
              <circle className="timer-circle-bg" cx="80" cy="80" r="70" />
              <circle 
                className="timer-circle-progress" 
                cx="80" cy="80" r="70" 
                style={{ 
                  strokeDashoffset: 440 - (440 * (300 - timeLeft)) / 300 
                }}
              />
            </svg>
            <div className="timer-text">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-container anim-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {isRelaxationComplete ? 'Relaxation Complete! You are ready.' : 'Relaxation in Progress...'}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="action-buttons anim-slide-up" style={{ animationDelay: '0.6s' }}>
          <button 
            className="btn-premium btn-primary-gradient" 
            onClick={startTechnicalTest}
            disabled={!isRelaxationComplete}
          >
            {isRelaxationComplete ? (
              <><FaCheckCircle /> Start Technical Test</>
            ) : (
              <><FaClock /> Start Technical Test ({formatTime(timeLeft)})</>
            )}
          </button>
        </div>

        {/* TIPS */}
        <div className="tips-container anim-slide-up" style={{ animationDelay: '0.7s' }}>
          <p className="tips-title">
            <FaLightbulb /> Relaxation Tips:
          </p>
          <ul className="tips-list">
            <li><FaBrain className="tip-icon" /> Take deep breaths and relax your mind</li>
            <li><FaHeart className="tip-icon" /> Stretch your body and eyes</li>
            <li><FaCoffee className="tip-icon" /> Drink some water</li>
            <li><FaRocket className="tip-icon" /> Prepare yourself mentally</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default TechnicalTestRelaxation
