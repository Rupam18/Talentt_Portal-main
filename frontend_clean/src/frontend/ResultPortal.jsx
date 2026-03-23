import React, { useEffect } from 'react'
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
  FaCertificate,
  FaMedal,
  FaChartPie,
  FaClipboardCheck,
  FaHourglassHalf,
  FaUser,
  FaStar,
  FaCheck
} from 'react-icons/fa'
import './ResultPortal.css'

// Professional SVG Circular Progress
const ScoreChart = ({ score, total, label, color }) => {
  const percentage = Math.round((score / total) * 100)
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="chart-item shadow-sm">
      <h6 className="chart-label">{label}</h6>
      <svg viewBox="0 0 80 80" className="circular-chart">
        <circle className="circle-bg" cx="40" cy="40" r={radius} />
        <circle 
          className="circle" 
          cx="40" cy="40" r={radius} 
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
        />
        <text x="40" y="41" className="chart-center-text">
          <tspan x="40" dy="0" className="chart-center-percentage">{percentage}%</tspan>
          <tspan x="40" dy="13" className="chart-center-score">{score}/{total}</tspan>
        </text>
      </svg>
      <div className="mt-2">
        <span className="badge rounded-pill fw-bold" style={{ backgroundColor: `${color}15`, color: color, fontSize: '0.7rem' }}>
          {percentage >= 75 ? 'EXCEPTIONAL' : percentage >= 50 ? 'PROFICIENT' : 'LEARNING'}
        </span>
      </div>
    </div>
  )
}

const PerformanceMeter = ({ score, total }) => {
  const percentage = Math.round((score / total) * 100)
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      {/* Left Content */}
      <div className="flex items-center gap-4">
        
        {/* Icon */}
        <div className="bg-orange-50 p-3 rounded-lg">
          <span className="text-orange-500 text-xl">📊</span>
        </div>

        {/* Text */}
        <div>
          <p className="text-sm font-medium text-slate-500 tracking-wide">
            AGGREGATE ASSESSMENT
          </p>
          <p className="text-xs text-slate-400">
            Strength
          </p>

          {/* Animated Percentage */}
          <p className="text-2xl font-semibold text-orange-500 mt-1 animate-fadeIn">
            {percentage}%
          </p>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="w-32">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 animate-progress transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

    </div>
  )
}

