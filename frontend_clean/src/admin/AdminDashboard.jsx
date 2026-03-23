import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Nav, Tab, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FiUsers, FiFileText, FiCamera, FiSettings, FiBarChart2, FiLogOut, FiRefreshCw, FiEye } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import StudentRegistration from './StudentRegistration'
import StudentDetailsModal from './StudentDetailsModal'
import AdminResult from './AdminResult'
import AdminTechnicalResult from './AdminTechnicalResult'
import AdminAptitudeQuestions from './AdminAptitudeQuestions'
import AdminTechnicalQuestions from './AdminTechnicalQuestions'
import '../frontend/App.css'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const parseResponseData = (responseText) => {
    if (!responseText) return {}
    try {
      return JSON.parse(responseText)
    } catch {
      return {}
    }
  }

  const normalizeStudentRecord = (student) => {
    if (!student || typeof student !== 'object') return null

    return {
      ...student,
      id: student.id ?? student.studentId ?? student.student_id ?? null,
      firstName: student.firstName ?? student.first_name ?? '',
      lastName: student.lastName ?? student.last_name ?? '',
      email: student.email ?? student.mail ?? ''
    }
  }

  const normalizeStudentsResponse = (payload) => {
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.students)
        ? payload.students
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.content)
            ? payload.content
            : []

    return list.map(normalizeStudentRecord).filter(Boolean)
  }

  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTests: 0,
    totalSnapshots: 0,
    activeTests: 0
  })
  const [users, setUsers] = useState([])
  const [students, setStudents] = useState([])
  const [snapshots, setSnapshots] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Mock data for graphs
  const [testResultsData] = useState([
    { month: 'Jan', passed: 45, failed: 12 },
    { month: 'Feb', passed: 52, failed: 18 },
    { month: 'Mar', passed: 38, failed: 8 },
    { month: 'Apr', passed: 65, failed: 22 },
    { month: 'May', passed: 48, failed: 15 },
    { month: 'Jun', passed: 72, failed: 25 }
  ])

  const [userGrowthData] = useState([
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 145 },
    { month: 'Mar', users: 168 },
    { month: 'Apr', users: 195 },
    { month: 'May', users: 220 },
    { month: 'Jun', users: 256 }
  ])

  const [testDistributionData] = useState([
    { name: 'Aptitude', value: 45, color: '#F4780A' },
    { name: 'Technical', value: 30, color: '#28a745' },
    { name: 'Reasoning', value: 25, color: '#17a2b8' }
  ])

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardStats()
    fetchUsers()
    fetchSnapshots()
    fetchStudents()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalUsers: 256,
        totalTests: 342,
        totalSnapshots: 1250,
        activeTests: 8
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      // Mock data - replace with actual API calls
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', testsTaken: 3, lastActive: '2024-03-05' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', testsTaken: 5, lastActive: '2024-03-04' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', testsTaken: 2, lastActive: '2024-03-03' }
      ])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchSnapshots = async () => {
    try {
      // Mock data - replace with actual API calls
      setSnapshots([
        { id: 1, candidateName: 'John Doe', candidateEmail: 'john@example.com', captureTime: '2024-03-05 10:30:00', testResult: 'PASS', testType: 'aptitude' },
        { id: 2, candidateName: 'Jane Smith', candidateEmail: 'jane@example.com', captureTime: '2024-03-05 10:15:00', testResult: 'FAIL', testType: 'technical' },
        { id: 3, candidateName: 'Bob Johnson', candidateEmail: 'bob@example.com', captureTime: '2024-03-05 10:00:00', testResult: 'PASS', testType: 'coding' },
        { id: 4, candidateName: 'Alice Brown', candidateEmail: 'alice@example.com', captureTime: '2024-03-05 09:45:00', testResult: 'PASS', testType: 'aptitude' },
        { id: 5, candidateName: 'Charlie Wilson', candidateEmail: 'charlie@example.com', captureTime: '2024-03-05 09:30:00', testResult: 'FAIL', testType: 'technical' }
      ])
    } catch (error) {
      console.error('Error fetching snapshots:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/students')
      if (response.ok) {
        const responseText = await response.text()
        const data = parseResponseData(responseText)
        setStudents(normalizeStudentsResponse(data))
      } else {
        console.error('Failed to fetch students')
        // Show error message
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      // Show error message
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Handle logout logic
    localStorage.removeItem('adminToken')
    window.location.href = '/admin/login'
  }

  const handleOpenCodingQuestions = () => {
    navigate('/admin/coding-questions')
  }

  const handleSaveStudent = async (studentData) => {
    try {
      setLoading(true)
      const isEditMode = Boolean(editingStudent?.id)
      const endpoint = isEditMode ? `/api/students/${editingStudent.id}` : '/api/students/register'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      })

      const responseText = await response.text()
      const data = parseResponseData(responseText)
      const savedStudent = normalizeStudentRecord(data.student || data)
      if (response.ok) {
        if (savedStudent) {
          if (isEditMode) {
            setStudents(prev => prev.map(student => (
              student.id === savedStudent.id ? savedStudent : student
            )))
            if (selectedStudent?.id === savedStudent.id) {
              setSelectedStudent(savedStudent)
            }
          } else {
            setStudents(prev => [savedStudent, ...prev])
          }
        }

        await fetchStudents()
        setEditingStudent(null)
        setShowAddForm(false)
      } else {
        alert(data.message || (isEditMode ? 'Failed to update student' : 'Failed to register student'))
      }
    } catch (error) {
      console.error('Error saving student:', error)
      alert('Error saving student')
    } finally {
      setLoading(false)
    }
  }

  const handleViewStudent = (student) => {
    setSelectedStudent(student)
    setShowDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedStudent(null)
  }

  const handleStartAddStudent = () => {
    setEditingStudent(null)
    setShowAddForm(true)
  }

  const handleEditStudent = (student) => {
    setActiveTab('aptitude-register')
    setShowDetailsModal(false)
    setSelectedStudent(null)
    setEditingStudent(student)
    setShowAddForm(true)
  }

  const handleDeleteStudent = async (student) => {
    if (!student?.id) return

    const isConfirmed = window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)
    if (!isConfirmed) return

    try {
      setLoading(true)
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'DELETE'
      })
      const responseText = await response.text()
      const data = parseResponseData(responseText)

      if (response.ok) {
        await fetchStudents()
        setShowDetailsModal(false)
        setSelectedStudent(null)
      } else {
        alert(data.message || 'Failed to delete student')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Error deleting student')
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async (student) => {
    if (!student?.id) {
      alert('Invalid student record')
      return
    }

    // Immediate click feedback to confirm handler is triggered
    if (!window.confirm(`Are you sure you want to send email to ${student.firstName} ${student.lastName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/students/${student.id}/send-invitation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const responseText = await response.text()
      const data = parseResponseData(responseText)

      if (response.ok) {
        alert('Mail sent successfully')
      } else {
        alert(data.message || 'Failed to send invitation email')
      }
    } catch (error) {
      console.error('Error sending invitation email:', error)
      alert('Error sending invitation email')
    }
  }

  return (
    <div className="admin-dashboard-wrapper">
      <Container fluid className="admin-dashboard-container">
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            </div>
          </Col>
        </Row>

        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Row>
            <Col md={3}>
              <Nav variant="pills" className="flex-column admin-nav">
                <Nav.Item>
                  <Nav.Link eventKey="overview">
                    <FiBarChart2 className="me-2" />
                    Overview
                  </Nav.Link>
                </Nav.Item>
                
                {/* Aptitude Test Section */}
                <Nav.Item>
                  <Nav.Link eventKey="aptitude-register">
                    <FiUsers className="me-2" />
                    Register Student
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="aptitude-questions">
                    <FiFileText className="me-2" />
                    Aptitude Questions
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="aptitude-results">
                    <FiBarChart2 className="me-2" />
                    Aptitude Test Results
                  </Nav.Link>
                </Nav.Item>
                
                {/* Technical MCQ Section */}
                <Nav.Item>
                  <Nav.Link eventKey="technical-questions">
                    <FiFileText className="me-2" />
                    Technical MCQ
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="technical-results">
                    <FiBarChart2 className="me-2" />
                    Technical Results
                  </Nav.Link>
                </Nav.Item>
                
                {/* Coding Section */}
                <Nav.Item>
                  <Nav.Link
                    eventKey="coding-questions"
                    onClick={(e) => {
                      e.preventDefault()
                      handleOpenCodingQuestions()
                    }}
                  >
                    <FiFileText className="me-2" />
                    Coding Questions
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="coding-results">
                    <FiBarChart2 className="me-2" />
                    Coding Results
                  </Nav.Link>
                </Nav.Item>
                
                <Nav.Item>
                  <Nav.Link eventKey="settings">
                    <FiSettings className="me-2" />
                    Settings
                  </Nav.Link>
                </Nav.Item>
                
                <div className="mt-3 pt-3 border-top border-secondary">
                  <Nav.Item>
                    <Button variant="outline-danger" className="w-100" onClick={handleLogout}>
                      <FiLogOut className="me-2" />
                      Logout
                    </Button>
                  </Nav.Item>
                </div>
              </Nav>
            </Col>
            <Col md={9}>
              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <Row>
                    <Col md={3} className="mb-4">
                      <Card className="admin-stat-card text-center">
                        <Card.Body>
                          <FiUsers size={40} className="text-primary mb-2" />
                          <h3>{stats.totalUsers}</h3>
                          <p className="text-muted">Total Users</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                      <Card className="admin-stat-card text-center">
                        <Card.Body>
                          <FiFileText size={40} className="text-success mb-2" />
                          <h3>{stats.totalTests}</h3>
                          <p className="text-muted">Total Tests</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                      <Card className="admin-stat-card text-center">
                        <Card.Body>
                          <FiCamera size={40} className="text-warning mb-2" />
                          <h3>{stats.totalSnapshots}</h3>
                          <p className="text-muted">Total Snapshots</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                      <Card className="admin-stat-card text-center">
                        <Card.Body>
                          <FiBarChart2 size={40} className="text-info mb-2" />
                          <h3>{stats.activeTests}</h3>
                          <p className="text-muted">Active Tests</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Graphs Section */}
                  <Row className="mt-4">
                    <Col md={8} className="mb-4">
                      <Card className="admin-content-card">
                        <Card.Header>
                          <h5 className="mb-0">Test Results Trend</h5>
                        </Card.Header>
                        <Card.Body>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={testResultsData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="month" stroke="#e2e8f0" />
                              <YAxis stroke="#e2e8f0" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(0,0,0,0.8)', 
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  borderRadius: '8px'
                                }} 
                              />
                              <Legend />
                              <Bar dataKey="passed" fill="#28a745" name="Passed" />
                              <Bar dataKey="failed" fill="#dc3545" name="Failed" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Card className="admin-content-card">
                        <Card.Header>
                          <h5 className="mb-0">Test Distribution</h5>
                        </Card.Header>
                        <Card.Body>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={testDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {testDistributionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Card className="admin-content-card">
                        <Card.Header>
                          <h5 className="mb-0">User Growth</h5>
                        </Card.Header>
                        <Card.Body>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={userGrowthData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="month" stroke="#e2e8f0" />
                              <YAxis stroke="#e2e8f0" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(0,0,0,0.8)', 
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  borderRadius: '8px'
                                }} 
                              />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="users" 
                                stroke="#F4780A" 
                                strokeWidth={3}
                                dot={{ fill: '#F4780A', r: 6 }}
                                activeDot={{ r: 8 }}
                                name="Total Users"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="users">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">User Management</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Tests Taken</th>
                            <th>Last Active</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id}>
                              <td>{user.id}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.testsTaken}</td>
                              <td>{user.lastActive}</td>
                              <td>
                                <Button variant="primary" size="sm" className="me-2">View</Button>
                                <Button variant="danger" size="sm">Delete</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Aptitude Test Sections */}
                <Tab.Pane eventKey="aptitude-register">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">All Registered Students</h5>
                    </Card.Header>
                    <Card.Body>
                      {showAddForm ? (
                        editingStudent ? (
                          <StudentRegistration
                            key={`edit-${editingStudent.id}`}
                            onSubmit={handleSaveStudent}
                            initialData={editingStudent}
                            title="Edit Student"
                            submitLabel="Update Student"
                            onCancel={() => {
                              setShowAddForm(false)
                              setEditingStudent(null)
                            }}
                            loading={loading}
                          />
                        ) : (
                          <StudentRegistration
                            onStudentAdded={handleSaveStudent}
                            onCancel={() => setShowAddForm(false)}
                            loading={loading}
                          />
                        )
                      ) : (
                        <>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6>Total Students: {students.length}</h6>
                            <div>
                              <Button variant="outline-secondary" className="me-2" onClick={fetchStudents} disabled={loading}>
                                <FiRefreshCw className={`me-1 ${loading ? 'spin' : ''}`} />
                                Refresh
                              </Button>
                              <Button variant="primary" className="me-2" onClick={handleStartAddStudent}>
                                Add New Student
                              </Button>
                            </div>
                          </div>
                          
                          {students.length === 0 ? (
                            <div className="text-center py-5">
                              <p className="text-muted">No students found in the database.</p>
                              <Button variant="primary" onClick={handleStartAddStudent}>Register First Student</Button>
                            </div>
                          ) : (
                            <Table striped bordered hover responsive className="student-table">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Name</th>
                                  <th>Email</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.map(student => (
                                  <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.firstName} {student.lastName}</td>
                                    <td>{student.email}</td>
                                    <td>
                                      <div className="student-actions">
                                      <Button 
                                        variant="primary" 
                                        size="sm" 
                                        className="eye-button student-action-btn"
                                        onClick={() => handleViewStudent(student)}
                                        title="View Student Details"
                                      >
                                        <FiEye />
                                      </Button>
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="student-action-btn"
                                        onClick={() => handleEditStudent(student)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="student-action-btn"
                                        onClick={() => handleDeleteStudent(student)}
                                      >
                                        Delete
                                      </Button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm student-action-btn send-email-button"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          handleSendEmail(student)
                                        }}
                                      >
                                        Send Email
                                      </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          )}
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="aptitude-results">
                  <AdminResult />
                </Tab.Pane>

                <Tab.Pane eventKey="aptitude-questions">
                  <AdminAptitudeQuestions />
                </Tab.Pane>

                {/* Technical MCQ Section */}
                <Tab.Pane eventKey="technical-questions">
                  <AdminTechnicalQuestions />
                </Tab.Pane>

                <Tab.Pane eventKey="technical-results">
                  <AdminTechnicalResult />
                </Tab.Pane>

                <Tab.Pane eventKey="technical-snapshots">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">Technical MCQ Test Snapshots</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Capture Time</th>
                            <th>Test Result</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snapshots.filter(s => s.testType === 'technical').map(snapshot => (
                            <tr key={snapshot.id}>
                              <td>{snapshot.id}</td>
                              <td>{snapshot.candidateName}</td>
                              <td>{snapshot.candidateEmail}</td>
                              <td>{snapshot.captureTime}</td>
                              <td>
                                <span className={`badge ${snapshot.testResult === 'PASS' ? 'bg-success' : 'bg-danger'}`}>
                                  {snapshot.testResult}
                                </span>
                              </td>
                              <td>
                                <Button variant="primary" size="sm" className="me-2">View</Button>
                                <Button variant="danger" size="sm">Delete</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Coding Sections */}
                <Tab.Pane eventKey="coding-questions">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">Coding Questions Management</h5>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted mb-3">
                        Coding questions are managed on a dedicated page.
                      </p>
                      <Button variant="primary" onClick={handleOpenCodingQuestions}>
                        Open Coding Questions
                      </Button>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="coding-results">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">Coding Test Results</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Test Date</th>
                            <th>Score</th>
                            <th>Result</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Bob Johnson</td>
                            <td>bob@example.com</td>
                            <td>2024-03-03</td>
                            <td>92/100</td>
                            <td><span className="badge bg-success">PASS</span></td>
                            <td>
                              <Button variant="primary" size="sm" className="me-2">View Code</Button>
                              <Button variant="secondary" size="sm">Download</Button>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="coding-snapshots">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">Coding Test Snapshots</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Capture Time</th>
                            <th>Test Result</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snapshots.filter(s => s.testType === 'coding').map(snapshot => (
                            <tr key={snapshot.id}>
                              <td>{snapshot.id}</td>
                              <td>{snapshot.candidateName}</td>
                              <td>{snapshot.candidateEmail}</td>
                              <td>{snapshot.captureTime}</td>
                              <td>
                                <span className={`badge ${snapshot.testResult === 'PASS' ? 'bg-success' : 'bg-danger'}`}>
                                  {snapshot.testResult}
                                </span>
                              </td>
                              <td>
                                <Button variant="primary" size="sm" className="me-2">View</Button>
                                <Button variant="danger" size="sm">Delete</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="settings">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">Admin Settings</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>Settings configuration coming soon...</p>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <StudentDetailsModal
        student={selectedStudent}
        show={showDetailsModal}
        onHide={handleCloseDetailsModal}
      />
    </div>
  )
}

export default AdminDashboard
