import React, { useState, useEffect } from 'react';

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' or 'aptitude'

  // Fetch questions from API
  const fetchQuestions = async (type = 'all') => {
    setLoading(true);
    setError(null);
    
    try {
      const url = type === 'aptitude' 
        ? 'http://localhost:8081/api/questions/aptitude'
        : 'http://localhost:8081/api/questions';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setQuestions(data);
      console.log(`Fetched ${data.length} questions (${type})`);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions on component mount and when filter changes
  useEffect(() => {
    fetchQuestions(filter);
  }, [filter]);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="question-manager">
      <div className="question-header">
        <h2>Question Management</h2>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Questions
          </button>
          <button 
            className={`filter-btn ${filter === 'aptitude' ? 'active' : ''}`}
            onClick={() => handleFilterChange('aptitude')}
          >
            Aptitude Questions
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <p>Loading questions...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={() => fetchQuestions(filter)}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="questions-container">
          <div className="questions-summary">
            <p>Total Questions: {questions.length}</p>
            <p>Filter: {filter === 'all' ? 'All Types' : 'Aptitude Only'}</p>
          </div>

          {questions.length === 0 ? (
            <div className="no-questions">
              <p>No questions found.</p>
            </div>
          ) : (
            <div className="questions-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Question</th>
                    <th>Option A</th>
                    <th>Option B</th>
                    <th>Option C</th>
                    <th>Option D</th>
                    <th>Correct Answer</th>
                    <th>Difficulty</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question.id}>
                      <td>{question.id}</td>
                      <td>
                        <span className={`type-badge ${question.type}`}>
                          {question.type}
                        </span>
                      </td>
                      <td className="question-text">{question.question}</td>
                      <td>{question.optionA}</td>
                      <td>{question.optionB}</td>
                      <td>{question.optionC}</td>
                      <td>{question.optionD}</td>
                      <td>
                        <span className="correct-answer">
                          {question.correctAnswer}
                        </span>
                      </td>
                      <td>
                        <span className={`difficulty-badge ${question.difficulty}`}>
                          {question.difficulty}
                        </span>
                      </td>
                      <td>{formatDate(question.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .question-manager {
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .question-header h2 {
          margin: 0;
          color: #333;
        }

        .filter-buttons {
          display: flex;
          gap: 10px;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: #f5f5f5;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          background: #e0e0e0;
        }

        .filter-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .loading, .error, .no-questions {
          text-align: center;
          padding: 40px;
          font-size: 16px;
        }

        .error {
          color: #dc3545;
        }

        .error button {
          margin-top: 10px;
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .questions-summary {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 4px;
          display: flex;
          gap: 20px;
        }

        .questions-table {
          overflow-x: auto;
        }

        .questions-table table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .questions-table th,
        .questions-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .questions-table th {
          background: #f8f9fa;
          font-weight: bold;
          color: #495057;
        }

        .questions-table tr:hover {
          background: #f8f9fa;
        }

        .question-text {
          max-width: 300px;
          word-wrap: break-word;
        }

        .type-badge, .difficulty-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .type-badge.aptitude {
          background: #d4edda;
          color: #155724;
        }

        .type-badge.technical {
          background: #d1ecf1;
          color: #0c5460;
        }

        .difficulty-badge.easy {
          background: #d4edda;
          color: #155724;
        }

        .difficulty-badge.medium {
          background: #fff3cd;
          color: #856404;
        }

        .difficulty-badge.hard {
          background: #f8d7da;
          color: #721c24;
        }

        .correct-answer {
          font-weight: bold;
          color: #28a745;
        }

        @media (max-width: 768px) {
          .question-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .questions-summary {
            flex-direction: column;
            gap: 5px;
          }

          .questions-table {
            font-size: 14px;
          }

          .questions-table th,
          .questions-table td {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuestionManager;