function ResultPortal() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const sendNotification = async () => {
      if (!result) return
      try {
        const recipientEmail = (result.email || user.email || '').trim()
        if (!recipientEmail) return

        const emailData = {
          to: recipientEmail,
          subject: result.pass ? 'Assessment Results: Qualified for Round 2' : 'Assessment Results: Update',
          message: result.pass 
            ? `Dear ${user.firstName}, You have successfully met the qualification criteria for the Technical Round.`
            : `Dear ${user.firstName}, Thank you for your interest. We encourage further preparation for future opportunities.`
        }
        await fetch('/api/send-result-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        })
      } catch (error) { console.error(error) }
    }
    sendNotification()
  }, [result, user.email, user.firstName])

  if (!result) {
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
              <Col lg={12} xl={11}>
                <Card className="result-card p-5 text-center shadow-lg" style={{ maxWidth: '500px', border: 'none' }}>
                  <FaTimesCircle className="text-danger mb-4" size={64} />
                  <h2 className="fw-bold mb-3">No Results Found</h2>
                  <p className="text-muted mb-4 px-4">It seems you haven't completed the assessment or your session has expired.</p>
                  <Button variant="primary" size="lg" onClick={() => navigate('/test-instructions')} className="action-btn-compact w-100">
                    Start Assessment
                  </Button>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    )
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
            <Col lg={12} xl={11}>
              <Card className="result-card">
                <Card.Body className="p-4 p-md-5">
                {/* Title + Status */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Aptitude Performance Analytics
                  </h2>

                  <span className={`bg-${result.pass ? 'green' : 'red'}-500 text-white text-xs px-3 py-1 rounded-lg`}>
                    {result.pass ? 'REQUIREMENT MET' : 'REQUIREMENT NOT MET'}
                  </span>
                </div>

                {/* Candidate */}
                <p className="text-sm text-slate-500 mb-6">
                  Candidate: <span className="font-medium text-slate-700">{user.firstName || 'User'} {user.lastName || ''}</span>
                </p>

                <div className={`result-message ${result.pass ? 'success-message' : 'failure-message'} mb-5 shadow-sm`}>
                  <h2 className="message-title">
                    {result.pass ? 'Excellent Competency Demonstrated' : 'Structured Improvement Recommended'}
                  </h2>
                  <p className="message-text">
                    {result.pass 
                      ? "Your assessment results indicate a high level of analytical reasoning and numerical proficiency. You have been advanced in the selection process."
                      : "The current assessment reveals areas that require structured learning. We encourage you to focus on fundamental reasoning concepts for future attempts."
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* AGGREGATE ASSESSMENT STRENGTH */}
                  <PerformanceMeter score={result.totalScore} total={result.totalQuestions} />
                  
                  {/* POINT ACCUMULATION */}
                  <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between">
                    {/* Left Content */}
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <FaTrophy className="text-yellow-500 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 tracking-wide">
                          POINT ACCUMULATION
                        </p>
                        <p className="text-2xl font-semibold text-blue-600">
                          {result.totalScore} / {result.totalQuestions}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <h5 className="mb-4 fw-bold text-navy d-flex align-items-center">
                    <span className="bg-navy p-1 rounded me-2"><FaChartBar className="text-white small" /></span>
                    Detailed Competency Breakdown
                  </h5>
                  <div className="charts-grid">
                    {result.sectionResults.map((section) => (
                      <ScoreChart 
                        key={section.section}
                        score={section.score}
                        total={section.total}
                        label={section.section}
                        color={section.score >= (section.total * 0.75) ? '#10b981' : section.score >= (section.total * 0.5) ? '#091e3e' : '#F4780A'}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* TEST ENGAGEMENT */}
                  <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
                    {/* Icon */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <FaClipboardCheck className="text-blue-600 text-xl" />
                    </div>
                    {/* Text Content */}
                    <div>
                      <p className="text-sm font-medium text-slate-500 tracking-wide">
                        TEST ENGAGEMENT
                      </p>
                      <p className="text-2xl font-semibold text-blue-600">
                        {result.totalAnswered} / {result.totalQuestions}
                      </p>
                    </div>
                  </div>

                  {/* TOTAL EFFICIENCY */}
                  <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
                    {/* Icon */}
                    <div className="bg-green-50 p-3 rounded-lg">
                      <FaHourglassHalf className="text-green-600 text-xl" />
                    </div>
                    {/* Text Content */}
                    <div>
                      <p className="text-sm font-medium text-slate-500 tracking-wide">
                        TOTAL EFFICIENCY
                      </p>
                      <p className="text-2xl font-semibold text-blue-600">
                        {result.totalTimeMinutes || Math.floor((result.totalTimeTaken || 0) / 60)}m {String(result.totalTimeSeconds || ((result.totalTimeTaken || 0) % 60)).padStart(2, '0')}s
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 flex-wrap justify-content-center pt-5 border-top">
                  <Button variant="outline-light" onClick={() => navigate('/')} className="action-btn-compact">
                    <FaHome className="me-2" /> End Session
                  </Button>
                  <Button variant="primary" onClick={() => navigate('/test-instructions')} className="action-btn-compact shadow-sm">
                    <FaBook className="me-2" /> View Guidelines
                  </Button>
                  {result.pass && (
                    <Button variant="success" onClick={() => navigate('/technical-test-relaxation')} className="action-btn-compact shadow-sm">
                      <FaRocket className="me-2" /> Start Technical Round
                    </Button>
                  )}
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


export default ResultPortal
