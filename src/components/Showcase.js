import React from 'react';

const projects = [
  {
    title: 'Project One',
    description: 'A brief description of Project One. This project does amazing things!',
    link: 'https://example.com/project-one',
    image: '', // Optional: add image URL
  },
  {
    title: 'Project Two',
    description: 'A brief description of Project Two. This project is super cool!',
    link: 'https://example.com/project-two',
    image: '',
  },
  {
    title: 'Project Three',
    description: 'A brief description of Project Three. This project is innovative!',
    link: 'https://example.com/project-three',
    image: '',
  },

];

export const Showcase = () => {
  return (
    <section className="projects-showcase-section">
      <h2 className="projects-title">Featured Projects</h2>
      <div className="projects-grid">
        {projects.map((project, idx) => (
          <div className="glassy-box project-card" key={idx}>
            {/* Optional: <img src={project.image} alt={project.title} className="project-image" /> */}
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">View Project</a>
          </div>
        ))}
      </div>
    </section>
  );
};
