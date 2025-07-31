import React, { useState } from 'react';
import { timelineData } from '../utils';
import FloatingShapes from './FloatingShapes';

export const Timeline = () => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (index) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };

  return (
    <section className="timeline" id="timeline">
      <div className="timeline-background">
        <FloatingShapes 
          count={12} 
          minSize={10} 
          maxSize={40} 
          minDelay={1} 
          maxDelay={6} 
          minDuration={3} 
          maxDuration={9}
          className="timeline-floating-shapes"
        />
      </div>
      
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="timeline-bx wow zoomIn">
              <h2>Career Timeline</h2>
              <p>My professional journey in software development and technology</p>
              
              <div className="timeline-container">
                {timelineData.map((item, index) => (
                  <div
                    key={index}
                    className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                  >
                    <div 
                      className={`timeline-content ${expandedItems.has(index) ? 'expanded' : ''}`}
                      onClick={() => toggleExpanded(index)}
                    >
                      <div className="timeline-year">{item.year}</div>
                      <div className="timeline-header">
                        <h4>{item.title}</h4>
                        <div className="company">{item.company}</div>
                      </div>
                      <p>{item.description}</p>
                      
                      <div className="technologies">
                        {item.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* Expanded Content */}
                      {expandedItems.has(index) && (
                        <div className="expanded-content">
                          <div className="expanded-section">
                            <h5>Achievements</h5>
                            <ul>
                              {item.achievements.map((achievement, achievementIndex) => (
                                <li key={achievementIndex}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="expanded-section">
                            <h5>Key Responsibilities</h5>
                            <ul>
                              {item.responsibilities.map((responsibility, responsibilityIndex) => (
                                <li key={responsibilityIndex}>{responsibility}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="expanded-section">
                            <h5>Notable Projects</h5>
                            <div className="projects-grid">
                              {item.projects.map((project, projectIndex) => (
                                <div key={projectIndex} className="project-card">
                                  <h6>{project.name}</h6>
                                  <p>{project.description}</p>
                                  <div className="project-impact">
                                    <strong>Impact:</strong> {project.impact}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Expand/Collapse Indicator */}
                      <div className="expand-indicator">
                        {expandedItems.has(index) ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 