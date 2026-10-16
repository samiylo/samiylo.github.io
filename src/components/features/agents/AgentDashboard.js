import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import FloatingShapes from '../../common/FloatingShapes';
import { agentConfig } from '../../../config/agentConfig';
import { MissionLog } from './MissionLog';
import { DeadDropTerminal } from './DeadDropTerminal';

const formatUtcClock = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
};

const createSessionId = () => {
  const segment = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SES-${segment()}-${segment()}`;
};

const AGENT_MODULES = [
  {
    id: 'mod-spa1',
    path: '/spa1',
    clearance: 'S',
    codename: 'SPA1 Analysis',
    briefing: 'Signal pattern analysis terminal — ingest and correlate field telemetry.',
    status: 'ONLINE',
  },
  {
    id: 'mod-miro',
    path: '/miro',
    clearance: 'C',
    codename: 'Agent Vector Board',
    briefing: 'Tactical mapping surface for vector coordination and asset placement.',
    status: 'ONLINE',
  },
  {
    id: 'mod-vocab',
    path: '/vocabulary',
    clearance: 'S',
    codename: 'Physics Master Artifact',
    briefing: 'Restricted lexicon vault — classified physics terminology and formulas.',
    status: 'ONLINE',
  },
  {
    id: 'mod-robots',
    path: '/robots',
    clearance: 'TS',
    codename: 'TOP Secret Robotic Research',
    briefing: 'Eyes-only robotics lab feed. Clearance TS required to proceed.',
    status: 'RESTRICTED',
  },
];

export const AgentDashboard = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [utcNow, setUtcNow] = useState(() => new Date());
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();
  const utcClock = formatUtcClock(utcNow);

  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    const trimmedCode = accessCode.trim();
    if (trimmedCode === agentConfig.accessCode) {
      const newSessionId = createSessionId();
      setSessionId(newSessionId);
      setIsAuthenticated(true);
      sessionStorage.setItem('agentAuthenticated', 'true');
      sessionStorage.setItem('agentSessionId', newSessionId);
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
    setSessionId('');
    sessionStorage.removeItem('agentAuthenticated');
    sessionStorage.removeItem('agentSessionId');
    setAccessCode('');
    setError('');
  };

  // Check if already authenticated on component mount
  useEffect(() => {
    const authenticated = sessionStorage.getItem('agentAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
      const existingSession = sessionStorage.getItem('agentSessionId');
      if (existingSession) {
        setSessionId(existingSession);
      } else {
        const newSessionId = createSessionId();
        setSessionId(newSessionId);
        sessionStorage.setItem('agentSessionId', newSessionId);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const tick = () => setUtcNow(new Date());
    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

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
                    <header className="agent-command-strip">
                      <div className="agent-command-strip-main">
                        <div className="agent-command-strip-left">
                          <h1 className="agent-command-title">
                            <span className="agent-command-prefix">OPS</span>
                            <span className="agent-command-sep" aria-hidden="true">//</span>
                            <span>DASHBOARD</span>
                          </h1>
                          <span className="agent-secure-link">
                            <span className="agent-secure-link-dot" aria-hidden="true" />
                            SECURE LINK
                          </span>
                        </div>
                        <div className="agent-command-strip-right">
                          <time className="agent-command-meta agent-command-clock" dateTime={utcNow.toISOString()}>
                            {utcClock}
                          </time>
                          <span className="agent-command-meta agent-command-session" title="Session ID">
                            {sessionId}
                          </span>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="agent-logout-btn"
                          >
                            Terminate Session
                          </button>
                        </div>
                      </div>
                      <div className="agent-status-bar" role="status" aria-live="polite">
                        <span>ENCRYPTION: ACTIVE</span>
                        <span className="agent-status-sep" aria-hidden="true">·</span>
                        <span>CHANNEL: ENCRYPTED</span>
                      </div>
                    </header>
                    <DeadDropTerminal sessionId={sessionId} modules={AGENT_MODULES} />
                    
                    <div className="agent-dashboard-content">
                      <h2>Welcome, <span className="" >
                            {sessionId}
                          </span> </h2>
                      <p></p>
                      

                      <div className="agent-modules" aria-label="Mission modules">
                        {AGENT_MODULES.map((module) => (
                          <button
                            key={module.id}
                            type="button"
                            onClick={() => navigate(module.path)}
                            className={`agent-module agent-module--${module.status.toLowerCase()}`}
                          >
                            <div className="agent-module-top">
                              <span
                                className={`agent-module-clearance agent-module-clearance--${module.clearance.toLowerCase()}`}
                                title={`Clearance ${module.clearance}`}
                              >
                                {module.clearance}
                              </span>
                              <span
                                className={`agent-module-status agent-module-status--${module.status.toLowerCase()}`}
                              >
                                <span className="agent-module-status-dot" aria-hidden="true" />
                                {module.status}
                              </span>
                            </div>
                            <span className="agent-module-codename">{module.codename}</span>
                            <span className="agent-module-briefing">{module.briefing}</span>
                          </button>
                        ))}
                      </div>
                      
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
                    <p className="agent-login-subtitle">Access code is required</p>
                    
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
                          placeholder="agent access code"
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
                        <span>Enter</span>
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

