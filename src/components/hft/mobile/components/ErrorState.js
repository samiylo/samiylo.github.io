import React from 'react';
import '../styles/mobileStyles.css';

const ErrorState = () => {
  return (
    <div className="mobile-error-container">
      <div className="alert alert-danger" role="alert">
        Failed to load analysis data. Please try again later.
      </div>
    </div>
  );
};

export default ErrorState;

