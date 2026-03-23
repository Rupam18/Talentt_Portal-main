import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Spinner, Form, Modal } from 'react-bootstrap'
import { FiBarChart2, FiRefreshCw, FiEye, FiFilter, FiSearch, FiTrash2 } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import './AdminResult.css'

function AdminResult() {
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [resultFilter, setResultFilter] = useState('all')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [stats, setStats] = useState({
    totalResults: 0,
    passedCount: 0,
    failedCount: 0,
    averageScore: 0
  })

  // Colors for charts
  const COLORS = ['#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1']

  useEffect(() => {
    fetchResults()
  }, [])

  useEffect(() => {
    filterResults()
  }, [results, searchTerm, resultFilter])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8081/api/candidate-results/all')
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
        calculateStats(data.results || [])
      } else {
        console.error('Failed to fetch results')
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (resultsData) => {
    const total = resultsData.length
    const passed = resultsData.filter(r => r.finalResult === 'PASS').length
    const failed = resultsData.filter(r => r.finalResult === 'FAIL').length
    const avgScore = total > 0 
      ? Math.round(resultsData.reduce((sum, r) => sum + (r.totalMarks || 0), 0) / total)
      : 0

    setStats({
      totalResults: total,
      passedCount: passed,
      failedCount: failed,
      averageScore: avgScore
    })
  }

  const filterResults = () => {
    let filtered = [...results]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by result type
    if (resultFilter !== 'all') {
      filtered = filtered.filter(result => result.finalResult === resultFilter.toUpperCase())
    }

    setFilteredResults(filtered)
  }

  const handleViewDetails = (result) => {
    setSelectedResult(result)
    setShowDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedResult(null)
  }

  const handleDeleteResult = async (result) => {
    const resultId = result?.id
    if (!resultId) {
      alert('Unable to delete: missing result id.')
      return
    }

    const confirmed = window.confirm(`Delete aptitude result for ${result.studentName || 'this student'}?`)
    if (!confirmed) return

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8081/api/candidate-results/${resultId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to delete result')
      }

      await fetchResults()
    } catch (error) {
      console.error('Error deleting result:', error)
      alert(error.message || 'Failed to delete result')
    } finally {
      setLoading(false)
    }
  }

  // Prepare data for charts
  const resultDistributionData = [
    { name: 'Passed', value: stats.passedCount, color: '#28a745' },
    { name: 'Failed', value: stats.failedCount, color: '#dc3545' }
  ]

  const scoreRangeData = [
    { range: '0-20', count: results.filter(r => r.totalMarks >= 0 && r.totalMarks <= 20).length },
    { range: '21-40', count: results.filter(r => r.totalMarks >= 21 && r.totalMarks <= 40).length },
    { range: '41-60', count: results.filter(r => r.totalMarks >= 41 && r.totalMarks <= 60).length },
    { range: '61-80', count: results.filter(r => r.totalMarks >= 61 && r.totalMarks <= 80).length },
    { range: '81-100', count: results.filter(r => r.totalMarks >= 81 && r.totalMarks <= 100).length }
  ]

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  const formatTime = (minutes, seconds) => {
    if (!minutes && !seconds) return 'N/A'
    return `${minutes || 0}m ${seconds || 0}s`
  }

  return (
    <Card className="admin-content-card">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Aptitude Test Results</h5>
          <div className="admin-result-controls">
            <Button variant="outline-secondary" className="me-2" onClick={fetchResults} disabled={loading}>
              <FiRefreshCw className={`me-1 ${loading ? 'spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Container fluid className="p-0">

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="admin-stat-card text-center">
              <Card.Body>
                <FiBarChart2 size={40} className="text-primary mb-2" />
                <h3>{stats.totalResults}</h3>
                <p className="text-muted">Total Results</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="admin-stat-card text-center">
              <Card.Body>
                <div className="text-success mb-2" style={{ fontSize: '40px' }}>✓</div>
                <h3>{stats.passedCount}</h3>
                <p className="text-muted">Passed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="admin-stat-card text-center">
              <Card.Body>
                <div className="text-danger mb-2" style={{ fontSize: '40px' }}>✗</div>
                <h3>{stats.failedCount}</h3>
                <p className="text-muted">Failed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="admin-stat-card text-center">
              <Card.Body>
                <div className="text-info mb-2" style={{ fontSize: '40px' }}>Ø</div>
                <h3>{stats.averageScore}</h3>
                <p className="text-muted">Average Score</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="mb-4">
          <Col md={6} className="mb-3">
            <Card className="admin-content-card">
              <Card.Header>
                <h5 className="mb-0">Result Distribution</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={resultDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resultDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="admin-content-card">
              <Card.Header>
                <h5 className="mb-0">Score Range Distribution</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={scoreRangeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="range" stroke="#e2e8f0" />
                    <YAxis stroke="#e2e8f0" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="count" fill="#F4780A" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters Section */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="admin-content-card">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={4}>
                    <Form.Group className="mb-0">
                      <Form.Label className="d-flex align-items-center">
                        <FiSearch className="me-2" />
                        Search
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-0">
                      <Form.Label className="d-flex align-items-center">
                        <FiFilter className="me-2" />
                        Filter by Result
                      </Form.Label>
                      <Form.Select
                        value={resultFilter}
                        onChange={(e) => setResultFilter(e.target.value)}
                      >
                        <option value="all">All Results</option>
                        <option value="pass">Passed Only</option>
                        <option value="fail">Failed Only</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mt-4">
                      Showing {filteredResults.length} of {results.length} results
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Results Table */}
        <Row>
          <Col md={12}>
            <Card className="admin-content-card">
              <Card.Header>
                <h5 className="mb-0">Test Results</h5>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">
                      {results.length === 0 ? 'No results found in the database.' : 'No results match your filters.'}
                    </p>
                  </div>
                ) : (
                  <Table striped bordered hover responsive className="results-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Total</th>
                        <th>Result</th>
                        <th>Test Date</th>
                        <th>Time Taken</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((result, index) => (
                        <tr key={result.id || index}>
                          <td>{result.studentName || 'N/A'}</td>
                          <td>{result.email || 'N/A'}</td>
                          <td className="text-center fw-bold">{result.totalMarks || 0}</td>
                          <td className="text-center">
                            <span className={`badge ${result.finalResult === 'PASS' ? 'bg-success' : 'bg-danger'}`}>
                              {result.finalResult || 'N/A'}
                            </span>
                          </td>
                          <td>{formatDate(result.testDate)}</td>
                          <td className="text-center">{formatTime(result.timeTakenMinutes, result.timeTakenSeconds)}</td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleViewDetails(result)}
                                title="View Details"
                                className="action-btn view-btn"
                              >
                                <FiEye />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteResult(result)}
                                title="Delete Result"
                                disabled={loading}
                                className="action-btn delete-btn"
                              >
                                <FiTrash2 />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Details Modal */}
        <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Test Result Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedResult && (
              <Row>
                <Col md={6}>
                  <h5>Student Information</h5>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td><strong>Name:</strong></td>
                        <td>{selectedResult.studentName || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{selectedResult.email || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Test Date:</strong></td>
                        <td>{formatDate(selectedResult.testDate)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h5>Score Breakdown</h5>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td><strong>Numerical Score:</strong></td>
                        <td>{selectedResult.numericalScore || 0}</td>
                      </tr>
                      <tr>
                        <td><strong>Reasoning Score:</strong></td>
                        <td>{selectedResult.reasoningScore || 0}</td>
                      </tr>
                      <tr>
                        <td><strong>Verbal Score:</strong></td>
                        <td>{selectedResult.verbalScore || 0}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Marks:</strong></td>
                        <td className="fw-bold">{selectedResult.totalMarks || 0}</td>
                      </tr>
                      <tr>
                        <td><strong>Final Result:</strong></td>
                        <td>
                          <span className={`badge ${selectedResult.finalResult === 'PASS' ? 'bg-success' : 'bg-danger'}`}>
                            {selectedResult.finalResult || 'N/A'}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Time Taken:</strong></td>
                        <td>{formatTime(selectedResult.timeTakenMinutes, selectedResult.timeTakenSeconds)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetailsModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      </Card.Body>
    </Card>
  )
}

export default AdminResult
