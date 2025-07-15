import React from 'react';
import { timelineData } from '../utils';

export const Timeline = () => {
  return (
    <section className="timeline" id="timeline">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="timeline-bx wow zoomIn">
              <h2>Career Timeline</h2>
              <p>My professional journey in software development and technology</p>
              
              <div className="timeline-container">
                {timelineData.map((item, index) => (
                  <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                    <div className="timeline-content">
                      <div className="timeline-year">{item.year}</div>
                      <div className="timeline-header">
                        <h4>{item.title}</h4>
                        <span className="company">{item.company}</span>
                      </div>
                      <p>{item.description}</p>
                      <div className="technologies">
                        {item.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="tech-tag">{tech}</span>
                        ))}
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