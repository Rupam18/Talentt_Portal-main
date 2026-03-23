import React from 'react';
import { FaExclamationCircle, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import './CustomDialog.css';

/**
 * CustomDialog — Reusable Portal-themed replacement for alert() and confirm()
 * 
 * @param {boolean} show - Whether to show the dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} type - 'alert', 'confirm', 'warning', 'info'
 * @param {string} confirmText - Text for the primary button
 * @param {string} cancelText - Text for the secondary button (only for 'confirm')
 * @param {function} onConfirm - Callback for primary action
 * @param {function} onCancel - Callback for secondary action
 */
const CustomDialog = ({ 
  show, 
  title, 
  message, 
  type = 'confirm', 
  confirmText = 'OK', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel 
}) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning': return <FaExclamationCircle className="dialog-icon warning" />;
      case 'info': return <FaInfoCircle className="dialog-icon info" />;
      default: return <FaQuestionCircle className="dialog-icon confirm" />;
    }
  };

  const getHeaderClass = () => {
    switch (type) {
      case 'warning': return 'dialog-header warning-bg';
      case 'info': return 'dialog-header info-bg';
      default: return 'dialog-header confirm-bg';
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-card">
        <div className={getHeaderClass()}>
          <span className="header-dot"></span>
          <span className="header-dot"></span>
          <span className="header-dot"></span>
          <span className="header-title">{title || 'System Message'}</span>
        </div>
        
        <div className="dialog-body">
          <div className="icon-container">
            {getIcon()}
          </div>
          <h3 className="dialog-title-text">{title}</h3>
          <p className="dialog-message">{message}</p>
          
          <div className="dialog-actions">
            {type === 'confirm' && (
              <button className="btn-secondary-glass" onClick={onCancel}>
                {cancelText}
              </button>
            )}
            <button className="btn-primary-premium" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
