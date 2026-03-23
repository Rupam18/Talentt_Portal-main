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

// Enhanced chart components with premium animations
const ScoreChart = ({ score, total, label, color }) => {
  const percentage = Math.round((score / total) * 100)
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="chart-item">
      <h6 className="chart-label">{label}</h6>
      <div className="chart-circle">
        <svg viewBox="0 0 80 80" className="circular-chart">
          <circle className="circle-bg" cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
          <circle 
            className="circle" 
            cx="40" cy="40" r={radius} 
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 2s ease-in-out' }}
          />
        </svg>
        <div className="chart-percentage">
          <span>{percentage}%</span>
          <span className="chart-score">{score}/{total}</span>
        </div>
      </div>
    </div>
  )
}

const PerformanceMeter = ({ score, total }) => {
  const percentage = Math.round((score / total) * 100)
  
  return (
    <div className="performance-meter">
      <div className="meter-title">
        <FaChartLine className="performance-icon" /> Technical Proficiency Index
      </div>
      <div className="meter-container">
        <div className="meter-track">
          <div 
            className="meter-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="meter-labels">
          <span className="meter-score">{score} / {total}</span>
          <span className="meter-percentage">{percentage}%</span>
        </div>
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

  // Removed frontend email notification as it's now handled by the backend
  /*
  const sendEmailNotification = async () => {
    ...
  }
  */

  React.useEffect(() => {
    // No longer calling sendEmailNotification() here
  }, [results])

  if (!results) {
    return (
      <div className="result-page">
        <div className="result-header">
          <div className="logo d-flex align-items-center">
            <span className="logo-icon">{'{cv}'}</span>
            <span className="logo-text">CODEVERGE</span>
          </div>
        </div>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="result-card p-5 text-center shadow-lg">
                <Alert variant="warning">Result not available. Please complete the technical test first.</Alert>
                <Button variant="primary" onClick={() => navigate('/technical-test-relaxation')}>Go to Technical Test</Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  const calculateResultData = () => {
    const allSections = Object.values(results.sections || {})
    const totalQuestions = allSections.reduce((sum, section) => sum + (section.total || 0), 0)
    const totalCorrect = allSections.reduce((sum, section) => sum + (section.correct || 0), 0)
    const totalAnswered = allSections.reduce((sum, section) => sum + Object.keys(section.answers || {}).length, 0)
    const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    const passed = percentage >= 50
    const timeTaken = results.timeTaken || 1800
    const timeTakenMinutes = Math.floor(timeTaken / 60)
    const timeTakenSeconds = timeTaken % 60

    const sectionResults = Object.entries(results.sections || {}).map(([key, section]) => ({
      section: section.sectionTitle || key,
      score: section.correct || 0,
      total: section.total || 0,
      percentage: section.percentage || 0
    }))

    if (sectionResults.length === 0 && totalQuestions > 0) {
      sectionResults.push({ section: "Technical Assessment", score: totalCorrect, total: totalQuestions, percentage: percentage })
    }

    return {
      pass: passed, totalScore: totalCorrect, totalQuestions: totalQuestions, totalAnswered: totalAnswered,
      totalTimeTaken: timeTaken, totalTimeMinutes: timeTakenMinutes, totalTimeSeconds: timeTakenSeconds, sectionResults: sectionResults
    }
  }

  const result = calculateResultData()

  const saveTechnicalTestResult = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const candidateEmail = (user.email || results?.email || '').trim().toLowerCase()
      const candidateName = (`${user.firstName || ''} ${user.lastName || ''}`.trim()) || results?.candidateName || 'Unknown'
      const overallPercentage = result.totalQuestions > 0 ? Math.round((result.totalScore / result.totalQuestions) * 100) : 0

      const resultData = {
        candidateEmail, candidateName, totalQuestions: result.totalQuestions, totalCorrect: result.totalScore,
        totalAnswered: result.totalAnswered, percentageScore: overallPercentage, timeTakenSeconds: result.totalTimeTaken,
        passed: overallPercentage >= 50, sectionData: JSON.stringify(results.sections || {})
      }

      await fetch('/api/technical-test-results/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
      })
    } catch (error) { console.error('Error saving technical test result:', error) }
  }

  useEffect(() => {
    if (result && Object.keys(result).length > 0) saveTechnicalTestResult()
  }, [])

  const handleGoForCodingRound = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const codingRoundData = {
      ...user, technicalTestPassed: true, technicalTestScore: result.totalScore,
      technicalTestDate: new Date().toISOString(), eligibleForCodingRound: true
    }
    localStorage.setItem('codingRoundEligibility', JSON.stringify(codingRoundData))
    navigate('/coding-test-relaxation')
  }

  const overallPercentage = result.totalQuestions > 0 ? Math.round((result.totalScore / result.totalQuestions) * 100) : 0

  return (
    <div className="result-page">
      {/* Background Elements */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      <div className="result-card anim-scale-in">
        {/* LOGO */}
        <div className="cv-logo anim-fade-in-down">
          <span className="cv-tag">{"{cv}"}</span>
          <span className="cv-name">CODEVERGE</span>
        </div>

        {/* CELEBRATION ICON */}
        <span className="celebration-icon anim-bounce">🎓</span>

        {/* TITLE */}
        <h1 className="result-title anim-slide-up" style={{ animationDelay: '0.1s' }}>
          {result.pass ? 'CONGRATULATIONS! YOU PASSED THE TECHNICAL TEST!' : 'ASSESSMENT COMPLETE: KEEP GROWING!'}
        </h1>

        <p className="result-subtitle anim-slide-up" style={{ animationDelay: '0.2s' }}>
          {result.pass ? 'You have demonstrated exceptional technical proficiency.' : 'Focus on your growth areas and come back stronger.'}
        </p>

        {/* SCORE ALERT BOX */}
        <div className="score-alert-box anim-slide-up" style={{ animationDelay: '0.3s' }}>
          <FaTrophy className="me-2" /> Overall Proficiency: {overallPercentage}% Match with Requirements
        </div>

        {/* OVERALL PERFORMANCE CIRCLE (Replaces Timer) */}
        <div className="overall-performance-section anim-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="overall-circle-container">
            <svg className="overall-svg" viewBox="0 0 160 160">
              <circle className="overall-bg" cx="80" cy="80" r="70" />
              <circle 
                className="overall-fill" 
                cx="80" cy="80" r="70" 
                style={{ strokeDashoffset: 440 - (440 * overallPercentage) / 100 }}
              />
            </svg>
            <div className="overall-text">
              <h2>{overallPercentage}%</h2>
              <span>VALIDATED</span>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-container anim-slide-up" style={{ animationDelay: '0.5s', width: '100%', maxWidth: '500px' }}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${overallPercentage}%` }}></div>
          </div>
          <p className="progress-text text-center">
            Performance Index: {result.totalScore} Correct out of {result.totalQuestions} Questions
          </p>
        </div>

        {/* COMPETENCY DETAILS (Replaces Tips) */}
        <div className="competency-details anim-slide-up" style={{ animationDelay: '0.6s' }}>
          <p className="details-header">
            <FaChartBar /> Domain Competency Mapping:
          </p>
          <div className="competency-grid">
            {result.sectionResults.map((section, idx) => (
              <div key={idx} className="competency-item">
                <FaLaptopCode className="comp-icon" />
                <div className="comp-info">
                  <label>{section.section}</label>
                  <h4>{section.score} <span>/ {section.total}</span></h4>
                </div>
              </div>
            ))}
            <div className="competency-item">
              <FaClock className="comp-icon" />
              <div className="comp-info">
                <label>ASSESSMENT TIME</label>
                <h4>{result.totalTimeMinutes}:{String(result.totalTimeSeconds).padStart(2, '0')} <span>min</span></h4>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons anim-slide-up" style={{ animationDelay: '0.7s' }}>
          {result.pass ? (
            <button className="btn-premium btn-primary-gradient" onClick={handleGoForCodingRound}>
              <FaRocket /> Advance to Coding Round
            </button>
          ) : (
            <button className="btn-premium btn-primary-gradient" onClick={() => navigate('/')}>
              <FaHome /> Back to Dashboard
            </button>
          )}
          <button className="btn-premium btn-outline-glass" onClick={() => navigate('/')}>
            <FaHome /> Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default TechnicalResult
