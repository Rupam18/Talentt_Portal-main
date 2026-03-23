import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaKey, FaArrowLeft } from 'react-icons/fa'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // 'email' | 'otp' | 'success'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        setSuccess('OTP has been sent to your email address')
        setStep('otp')
      } else {
        setError(data.message || 'Failed to send OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        setSuccess('Login successful! Redirecting...')
        setStep('success')
        // Store user info in localStorage or context
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect to dashboard or welcome page after 2 seconds
        setTimeout(() => {
          navigate('/test-instructions')
        }, 2000)
      } else {
        setError(data.message || 'Invalid OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setOtp('')
    setError('')
    setSuccess('')
  }

  return (
    <div className="login-wrapper">
      <Container className="login-container">
        <Row className="justify-content-center w-100">
          <Col md={6} lg={5}>
            <Card className="login-card shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="login-logo mb-3">
                    <img 
                      src="/codeverge.svg" 
                      alt="Codeverge Logo" 
                      className="logo-image"
                    />
                  </div>
                  <h2 className="login-title">
                    {step === 'email' && 'Sign In to Your Account'}
                    {step === 'otp' && 'Enter OTP'}
                    {step === 'success' && 'Login Successful!'}
                  </h2>
                  <p className="login-subtitle">
                    {step === 'email' && 'Enter your email to receive OTP'}
                    {step === 'otp' && `Check your email: ${email}`}
                    {step === 'success' && 'Welcome back to Codeverge Talent Portal'}
                  </p>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                {success && <Alert variant="success" className="mb-3">{success}</Alert>}

                {step === 'email' && (
                  <Form onSubmit={handleSendOTP}>
                    <Form.Group className="mb-4">
                      <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <Form.Control
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="form-input"
                        />
                      </div>
                    </Form.Group>

                    <Button
                      type="submit"
                      className="btn-login w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" />
                          <span className="ms-2">Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <FaKey className="me-2" />
                          Send OTP
                        </>
                      )}
                    </Button>
                  </Form>
                )}

                {step === 'otp' && (
                  <Form onSubmit={handleVerifyOTP}>
                    <Form.Group className="mb-4">
                      <div className="input-wrapper">
                        <FaKey className="input-icon" />
                        <Form.Control
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          required
                          className="form-input"
                        />
                      </div>
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        className="btn-back"
                        onClick={handleBack}
                        disabled={loading}
                      >
                        <FaArrowLeft className="me-2" />
                        Back
                      </Button>
                      
                      <Button
                        type="submit"
                        className="btn-verify flex-grow-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" />
                            <span className="ms-2">Verifying...</span>
                          </>
                        ) : (
                          <>
                            <FaKey className="me-2" />
                            Verify OTP
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                )}

                {step === 'success' && (
                  <div className="text-center">
                    <div className="success-icon mb-3">
                      <FaKey className="icon-success" />
                    </div>
                    <p className="success-message">
                      You have successfully logged in!
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
