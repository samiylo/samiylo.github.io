import React, { useState } from 'react';

export const Miro = ({ 
  src = "/digital-architecture.svg", 
  alt = "Digital Architecture Diagram", 
  className = "" 
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className={`miro-container ${className}`} 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {!hasError ? (
        <img 
          src={src} 
          alt={alt} 
          onError={() => setHasError(true)}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain' 
          }} 
        />
      ) : (
        <div className="miro-fallback" style={{ color: '#666', padding: '1rem' }}>
          Failed to load architectural diagram.
        </div>
      )}
    </div>
  );
};