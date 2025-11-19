

import React from 'react';
import '../styles/mobileStyles.css';

const LoadingState = () => {
  return (
    <div className="mobile-loading-container">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ color: '#fff', marginTop: '20px' }}>Loading analysis data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
