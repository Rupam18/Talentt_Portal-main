import React from 'react'
import { FaBan } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import './AutoSubmitModal.css'

/**
 * AutoSubmitModal — Premium Automated Submission Modal
 * 
 * Displayed when the test is automatically submitted due to 
 * proctoring violations or time expiration.
 * 
 * @param {boolean} props.show - Whether to show the modal
 * @param {Function} props.onClose - Callback when user clicks redirect button
 */
const AutoSubmitModal = ({ show, onClose }) => {
  if (!show) return null

  return (
    <div className="autosubmit-overlay" role="dialog" aria-modal="true" aria-labelledby="autosubmit-title">
      <div className="autosubmit-card">
        
        {/* Header */}
        <div className="autosubmit-header">
          <p className="autosubmit-header-text">
            <FaBan /> Test Submitted
          </p>
        </div>

        {/* Body */}
        <div className="autosubmit-body">
          <h2 id="autosubmit-title" className="autosubmit-title pulse-text">
            Suspicious Activity Detected
          </h2>

          <p className="autosubmit-desc">
            Your test has been automatically submitted due to multiple proctoring violations. 
            Integrity is a core pillar of our assessment process.
          </p>

          <div className="autosubmit-status-box">
            <p className="autosubmit-status-main">Session Terminated</p>
            <p className="autosubmit-status-sub">
              Please follow the examination guidelines in all future attempts.
            </p>
          </div>

          <button
            onClick={onClose}
            className="autosubmit-btn"
          >
            Go to Results
          </button>
        </div>
      </div>
    </div>
  )
}

export default AutoSubmitModal
