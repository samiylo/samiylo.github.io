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
  // Create different shape types for variety (removed ovals)
  const shapeTypes = ['circle', 'blob', 'rounded-square'];
  
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => {
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const size = minSize + Math.random() * (maxSize - minSize);
        const isLarge = size > (minSize + maxSize) / 2;
        
        return (
          <div 
            key={i} 
            className={`floating-shape ${shapeType} ${isLarge ? 'large' : 'small'}`}
            style={{
              '--delay': `${minDelay + Math.random() * (maxDelay - minDelay)}s`,
              '--duration': `${minDuration + Math.random() * (maxDuration - minDuration)}s`,
              '--size': `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: Math.floor(Math.random() * 5) + 1,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: shapeType === 'circle' ? '50%' : 
                          shapeType === 'blob' ? '60% 40% 30% 70% / 60% 30% 70% 40%' : '20%'
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingShapes; 