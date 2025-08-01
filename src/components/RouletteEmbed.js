import React from 'react';

const RouletteEmbed = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      border: 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      <iframe
        src="https://bled-roulette.netlify.app"
        title="Roulette Game"
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        style={{
          border: 'none',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default RouletteEmbed; 