import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import TrackVisibility from 'react-on-screen';

export const MissionLog = ({ missions = [] }) => {
  const [expandedMission, setExpandedMission] = useState(null);

  const toggleMission = (missionId) => {
    setExpandedMission(expandedMission === missionId ? null : missionId);
  };

  // Default missions if none provided
  const defaultMissions = [
    {
      id: 'M-001',
      title: 'Data Extraction Protocol',
      statement: 'Extract and analyze critical data points from designated sources while maintaining operational security.',
      acceptanceCriteria: [
        'All target data points successfully extracted',
        'Data integrity verified with 99.9% accuracy',
        'Security protocols maintained throughout operation',
        'Report generated and submitted within 24 hours'
      ]
    },
    {
      id: 'M-002',
      title: 'System Integration Task',
      statement: 'Integrate new communication protocols into existing infrastructure without service interruption.',
      acceptanceCriteria: [
        'Integration completed with zero downtime',
        'All systems tested and verified operational',
        'Documentation updated and reviewed',
        'Team briefed on new protocols'
      ]
    },
    {
      id: 'M-003',
      title: 'Security Audit Mission',
      statement: 'Conduct comprehensive security audit of all active systems and identify potential vulnerabilities.',
      acceptanceCriteria: [
        'Complete audit of all systems performed',
        'All vulnerabilities documented and prioritized',
        'Remediation plan created and approved',
        'Follow-up audit scheduled'
      ]
    }
  ];

  const missionsToDisplay = missions.length > 0 ? missions : defaultMissions;

  return (
    <div className="mission-log">
      <h3 className="mission-log-title">Active Missions</h3>
      <div className="missions-list">
        <Row>
          {missionsToDisplay.map((mission, index) => (
            <Col xs={12} key={mission.id || index} className="mb-4">
              <TrackVisibility>
                {({ isVisible }) => (
                  <div 
                    className={`mission-card ${isVisible ? "animate__animated animate__fadeInUp" : ""}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mission-card-header">
                      <div className="mission-header-left">
                        <span className="mission-id">{mission.id}</span>
                        <h4 className="mission-title">{mission.title}</h4>
                      </div>
                      <button
                        type="button"
                        className={`mission-expand-btn ${expandedMission === mission.id ? 'expanded' : ''}`}
                        onClick={() => toggleMission(mission.id)}
                        aria-label={expandedMission === mission.id ? 'Collapse mission' : 'Expand mission'}
                      >
                        <span>{expandedMission === mission.id ? '−' : '+'}</span>
                      </button>
                    </div>
                    
                    <div className="mission-statement">
                      <p>{mission.statement}</p>
                    </div>

                    {expandedMission === mission.id && (
                      <div className="mission-details">
                        <div className="mission-acceptance-criteria">
                          <h5>Acceptance Criteria:</h5>
                          <ul>
                            {mission.acceptanceCriteria.map((criterion, idx) => (
                              <li key={idx}>{criterion}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TrackVisibility>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

