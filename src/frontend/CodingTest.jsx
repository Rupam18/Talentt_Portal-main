import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form, Nav } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiClock, FiCode, FiPlay, FiSave, FiTerminal, FiHome, FiBarChart2, FiFileText, FiSettings, FiLogOut, FiUsers, FiUser } from 'react-icons/fi'
import CameraCornerPreview from './CameraCornerPreview'
import { stopProctoring } from './proctoringSession'
import { useProctoring } from './hooks/useProctoring'
import ViolationModal from './components/ViolationModal'
import './CodingTest.css'

function CodingTest() {
  const navigate = useNavigate()
  const location = useLocation()
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes in seconds
  const [testStarted, setTestStarted] = useState(false)
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [userCode, setUserCode] = useState('')
  const [userCodes, setUserCodes] = useState({}) // Store code for each question
  const [testSessionId] = useState(`session_${Date.now()}_${JSON.parse(localStorage.getItem('user') || '{}').id || 1}`)
  const [language, setLanguage] = useState('JAVASCRIPT')
  const [testResults, setTestResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState('')
  const [showViolationModal, setShowViolationModal] = useState(false)
  const [currentViolation, setCurrentViolation] = useState(null)
  const intervalRef = useRef(null)

  // Proctoring callbacks
  const handleViolation = React.useCallback((v) => {
    setCurrentViolation(v)
    setShowViolationModal(true)
  }, [])

  const handleAutoSubmit = React.useCallback(() => {
    alert('Test submitted due to multiple proctoring violations.')
    handleSubmit()
  }, [])

  // Get user email
  const getUserEmail = React.useCallback(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const fallbackEmail = location?.state?.email || location?.state?.user?.email || ''
    const candidateEmail = (user.email || fallbackEmail || '').trim().toLowerCase()
    return candidateEmail || 'user@example.com'
  }, [location])

  const { violationCount, attemptsLeft } = useProctoring({
    candidateId: getUserEmail(),
    testId: 'coding_test',
    onViolation: handleViolation,
    onAutoSubmit: handleAutoSubmit
  })

  const getUserName = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const firstName = (user.firstName || user.first_name || location?.state?.firstName || '').trim()
    const lastName = (user.lastName || user.last_name || location?.state?.lastName || '').trim()
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()

    if (fullName) return fullName

    const email = getUserEmail()
    if (email && email.includes('@')) {
      return email.split('@')[0]
    }

    return 'Candidate'
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    fetchQuestions()
    checkEligibility()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (questions.length > 0 && questions[0]) {
      // Set initial time but don't start countdown
      const initialTime = questions[0].timeLimitMinutes * 60 || 1200
      setTimeLeft(initialTime)
    }
  }, [questions])

  useEffect(() => {
    if (testStarted && timeLeft > 0 && !testSubmitted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [testStarted, timeLeft, testSubmitted])

  const checkEligibility = () => {
    const eligibility = localStorage.getItem('codingRoundEligibility')
    if (!eligibility) {
      navigate('/technical-result')
      return
    }
    
    try {
      const eligibilityData = JSON.parse(eligibility)
      if (!eligibilityData.eligibleForCodingRound) {
        navigate('/technical-result')
        return
      }
    } catch (error) {
      // Fallback for string-based eligibility check
      if (eligibility !== 'true') {
        navigate('/technical-result')
        return
      }
    }
  }

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const dummyQuestions = [
        {
          id: 1,
          questionText: "Write a function that takes an array of numbers and returns the sum of all positive numbers in the array.",
          questionType: "ALGORITHM",
          difficultyLevel: "EASY",
          programmingLanguage: "JAVASCRIPT",
          timeLimitMinutes: 20,
          sampleInput: "[1, -2, 3, 4, -5]",
          expectedOutput: "8",
          constraints: "Array length will be between 1 and 100. Numbers will be integers between -1000 and 1000.",
          hints: "Use filter() method to select positive numbers, then use reduce() to sum them up.",
          solutionCode: "function sumPositiveNumbers(arr) {\n  return arr.filter(num => num > 0).reduce((sum, num) => sum + num, 0);\n}",
          testCases: '[{"input": "[1, -2, 3, 4, -5]", "output": "8"}]',
          points: 10,
          isActive: true
        }
      ]
      
      try {
        const response = await fetch('/api/coding-questions/all')
        if (response.ok) {
          const data = await response.json()
          const activeQuestions = data.filter(q => q.isActive)
          if (activeQuestions.length > 0) {
            setQuestions(activeQuestions)
          } else {
            setQuestions(dummyQuestions)
          }
        } else {
          setQuestions(dummyQuestions)
        }
      } catch (apiError) {
        setQuestions(dummyQuestions)
      }
    } catch (error) {
      console.error('Error in fetchQuestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (testSubmitted) return

    setTestSubmitted(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    stopProctoring()

    // Save current code one last time before submitting
    setUserCodes(prev => ({
      ...prev,
      [currentQuestion.id]: userCode
    }))

    const results = questions.map((question, index) => ({
      userId: JSON.parse(localStorage.getItem('user') || '{}').id || 1,
      candidate: getUserName(),
      questionId: question.id,
      questionText: question.questionText,
      userCode: userCodes[question.id] || (index === currentQuestionIndex ? userCode : ''),
      language: language,
      timeTakenSeconds: Math.floor(((currentQuestion?.timeLimitMinutes * 60 || 1800) - timeLeft) / questions.length),
      submittedAt: new Date().toISOString(),
      testSessionId: testSessionId
    }))

    setTestResults(results)

    try {
      const response = await fetch('/api/coding-questions/submit-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results),
      })
      
      if (response.ok) {
        window.location.href = '/all-tests-completed'
      } else {
        const errorData = await response.json();
        setError(`Failed to save results: ${errorData.message}`)
        setTestSubmitted(false)
      }
    } catch (error) {
      setError('Error saving coding results. Please try again.')
      setTestSubmitted(false)
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTest = () => {
    setTestStarted(true)
    setTimeLeft(currentQuestion?.timeLimitMinutes * 60 || 1200)
  }

  const handleQuestionChange = (direction) => {
    // Save current code before switching
    setUserCodes(prev => ({
      ...prev,
      [currentQuestion.id]: userCode
    }))

    if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      setUserCode(userCodes[questions[nextIndex].id] || '')
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(prevIndex)
      setUserCode(userCodes[questions[prevIndex].id] || '')
    }
  }

  const getLanguageIcon = (language) => {
    switch (language) {
      case 'JAVASCRIPT': return '🟨'
      case 'PYTHON': return '🐍'
      case 'JAVA': return '☕'
      case 'CPP': return '⚙️'
      case 'C': return '⚡'
      case 'CSHARP': return '🔷'
      default: return '💻'
    }
  }

  const getLanguageLabel = (language) => {
    switch (language) {
      case 'JAVASCRIPT': return 'JavaScript'
      case 'PYTHON': return 'Python'
      case 'JAVA': return 'Java'
      case 'CPP': return 'C++'
      case 'C': return 'C'
      case 'CSHARP': return 'C#'
      default: return language || 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="test-page-wrap d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-slate-400">Initializing coding environment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="test-page-wrap d-flex align-items-center justify-content-center">
        <Container className="text-center">
          <Alert variant="danger" className="glass-alert">{error}</Alert>
          <button className="btn-primary-premium mt-3" onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </button>
        </Container>
      </div>
    )
  }

  return (
    <div className="test-page-wrap">
      {/* 4-Blob Background System */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>
      <div className="bg-blob blob-4"></div>

      {/* Premium Header */}
      <div className="test-header">
        <div className="test-header-content">
          <div className="test-header-left">
            <img src="/codeverge.svg" alt="Codeverge" className="test-header-logo" />
          </div>
          <div className="test-header-center">
            <span className="badge bg-dark">Question {currentQuestionIndex + 1} / {questions.length}</span>
            <span className={`badge ${timeLeft < 300 ? 'bg-danger' : 'bg-success'}`}>
              <FiClock className="me-2" /> {formatTime(timeLeft)}
            </span>
          </div>
          <div className="test-header-right">
            <div className="user-email">{getUserEmail()}</div>
          </div>
        </div>
      </div>

      <Container fluid className="test-layout">
        <Row className="g-4">
          {/* Question Section */}
          <Col lg={5} className="animate-fadeIn">
            <div className="question-card">
              <div className="card-header">
                <div className="question-header">
                  <h5>Problem Statement</h5>
                  <div className="question-meta">
                    <span className="language-badge">
                      {getLanguageIcon(currentQuestion?.programmingLanguage)}
                      {getLanguageLabel(currentQuestion?.programmingLanguage)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="question-content">
                <h6>{currentQuestion?.questionText}</h6>
                
                {currentQuestion?.sampleInput && (
                  <div className="sample-section">
                    <h6>Sample Input</h6>
                    <pre className="sample-code">{currentQuestion.sampleInput}</pre>
                  </div>
                )}
                
                {currentQuestion?.expectedOutput && (
                  <div className="sample-section">
                    <h6>Expected Output</h6>
                    <pre className="sample-code">{currentQuestion.expectedOutput}</pre>
                  </div>
                )}
                
                {currentQuestion?.constraints && (
                  <div className="constraints-section">
                    <h6>Constraints</h6>
                    <p className="text-slate-400 small">{currentQuestion.constraints}</p>
                  </div>
                )}
                
                {currentQuestion?.hints && (
                  <div className="hints-section">
                    <h6>💡 Pro Tip</h6>
                    <p className="text-slate-400 small">{currentQuestion.hints}</p>
                  </div>
                )}
              </div>
              
              <div className="question-navigation">
                <button 
                  className="btn-outline-glass" 
                  onClick={() => handleQuestionChange('prev')}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                <span className="question-counter">
                  {currentQuestionIndex + 1} of {questions.length}
                </span>
                <button 
                  className="btn-outline-glass" 
                  onClick={() => handleQuestionChange('next')}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </Col>

          {/* Code Editor Section */}
          <Col lg={7} className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="code-editor-card">
              <div className="card-header">
                <div className="editor-header">
                  <h5>Code Editor <span className="text-blue-400 opacity-50 ml-2">-- terminal_v1.0</span></h5>
                </div>
              </div>
              <div className="code-editor-container">
                <div className="editor-line-numbers">
                  {userCode.split('\n').map((_, index) => (
                    <div key={index} className="line-number">{index + 1}</div>
                  ))}
                </div>
                <textarea
                  className="code-editor"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="// Write your high-performance code here..."
                  disabled={!testStarted || testSubmitted}
                  spellCheck={false}
                />
              </div>
              
              <div className="editor-actions">
                {!testStarted && (
                  <button className="btn-success-premium" onClick={startTest}>
                    <FiPlay className="me-2" /> Start Coding Round
                  </button>
                )}
                
                {testStarted && !testSubmitted && (
                  <button className="btn-success-premium" onClick={handleSubmit}>
                    <FiSave className="me-2" /> Final Submit
                  </button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      
      {!testSubmitted && <CameraCornerPreview />}
      <ViolationModal 
        show={showViolationModal} 
        violation={currentViolation} 
        attemptsLeft={attemptsLeft} 
        onClose={() => setShowViolationModal(false)} 
      />
    </div>
  )
}

export default CodingTest


