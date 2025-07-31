import React, { useState } from 'react';
import { FaExternalLinkAlt, FaGithub, FaReact, FaJs, FaCss3Alt, FaNodeJs, FaDatabase } from 'react-icons/fa';
import FloatingShapes from './FloatingShapes';

const projects = [
  {
    title: 'Deterministic Physics Lab',
    description: 'An interactive platform for learning physics concepts through real-time simulations. Features include particle systems, force calculations, and educational visualizations.',
    longDescription: 'A comprehensive physics learning platform that brings complex concepts to life through interactive simulations. Students can experiment with gravity, momentum, and energy conservation in real-time.',
    link: 'https://opncore-physics-lab.netlify.app',
    github: 'https://github.com/samiylo/physics-lab',
    image: '',
    technologies: ['React', 'JavaScript', 'Canvas API', 'Physics.js'],
    icons: [FaReact, FaJs],
    category: 'Educational',
    featured: true
  },
  {
    title: 'Let\'s Travel World',
    description: 'Interactive world exploration platform with dynamic maps, travel planning tools, and cultural insights for global adventurers.',
    longDescription: 'A comprehensive travel platform that combines interactive mapping with cultural insights. Users can plan trips, discover destinations, and learn about local customs and traditions.',
    link: 'https://lets-travel-world.netlify.app',
    github: 'https://github.com/samiylo/travel-world',
    image: '',
    technologies: ['React', 'Mapbox API', 'Node.js', 'MongoDB'],
    icons: [FaReact, FaNodeJs, FaDatabase],
    category: 'Travel',
    featured: true
  },
  {
    title: 'It\'s a Lifestyle',
    description: 'A modern travel blog platform where adventurers share experiences, tips, and stories from around the world.',
    longDescription: 'A community-driven travel blog that connects travelers worldwide. Features include story sharing, photo galleries, and travel tips from experienced globetrotters.',
    link: 'https://itsalifestyle.netlify.app',
    github: 'https://github.com/samiylo/lifestyle-blog',
    image: '',
    technologies: ['React', 'Firebase', 'CSS3', 'Netlify'],
    icons: [FaReact, FaCss3Alt],
    category: 'Blog',
    featured: false
  },
  {
    title: 'AI Chat Assistant',
    description: 'Intelligent conversational AI powered by machine learning for customer support and user engagement.',
    longDescription: 'A sophisticated AI chat system that provides intelligent responses and learns from user interactions to improve over time.',
    link: '#',
    github: 'https://github.com/samiylo/ai-chat',
    image: '',
    technologies: ['Python', 'TensorFlow', 'React', 'WebSocket'],
    icons: [FaReact, FaJs],
    category: 'AI/ML',
    featured: true
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment processing, inventory management, and analytics dashboard.',
    longDescription: 'A complete online shopping platform featuring secure payments, real-time inventory tracking, and comprehensive analytics for business insights.',
    link: '#',
    github: 'https://github.com/samiylo/ecommerce-platform',
    image: '',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    icons: [FaReact, FaNodeJs, FaDatabase],
    category: 'E-Commerce',
    featured: false
  },
  {
    title: 'Task Management App',
    description: 'Collaborative task management tool with real-time updates, team collaboration, and progress tracking.',
    longDescription: 'A powerful project management application that enables teams to collaborate effectively with real-time updates and comprehensive progress tracking.',
    link: '#',
    github: 'https://github.com/samiylo/task-manager',
    image: '',
    technologies: ['React', 'Socket.io', 'Express', 'MongoDB'],
    icons: [FaReact, FaNodeJs, FaDatabase],
    category: 'Productivity',
    featured: false
  }
];

export const Showcase = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(projects.map(project => project.category))];
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section className="projects-showcase-section" id="showcase">
      <div className="showcase-background">
        <FloatingShapes />
      </div>

      <div className="container">
        <div className="showcase-header">
          <h2 className="showcase-title">
            <span className="title-gradient">Featured</span> Projects
          </h2>
          <p className="showcase-subtitle">
            A collection of innovative applications showcasing modern web development, 
            AI integration, and user experience design
          </p>
        </div>
        
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project, idx) => (
            <div 
              className={`project-card ${project.featured ? 'featured' : ''} ${hoveredProject === idx ? 'hovered' : ''}`}
              key={idx}
              onMouseEnter={() => setHoveredProject(idx)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="project-header">
                <div className="project-category">{project.category}</div>
                {project.featured && <div className="featured-badge">Featured</div>}
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-technologies">
                  {project.technologies.map((tech, techIdx) => (
                    <span key={techIdx} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="project-icons">
                  {project.icons.map((Icon, iconIdx) => (
                    <Icon key={iconIdx} className="tech-icon" />
                  ))}
                </div>
              </div>

              <div className="project-actions">
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-link primary"
                >
                  <FaExternalLinkAlt />
                  <span>Live Demo</span>
                </a>
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link secondary"
                  >
                    <FaGithub />
                    <span>Code</span>
                  </a>
                )}
              </div>

              <div className="project-glow"></div>
            </div>
          ))}
        </div>
        <FloatingShapes />
        <div className="showcase-footer">
          <p className="showcase-cta">
            Interested in collaborating? Let's build something amazing together!
          </p>
          <a href="#connect" className="cta-button">
            <span>Get In Touch</span>
            <div className="button-glow"></div>
          </a>
        </div>
      </div>
    </section>
  );
};
