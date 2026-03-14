import React from 'react';
import '../styles/mobileStyles.css';

const ErrorState = ({ onRetry }) => {
  return (
    <div className="mobile-error-container">
      <div className="mobile-error-content">
        <div className="mobile-error-icon">⚠️</div>
        <h3 className="mobile-error-title">Failed to Load Data</h3>
        <p className="mobile-error-message">
          We couldn't load the analysis data. Please check your connection and try again.
        </p>
        {onRetry && (
          <button className="mobile-retry-button" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
