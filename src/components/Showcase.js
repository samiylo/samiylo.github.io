import React from 'react';

const projects = [
  {
    title: 'Deterministic Physics Lab',
    description: 'Deterministic Physics Lab is a platform for learning physics concepts through interactive simulations. It provides a hands-on learning experience for students and enthusiasts alike.',
    link: 'https://opncore-physics-lab.netlify.app',
    image: '',
  },
  {
    title: 'Let\'s Travel World',
    description: 'Let\'s Travel World is a platform for exploring the world through interactive maps. It provides a visual representation of the world and allows users to explore the world through interactive maps.',
    link: 'https://lets-travel-world.netlify.app',
    image: '',
  },
  {
    title: 'It\'s a Lifestyle',
    description: 'It\'s a Lifestyle is travel blog website. It\'s a blog website where users can share their travel experiences and tips.',
    link: 'https://itsalifestyle.netlify.app',
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
