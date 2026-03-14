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
      {/* Back to Home button */}
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1001,
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#0056b3';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#007bff';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        Back to Home
      </button>
      
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