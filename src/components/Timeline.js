import React from 'react';
import './Timeline.css';

export const Timeline = () => {
  const timelineData = [
    {
      year: "Nov 2022 - Present",
      title: "Senior Software Engineer",
      company: "Kohl's",
      description: "Leading architecture and development for web & mobile at Kohls. Focusing on delivering scalable, high-performance solutions to enhance product visibility. Work with cross-functional engineering, data science & business teams to align on strategic goals, gather requirements, and prioritize features.",
      technologies: ["GraphQL", "Google Vertex AI", "Machine Learning", "Microservices", "Event-Driven Architecture"]
    },
    {
      year: "June - Nov 2022",
      title: "Backend Software Engineer",
      company: "Allstate",
      description: "Involved in the development and optimization of backend services, including the transformation of existing services to a more efficient framework. Implemented policy updates, decoupled service complexities, and resolved security vulnerabilities to ensure robust, secure operations.",
      technologies: ["Java", "Spring", "TDD", "Machine Learning", "Recommendation Engine"]
    },
    {
      year: "Oct 2020 - June 2022",
      title: "Backend Java Developer",
      company: "HCL Tech",
      description: "Extensive experience in backend development and cloud migration of mainframe at USAA headquarters in San Antonio. In Production Support, resolved production bugs and developed solutions for the annuities component. Later, on the Cloud Migration team, played a key role in migrating the annuities product to AWS using Spring Batch.",
      technologies: ["Java", "Spring Batch", "AWS", "S3", "Database Migration", "Production Support"]
    },
    {
      year: "2019 - Sept 2020",
      title: "Full Stack Software Engineering",
      company: "Flatiron School",
      description: "Completed a year-long Full Stack Software Engineering program, developing 10 applications across frontend, backend, and full stack web apps to build practical, end-to-end skills.",
      technologies: ["React", "JavaScript", "Python", "Flask", "Full Stack Development"]
    }
  ];

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