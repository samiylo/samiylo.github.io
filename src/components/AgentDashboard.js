import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import FloatingShapes from './FloatingShapes';
import { agentConfig } from '../config/agentConfig';
import { MissionLog } from './MissionLog';

export const AgentDashboard = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    const trimmedCode = accessCode.trim();
    if (trimmedCode === agentConfig.accessCode) {
      setIsAuthenticated(true);
      // Store authentication in sessionStorage for persistence
      sessionStorage.setItem('agentAuthenticated', 'true');
    } else {
      setError('Invalid access code. Please try again.');
      setAccessCode('');
    }
  };

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem('agentAuthenticated');
    setAccessCode('');
    setError('');
  };

  // Check if already authenticated on component mount
  useEffect(() => {
    const authenticated = sessionStorage.getItem('agentAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    return (
      <section className="agent-dashboard" id="agent-dashboard">
        <div className="agent-dashboard-background">
          <FloatingShapes 
            count={10} 
            minSize={30} 
            maxSize={80} 
            minDelay={0} 
            maxDelay={8} 
            minDuration={8} 
            maxDuration={20}
            className="agent-dashboard-floating-shapes"
          />
        </div>
        
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <TrackVisibility>
                {({ isVisible }) =>
                  <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                    <div className="agent-dashboard-header">
                      <h1>Agent Dashboard</h1>
                      <button 
                        type="button"
                        onClick={handleLogout}
                        className="agent-logout-btn"
                      >
                        Logout
                      </button>
                    </div>
                    
                    <div className="agent-dashboard-content">
                      <h2>Welcome, Agent</h2>
                      <p>You have successfully accessed the agent dashboard.</p>
                      <MissionLog />
                    </div>
                  </div>
                }
              </TrackVisibility>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section className="agent-login" id="agent-login">
      <div className="agent-login-background">
        <FloatingShapes 
          count={8} 
          minSize={40} 
          maxSize={100} 
          minDelay={0} 
          maxDelay={10} 
          minDuration={10} 
          maxDuration={25}
          className="agent-login-floating-shapes"
        />
      </div>
      
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <div className="agent-login-container">
                    <h2>Access?</h2>
                    <p className="agent-login-subtitle">Enter your access code to continue</p>
                    
                    <form onSubmit={handleLogin}>
                      <div className="agent-login-form-group">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={accessCode}
                          onChange={(e) => {
                            // Only allow numeric input
                            const value = e.target.value.replace(/\D/g, '');
                            setAccessCode(value);
                            setError('');
                          }}
                          placeholder="Enter access code"
                          className="agent-login-input"
                          autoFocus
                          maxLength={10}
                        />
                        {error && (
                          <p className="agent-login-error">{error}</p>
                        )}
                      </div>
                      
                      <button 
                        type="submit" 
                        className="agent-login-button"
                        disabled={!accessCode || accessCode.trim().length === 0}
                      >
                        <span>Agent Dashboard</span>
                      </button>
                    </form>
                    
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate('/');
                      }}
                      className="agent-back-button"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              }
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

