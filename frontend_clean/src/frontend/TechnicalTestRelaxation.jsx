import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  FaClock, 
  FaArrowLeft,
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

  const goBack = () => {
    navigate('/result')
  }

  const progressPercentage = ((300 - timeLeft) / 300) * 100

  return (
    <div className="relaxation-page">
      <div className="relaxation-card">
        
        {/* LOGO */}
        <div className="cv-logo">
          <span className="cv-tag">{"{cv}"}</span>
          <span className="cv-name">CODEVERGE</span>
        </div>

        {/* ICON */}
        <span className="celebration-emoji">🎓</span>

        {/* TITLE */}
        <h1 className="relaxation-title">
          CONGRATULATIONS! YOU PASSED THE APTITUDE TEST!
        </h1>

        <p className="relaxation-subtitle">
          <FaRocket className="me-2" />
          Get ready for your Technical Round
        </p>

        {/* INFO BOX */}
        <div className="relaxation-alert">
          <FaHourglassHalf className="me-1" /> Take a 5-minute relaxation break before starting the technical test.
        </div>

        {/* TIMER */}
        <div className="timer-container">
          <div className="timer-circle">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-container">
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
        <div className="action-buttons">
          <button className="btn-premium btn-outline" onClick={goBack}>
            <FaArrowLeft /> Back to Results
          </button>

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
        <div className="tips-container">
          <p className="tips-title">
            <FaLightbulb /> Relaxation Tips:
          </p>
          <ul className="tips-list">
            <li><FaBrain /> Take deep breaths and relax your mind</li>
            <li><FaHeart /> Stretch your body and eyes</li>
            <li><FaCoffee /> Drink some water</li>
            <li><FaRocket /> Prepare yourself mentally</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default TechnicalTestRelaxation
