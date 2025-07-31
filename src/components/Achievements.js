import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TrackVisibility from 'react-on-screen';
import FloatingShapes from './FloatingShapes';

export const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: "100's of Apps Built",
      description: "Delivered hundreds of applications across web, mobile, and enterprise platforms",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="achievement-svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: "#AA367C",
      gradient: "linear-gradient(135deg, #AA367C 0%, #FF6B9D 100%)"
    },
    {
      id: 2,
      title: "Analytics Driven Performance",
      description: "Implemented data-driven optimization strategies for enhanced user experience and performance",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="achievement-svg">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
      ),
      color: "#4A2FBD",
      gradient: "linear-gradient(135deg, #4A2FBD 0%, #7B68EE 100%)"
    },
    {
      id: 3,
      title: "Machine Learning for Search & Browse",
      description: "Developed intelligent search & recommendation algorithms and personalized recommendation experiences for Google e-commerce platforms",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="achievement-svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
      color: "#FF6B35",
      gradient: "linear-gradient(135deg, #FF6B35 0%, #FFA726 100%)"
    },
    {
      id: 4,
      title: "Dev Productivity with Extreme Programming",
      description: "Streamlined development processes using XP methodologies for faster delivery",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="achievement-svg">
          <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.6 1.53c.56-1.24.9-2.62.9-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
        </svg>
      ),
      color: "#00D4AA",
      gradient: "linear-gradient(135deg, #00D4AA 0%, #4CAF50 100%)"
    },
    {
      id: 5,
      title: "Customer Focused Solutions",
      description: "Built user-centric applications with exceptional UX/UI design principles",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="achievement-svg">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      color: "#FFD93D",
      gradient: "linear-gradient(135deg, #FFD93D 0%, #FFB74D 100%)"
    },
    {
      id: 6,
      title: "Enhanced App Security",
      description: "Implemented industry-standard security practices, resolved vulnerabilities, and maintained secure web applications",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="achievement-svg">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
        </svg>
      ),
      color: "#E74C3C",
      gradient: "linear-gradient(135deg, #E74C3C 0%, #FF6B6B 100%)"
    }
  ];

  // SVGs for small shapes (star, circle, triangle, square)
  const svgShapes = [
    // Star
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" key="star"><polygon points="8,2 9.76,6.32 14.41,6.32 10.82,8.97 12.58,13.28 8,10.63 3.42,13.28 5.18,8.97 1.59,6.32 6.24,6.32" fill="#FFD93D"/></svg>,
    // Circle
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" key="circle"><circle cx="7" cy="7" r="6" fill="#FF6B35"/></svg>,
    // Triangle
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" key="triangle"><polygon points="7,2 12,12 2,12" fill="#4A2FBD"/></svg>,
    // Square
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" key="square"><rect x="2" y="2" width="8" height="8" fill="#AA367C"/></svg>,
  ];

  return (
    <section className="achievements" id="achievements">
      <div className="achievements-background">
        <FloatingShapes 
          count={22} 
          minSize={4} 
          maxSize={40} 
          minDelay={0} 
          maxDelay={15} 
          minDuration={8} 
          maxDuration={25}
          className="achievements-floating-shapes"
        />
        <div className="floating-particles">
          {[...Array(50)].map((_, i) => {
            const shape = svgShapes[Math.floor(Math.random() * svgShapes.length)];
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = 3 + Math.random() * 4;
            const spin = Math.random() > 0.7; // Fewer spinning for subtlety
            return (
              <div
                key={i}
                className={`particle${spin ? ' spin' : ''}`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  width: `${12 + Math.random() * 6}px`,
                  height: `${12 + Math.random() * 6}px`,
                }}
              >
                {shape}
              </div>
            );
          })}
        </div>
      </div>
      
      <Container>
        <Row>
          <Col xs={12}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <div className="achievements-header">
                    <h2>Driving Digital Transformation</h2>
                    <p>Using the latest in web technologies to drive innovative solutions</p>
                  </div>
                  
                  <div className="hexagonal-grid">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id}
                        className="hexagon-card"
                        style={{
                          '--achievement-color': achievement.color,
                          '--achievement-gradient': achievement.gradient
                        }}
                      >
                        <div className="hexagon-content">
                          <div className="hexagon-icon" style={{ background: achievement.gradient }}>
                            {achievement.icon}
                          </div>
                          <div className="hexagon-text">
                            <h4>{achievement.title}</h4>
                            <p>{achievement.description}</p>
                          </div>
                          <div className="hexagon-glow"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
}; 