import React from 'react'
import { FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa'
import './ViolationModal.css'

/**
 * ViolationModal — Premium Proctoring Security Modal
 *
 * HackerRank / Mettl-style security warning with:
 *  • Glassmorphism dark body
 *  • Gradient header strip (amber → red)
 *  • Scale-in entry animation
 *  • Pulsing warning ring
 *  • Red alert card with attempts count
 *  • Hover-lift CTA button
 *
 * @param {boolean} props.show          — Whether to display the modal
 * @param {Object}  props.violation     — Violation details object
 * @param {number}  props.attemptsLeft  — Remaining attempts before auto-submit
 * @param {Function} props.onClose      — Callback when user clicks "I Understand"
 */
const ViolationModal = ({ show, violation, attemptsLeft, onClose }) => {
  if (!show) return null

  const isCritical = attemptsLeft <= 1

  const type = (violation?.type || '').toLowerCase()
  const violationLabel = type === 'tab_switch'
    ? 'Tab Switching Detected'
    : type === 'window_blur'
    ? 'Window Focus Lost'
    : type === 'full_screen_exit'
    ? 'Fullscreen Exit Detected'
    : type === 'face_not_detected'
    ? 'Face Not Detected'
    : 'Suspicious Activity Detected'

  return (
    <div className="violation-overlay" role="dialog" aria-modal="true" aria-label="Security Warning">
      <div className="violation-card">

        {/* ── Gradient Header Strip ── */}
        <div className="violation-header">
          <FaShieldAlt className="violation-header-icon" />
          <p className="violation-header-text">⚠ Security Warning</p>
        </div>

        {/* ── Dark Glass Body ── */}
        <div className="violation-body">

          {/* Pulsing ring icon */}
          <div className="violation-icon-ring">
            <FaExclamationTriangle />
          </div>

          {/* Title */}
          <h2 className="violation-title">{violationLabel}</h2>

          {/* Description */}
          <p className="violation-desc">
            Switching tabs, minimising the window, or losing focus is strictly
            prohibited during the assessment. This incident has been recorded.
          </p>

          {/* Attempts card */}
          <div className={`violation-attempts-card${isCritical ? ' critical' : ''}`}>
            <p className="violation-attempts-count">
              <FaExclamationTriangle />
              {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
            </p>
            <p className="violation-attempts-sub">
              {isCritical
                ? '⚠ Next violation will automatically submit your test.'
                : 'Further violations will lead to automatic test submission.'}
            </p>
          </div>

          {/* Footnote */}
          <p className="violation-note">
            Please remain on this tab until the assessment is completed.
          </p>

          {/* CTA */}
          <button
            className="violation-btn"
            onClick={onClose}
            autoFocus
          >
            I Understand — Resume Test
          </button>

        </div>
      </div>
    </div>
  )
}

export default ViolationModal
