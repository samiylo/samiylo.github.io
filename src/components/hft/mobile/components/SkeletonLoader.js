import React from 'react';
import '../styles/mobileStyles.css';

const SkeletonLoader = () => {
  return (
    <div className="mobile-content-area">
      {[1, 2, 3].map((i) => (
        <div key={i} className="mobile-card-compact mobile-skeleton-card">
          <div className="mobile-skeleton-title"></div>
          <div className="mobile-skeleton-line"></div>
          <div className="mobile-skeleton-line short"></div>
          <div className="mobile-skeleton-line"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;

