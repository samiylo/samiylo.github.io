import React from 'react';

const FloatingShapes = ({ 
  count = 20, 
  minSize = 20, 
  maxSize = 60, 
  minDelay = 0, 
  maxDelay = 5, 
  minDuration = 3, 
  maxDuration = 7,
  className = "floating-shapes"
}) => {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="floating-shape" 
          style={{
            '--delay': `${minDelay + Math.random() * (maxDelay - minDelay)}s`,
            '--duration': `${minDuration + Math.random() * (maxDuration - minDuration)}s`,
            '--size': `${minSize + Math.random() * (maxSize - minSize)}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: Math.floor(Math.random() * 5) + 1
          }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes; 