import React, { useState, useEffect } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Row, ProgressBar } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  FaTrophy, 
  FaChartLine, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowLeft, 
  FaGraduationCap,
  FaUserGraduate,
  FaAward,
  FaChartBar,
  FaBook,
  FaHome,
  FaRocket,
  FaMedal,
  FaCertificate,
  FaLaptopCode
} from 'react-icons/fa'

import './TechnicalResult.css'
import './TechnicalResultCodingRound.css'

// Enhanced chart components with animations
const ScoreChart = ({ score, total, label, color }) => {
  const percentage = (score / total) * 100
  return (
    <div className="chart-item">
      <h6 className="chart-label">{label}</h6>
      <div className="chart-container">
        <div className="chart-circle">
          <div className="chart-fill" style={{ 
            background: `conic-gradient(${color} ${percentage}% 0%, ${color} 100%)`,
            transform: `rotate(-90deg)`
          }}></div>
          <div className="chart-center">
            <span className="chart-percentage">{Math.round(percentage)}%</span>
            <span className="chart-score">{score}/{total}</span>
          </div>
        </div>
      </div>
      <div className="chart-status">
        {percentage >= 75 && <span className="status-excellent">🌟 Excellent</span>}
        {percentage >= 50 && percentage < 75 && <span className="status-good">👍 Good</span>}
        {percentage >= 35 && percentage < 50 && <span className="status-average">📈 Average</span>}
        {percentage < 35 && <span className="status-poor">💪 Keep Trying</span>}
      </div>
    </div>
  )
}

const PerformanceMeter = ({ score, total }) => {
  const percentage = (score / total) * 100
  const getColor = (percent) => {
    if (percent >= 80) return '#10b981' // Excellent - Green
    if (percent >= 60) return '#f59e0b' // Good - Orange  
    if (percent >= 40) return '#ef4444' // Average - Yellow
    return '#ef4444' // Poor - Red
  }
  
  const getIcon = (percent) => {
    if (percent >= 80) return <FaMedal className="performance-icon" />
    if (percent >= 60) return <FaAward className="performance-icon" />
    if (percent >= 40) return <FaTrophy className="performance-icon" />
    return <FaGraduationCap className="performance-icon" />
  }
  
  return (
    <div className="performance-meter">
      <h6 className="meter-title">
        {getIcon(percentage)} Technical Assessment Performance
      </h6>
      <div className="meter-container">
        <div className="meter-track">
          <div 
            className="meter-fill" 
            style={{ 
              width: `${percentage}%`,
              backgroundColor: getColor(percentage)
            }}
          ></div>
        </div>
        <div className="meter-labels">
          <span className="meter-score">{score}/{total}</span>
          <span className="meter-percentage">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="meter-grade">
        {percentage >= 80 && <span className="grade-excellent">🎯 Outstanding Technical Performance!</span>}
        {percentage >= 60 && percentage < 80 && <span className="grade-good">👍 Strong Technical Skills!</span>}
        {percentage >= 40 && percentage < 60 && <span className="grade-average">📈 Developing Technical Competence</span>}
        {percentage < 40 && <span className="grade-poor">💪 Technical Skills Enhancement Needed</span>}
      </div>
    </div>
  )
}

function TechnicalResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const storedResult = (() => {
    try {
      return JSON.parse(localStorage.getItem('technicalTestResult') || 'null')
    } catch (error) {
      console.error('Failed to parse cached technical test result:', error)
      return null
    }
  })()
  const results = location.state || storedResult || {}
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Send email notification
  const sendEmailNotification = async () => {
    try {
      const recipientEmail = (results.email || user.email || '').trim()
      if (!recipientEmail) {
        console.error('No user email found for result notification')
        return
      }

      const emailData = {
        to: recipientEmail,
        subject: results.pass ? 'Congratulations! You Passed the Technical Test' : 'Test Results - Keep Learning!',
        message: results.pass 
          ? `Congratulations! You have successfully passed the technical test with a score of ${results.totalStats?.answered || 0}/${results.totalStats?.total || 0}. You have demonstrated strong technical skills. We will contact you soon with further details.`
          : `Thank you for taking the technical test. Your score was ${results.totalStats?.answered || 0}/${results.totalStats?.total || 0}. Don't worry! This is a learning opportunity. Review your weak areas and try again with better preparation.`
      }
      const endpoints = ['/api/send-result-email', '/api/auth/send-result-email']
      let lastError = ''

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData)
        })

        if (response.ok) {
          console.log(`Email sent successfully via ${endpoint}`)
          return
        }

        const errorBody = await response.text()
        lastError = `${endpoint} -> ${response.status} ${response.statusText} ${errorBody}`
      }

      console.error('Failed to send result email:', lastError)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  // Send email when component mounts
  React.useEffect(() => {
    if (results) {
      sendEmailNotification()
    }
  }, [results])

  if (!results) {
    return (
      <>
        {/* Minimal Branded Header */}
        <div className="result-header">
          <div className="logo">
            <span className="logo-icon">{'{cv}'}</span>
            <span className="logo-text">CODEVERGE</span>
          </div>
        </div>

        <div className="result-container">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <Card className="result-card shadow-lg p-5 text-center">
                  <Alert variant="warning">
                    Result not available. Please complete the technical test first.
                  </Alert>
                  <Button onClick={() => navigate('/technical-test-relaxation')}>Go to Technical Test</Button>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    )
  }

  // Calculate result data like AptitudeResult
  const calculateResultData = () => {
    const allSections = Object.values(results.sections || {})
    const totalQuestions = allSections.reduce((sum, section) => sum + (section.total || 0), 0)
    const totalCorrect = allSections.reduce((sum, section) => sum + (section.correct || 0), 0)
    const totalAnswered = allSections.reduce((sum, section) => sum + Object.keys(section.answers || {}).length, 0)
    const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    const passed = percentage >= 50

    // Calculate actual time taken
    const timeTaken = results.timeTaken || 1800 // Default to 30 minutes if not available
    const timeTakenMinutes = Math.floor(timeTaken / 60)
    const timeTakenSeconds = timeTaken % 60

    // Create section results like AptitudeResult
    const sectionResults = Object.entries(results.sections || {}).map(([key, section]) => ({
      section: section.sectionTitle || key,
      score: section.correct || 0,
      total: section.total || 0,
      percentage: section.percentage || 0
    }))

    // If no sections, create a default technical section
    if (sectionResults.length === 0 && totalQuestions > 0) {
      sectionResults.push({
        section: "Technical Assessment",
        score: totalCorrect,
        total: totalQuestions,
        percentage: percentage
      })
    }

    return {
      pass: passed,
      totalScore: totalCorrect,
      totalQuestions: totalQuestions,
      totalAnswered: totalAnswered,
      totalTimeTaken: timeTaken,
      totalTimeMinutes: timeTakenMinutes,
      totalTimeSeconds: timeTakenSeconds,
      sectionResults: sectionResults
    }
  }

  const result = calculateResultData()

  // Save technical test result to database
  const saveTechnicalTestResult = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const fallbackEmail = location?.state?.email || location?.state?.user?.email || ''
      const resultEmail = results?.email || results?.candidateEmail || results?.user?.email || ''
      const candidateEmail = (user.email || fallbackEmail || resultEmail || '').trim().toLowerCase()
      const resultName = results?.candidateName || results?.user?.name || ''
      const candidateName = (
        (`${user.firstName || ''} ${user.lastName || ''}`.trim()) ||
        (resultName || '').trim()
      ) || 'Unknown'
      const overallPercentage = result.totalQuestions > 0
        ? Math.round((result.totalScore / result.totalQuestions) * 100)
        : 0

      // Extract section data from results
      let sectionScore = 0
      let sectionTotal = 0
      let sectionPercentage = 0
      
      if (results.sections && Object.keys(results.sections).length > 0) {
        const firstSection = Object.values(results.sections)[0]
        sectionScore = firstSection.correct || 0
        sectionTotal = firstSection.total || 0
        sectionPercentage = firstSection.percentage || 0
      }

      const resultData = {
        candidateEmail,
        candidateName,
        totalQuestions: result.totalQuestions,
        totalCorrect: result.totalScore,
        totalAnswered: result.totalAnswered,
        percentageScore: overallPercentage,
        timeTakenSeconds: result.totalTimeTaken,
        passed: overallPercentage >= 50,
        sectionData: JSON.stringify(results.sections || {}),
        technicalSectionScore: sectionScore,
        technicalSectionTotal: sectionTotal,
        technicalSectionPercentage: sectionPercentage
      }

      console.log('Saving technical test result:', resultData)

      const response = await fetch('/api/technical-test-results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData)
      })

      const responseData = await response.json()
      
      if (responseData.success) {
        console.log('Technical test result saved successfully:', responseData)
        localStorage.removeItem('technicalTestResult')
      } else {
        console.error('Failed to save technical test result:', responseData.message)
        console.error('Save response payload:', responseData)
      }
    } catch (error) {
      console.error('Error saving technical test result:', error)
    }
  }

  // Save result when component loads
  useEffect(() => {
    if (result && Object.keys(result).length > 0) {
      saveTechnicalTestResult()
    }
  }, [])

  // Handle Go for Coding Round
  const handleGoForCodingRound = () => {
    // Store coding round eligibility
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const codingRoundData = {
      ...user,
      technicalTestPassed: true,
      technicalTestScore: result.totalScore,
      technicalTestDate: new Date().toISOString(),
      eligibleForCodingRound: true
    }
    localStorage.setItem('codingRoundEligibility', JSON.stringify(codingRoundData))
    
    // Navigate directly to coding test relaxation page (no confirmation popup)
    navigate('/coding-test-relaxation')
  }

  return (
    <>
      {/* Minimal Branded Header */}
      <div className="result-header">
        <div className="logo">
          <span className="logo-icon">{'{cv}'}</span>
          <span className="logo-text">CODEVERGE</span>
        </div>
      </div>

      {/* Centered Result Container */}
      <div className="result-container">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="result-card shadow-lg">
                <Card.Body className="p-4 p-md-5">
                {/* Title + Status */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Technical Test Results
                  </h2>

                  <span className={`bg-${result.pass ? 'green' : 'red'}-500 text-white text-xs px-3 py-1 rounded-lg`}>
                    {result.pass ? 'REQUIREMENT MET' : 'REQUIREMENT NOT MET'}
                  </span>
                </div>

                {/* Candidate */}
                <p className="text-sm text-slate-500 mb-6">
                  Candidate: <span className="font-medium text-slate-700">{user.firstName || 'User'} {user.lastName || ''}</span>
                </p>

                {/* Success/Failure Message */}
                <div className="result-message mb-4">
                  {result.pass ? (
                    <div className="success-message">
                      <h4 className="message-title">🎉 Congratulations!</h4>
                      <p className="message-text">You have successfully passed the technical test. Your performance shows strong technical skills and problem-solving abilities.</p>
                      <p className="message-text" style={{ color: '#ffffff', fontWeight: '600', marginTop: '0.5rem' }}>You have demonstrated excellent technical knowledge and practical skills.</p>
                      <div className="coding-eligibility-badge">
                        Eligible for Coding Round 🚀
                      </div>
                    </div>
                  ) : (
                    <div className="failure-message">
                      <h4 className="message-title">📚 Keep Learning!</h4>
                      <p className="message-text">Don't worry! This is a learning opportunity. Review your weak areas and try again with better preparation.</p>
                      <p className="message-text" style={{ color: '#ffffff', fontWeight: '600', marginTop: '0.5rem' }}>Focus on strengthening your technical fundamentals and practical skills.</p>
                    </div>
                  )}
                </div>

                {/* Performance Overview */}
                <div className="performance-overview mb-4">
                  <PerformanceMeter score={result.totalScore} total={result.totalQuestions} />
                </div>

                {/* Section-wise Results */}
                <div className="section-results mb-4">
                  <h5 className="section-results-title">📊 Section Performance</h5>
                  <div className="charts-grid">
                    {result.sectionResults && result.sectionResults.length > 0 ? (
                      result.sectionResults.map((section) => (
                        <ScoreChart 
                          key={section.section}
                          score={section.score}
                          total={section.total}
                          label={section.section}
                          color={section.score >= (section.total * 0.5) ? '#10b981' : '#f59e0b'}
                        />
                      ))
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-muted">No section data available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="detailed-stats mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* TECHNICAL SCORE */}
                    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
                      {/* Icon */}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <FaLaptopCode className="text-blue-600 text-xl" />
                      </div>
                      {/* Text Content */}
                      <div>
                        <p className="text-sm font-medium text-slate-500 tracking-wide">
                          TECHNICAL SCORE
                        </p>
                        <p className="text-2xl font-semibold text-blue-600">
                          {result.totalScore}
                        </p>
                        <p className="text-xs text-slate-400">out of {result.totalQuestions}</p>
                      </div>
                    </div>

                    {/* QUESTIONS COMPLETED */}
                    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
                      {/* Icon */}
                      <div className="bg-green-50 p-3 rounded-lg">
                        <FaCheckCircle className="text-green-600 text-xl" />
                      </div>
                      {/* Text Content */}
                      <div>
                        <p className="text-sm font-medium text-slate-500 tracking-wide">
                          QUESTIONS COMPLETED
                        </p>
                        <p className="text-2xl font-semibold text-blue-600">
                          {result.totalAnswered}
                        </p>
                        <p className="text-xs text-slate-400">out of {result.totalQuestions}</p>
                      </div>
                    </div>

                    {/* ASSESSMENT DURATION */}
                    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
                      {/* Icon */}
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <FaClock className="text-orange-600 text-xl" />
                      </div>
                      {/* Text Content */}
                      <div>
                        <p className="text-sm font-medium text-slate-500 tracking-wide">
                          ASSESSMENT DURATION
                        </p>
                        <p className="text-2xl font-semibold text-blue-600">
                          {result.totalTimeMinutes}:{String(result.totalTimeSeconds).padStart(2, '0')}
                        </p>
                        <p className="text-xs text-slate-400">minutes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 d-flex gap-2 flex-wrap justify-content-center">
                  {result.pass && (
                    <Button 
                      variant="success" 
                      size="lg" 
                      onClick={() => handleGoForCodingRound()} 
                      className="action-btn-compact coding-round-btn"
                    >
                      <FaRocket className="me-2" />
                      Go for Coding Round
                    </Button>
                  )}
                  <Button variant="outline-primary" size="sm" onClick={() => navigate('/')} className="action-btn-compact">
                    <FaHome className="me-2" />
                    Dashboard
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </Container>
      </div>
    </>
  )
}

export default TechnicalResult
