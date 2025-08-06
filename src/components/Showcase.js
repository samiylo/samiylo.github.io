import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaGithub, FaReact, FaDatabase, FaShieldAlt, FaRocket, FaBrain, FaServer, FaChartLine, FaShoppingCart, FaLock, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FloatingShapes from './FloatingShapes';
import 'animate.css';

const projects = [
  {
    title: 'AI-Powered Retail Analytics Platform',
    description: 'Intelligent sales forecasting and customer behavior analysis system that increased retail revenue by 35% through predictive analytics and personalized recommendations.',
    longDescription: 'Developed a comprehensive AI-driven retail analytics platform that processes millions of transactions to provide real-time insights. Features include demand forecasting, customer segmentation, and dynamic pricing optimization. The system integrates with multiple POS systems and provides actionable recommendations to increase sales and reduce inventory costs.',
    link: '#',
    github: 'https://github.com/samiylo/retail-ai-platform',
    image: '',
    technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL', 'Redis'],
    icons: [FaBrain, FaShoppingCart, FaChartLine],
    category: 'AI/Retail',
    featured: true,
    company: 'RetailTech Solutions'
  },
  {
    title: 'Microservices Architecture Migration',
    description: 'Led the transformation of a monolithic e-commerce platform to a scalable microservices architecture, improving system performance by 60% and reducing deployment time by 80%.',
    longDescription: 'Architected and implemented a complete microservices migration for a high-traffic e-commerce platform. Designed service boundaries, implemented API gateways, and established CI/CD pipelines. The new architecture supports 10x more concurrent users while maintaining 99.9% uptime.',
    link: '#',
    github: 'https://github.com/samiylo/microservices-migration',
    image: '',
    technologies: ['Docker', 'Kubernetes', 'Node.js', 'MongoDB', 'Redis', 'AWS'],
    icons: [FaServer, FaRocket],
    category: 'Microservices',
    featured: true,
    company: 'E-Commerce Corp'
  },
  {
    title: 'Cybersecurity Threat Detection System',
    description: 'Real-time security monitoring platform that detects and prevents cyber threats, protecting sensitive data across enterprise networks.',
    longDescription: 'Built a comprehensive cybersecurity platform that monitors network traffic, user behavior, and system logs to identify potential threats. Implements machine learning algorithms for anomaly detection and provides real-time alerts. The system has prevented over 1000 security incidents.',
    link: '#',
    github: 'https://github.com/samiylo/security-monitoring',
    image: '',
    technologies: ['Python', 'Elasticsearch', 'React', 'Node.js', 'Machine Learning'],
    icons: [FaShieldAlt, FaLock],
    category: 'Security',
    featured: true,
    company: 'SecureNet Inc'
  },
  {
    title: 'High-Performance Data Processing Pipeline',
    description: 'Optimized data processing system that handles 10M+ records daily, reducing processing time by 75% and improving data accuracy.',
    longDescription: 'Designed and implemented a high-throughput data processing pipeline that efficiently processes large datasets from multiple sources. Features include parallel processing, data validation, and real-time analytics. The system supports both batch and streaming data processing.',
    link: '#',
    github: 'https://github.com/samiylo/data-pipeline',
    image: '',
    technologies: ['Apache Kafka', 'Apache Spark', 'Python', 'PostgreSQL', 'Redis'],
    icons: [FaRocket, FaDatabase],
    category: 'Performance',
    featured: false,
    company: 'DataFlow Systems'
  },
  {
    title: 'Cloud-Native Application Platform',
    description: 'Scalable cloud platform that enables rapid deployment of applications with automatic scaling, monitoring, and cost optimization.',
    longDescription: 'Developed a cloud-native platform that simplifies application deployment and management. Features include auto-scaling, load balancing, monitoring, and cost optimization. The platform supports multiple cloud providers and reduces infrastructure costs by 40%.',
    link: '#',
    github: 'https://github.com/samiylo/cloud-platform',
    image: '',
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus'],
    icons: [FaServer, FaRocket],
    category: 'Cloud',
    featured: false,
    company: 'CloudScale Tech'
  },
  {
    title: 'Real-Time Analytics Dashboard',
    description: 'Interactive dashboard providing real-time insights into business metrics, user behavior, and system performance across multiple data sources.',
    longDescription: 'Created a comprehensive analytics dashboard that aggregates data from multiple sources to provide real-time business insights. Features include customizable widgets, automated reporting, and predictive analytics. The dashboard supports multiple user roles and data visualization options.',
    link: '#',
    github: 'https://github.com/samiylo/analytics-dashboard',
    image: '',
    technologies: ['React', 'D3.js', 'Node.js', 'MongoDB', 'WebSocket'],
    icons: [FaChartLine, FaReact],
    category: 'Analytics',
    featured: false,
    company: 'AnalyticsPro'
  },
  {
    title: 'API Gateway & Service Mesh',
    description: 'Enterprise-grade API gateway with service mesh capabilities, providing security, monitoring, and traffic management for microservices.',
    longDescription: 'Built a comprehensive API gateway that handles authentication, rate limiting, request routing, and monitoring for microservices. Implements service mesh patterns for inter-service communication and provides detailed analytics on API usage and performance.',
    link: '#',
    github: 'https://github.com/samiylo/api-gateway',
    image: '',
    technologies: ['Kong', 'Istio', 'Node.js', 'Redis', 'Prometheus'],
    icons: [FaServer, FaShieldAlt],
    category: 'Microservices',
    featured: false,
    company: 'API Solutions'
  },
  {
    title: 'Machine Learning Model Pipeline',
    description: 'Automated ML model training and deployment pipeline that reduces model development time by 70% and improves prediction accuracy.',
    longDescription: 'Developed an end-to-end machine learning pipeline that automates data preprocessing, model training, validation, and deployment. Features include A/B testing, model versioning, and automated retraining. The pipeline supports multiple ML frameworks and cloud platforms.',
    link: '#',
    github: 'https://github.com/samiylo/ml-pipeline',
    image: '',
    technologies: ['Python', 'TensorFlow', 'Kubernetes', 'MLflow', 'Docker'],
    icons: [FaBrain, FaRocket],
    category: 'AI/ML',
    featured: false,
    company: 'ML Innovations'
  }
];

export const Showcase = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const categories = ['All', ...new Set(projects.map(project => project.category))];
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredProjects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredProjects.length]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentSlide(0);
    setSelectedProject(null);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setIsAutoPlaying(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setIsAutoPlaying(true);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredProjects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentProject = filteredProjects[currentSlide];

  return (
    <section className="projects-showcase-section" id="showcase">
      <div className="showcase-background">
        <FloatingShapes 
          count={25} 
          minSize={8} 
          maxSize={80} 
          minDelay={0} 
          maxDelay={8} 
          minDuration={4} 
          maxDuration={12}
          className="showcase-floating-shapes"
        />
      </div>

      <div className="container">
        <div className="showcase-header">
          <h2 className="showcase-title">
            <span className="title-gradient">App</span> Showcase
          </h2>
          <p className="showcase-subtitle">
            A diverse portfolio showcasing expertise in AI/ML, microservices architecture, 
            cybersecurity, performance optimization, and cloud-native solutions across multiple industries
          </p>
        </div>
        
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="carousel-container">
          <div className="carousel-wrapper">
            <div className="carousel-slide">
              <div className="carousel-content">
                <div className="carousel-header">
                  <div className="carousel-category">{currentProject.category}</div>
                  {currentProject.featured && <div className="carousel-featured-badge">Featured</div>}
                </div>
                
                <div className="carousel-main">
                  <h3 className="carousel-title">{currentProject.title}</h3>
                  {currentProject.company && (
                    <div className="carousel-company">
                      <span className="company-name">{currentProject.company}</span>
                    </div>
                  )}
                  <p className="carousel-description">{currentProject.description}</p>
                </div>

                <div className="carousel-footer">
                  <div className="carousel-technologies">
                    {currentProject.technologies.map((tech, techIdx) => (
                      <span key={techIdx} className="carousel-tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="carousel-icons">
                    {currentProject.icons.map((Icon, iconIdx) => (
                      <Icon key={iconIdx} className="carousel-tech-icon" />
                    ))}
                  </div>
                </div>

                <div className="carousel-actions">
                  <button 
                    className="carousel-details-btn"
                    onClick={() => handleProjectClick(currentProject)}
                  >
                    View Details
                  </button>
                  <div className="carousel-links">
                    <a 
                      href={currentProject.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="carousel-link primary"
                    >
                      <FaExternalLinkAlt />
                      <span>Live Demo</span>
                    </a>
                    {currentProject.github && (
                      <a 
                        href={currentProject.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="carousel-link secondary"
                      >
                        <FaGithub />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <button className="carousel-nav prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="carousel-nav next" onClick={nextSlide}>
            <FaChevronRight />
          </button>

          {/* Dots Indicator */}
          <div className="carousel-dots">
            {filteredProjects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="carousel-counter">
            <span className="current-slide">{currentSlide + 1}</span>
            <span className="total-slides">/ {filteredProjects.length}</span>
          </div>
        </div>

        {/* Project Modal */}
        {isModalOpen && selectedProject && (
          <div className="project-modal-overlay" onClick={closeModal}>
            <div className="project-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
              
              <div className="modal-header">
                <div className="modal-category">{selectedProject.category}</div>
                {selectedProject.featured && <div className="modal-featured-badge">Featured</div>}
              </div>
              
              <h3 className="modal-title">{selectedProject.title}</h3>
              {selectedProject.company && (
                <div className="modal-company">
                  <span className="company-label">Company:</span>
                  <span className="company-name">{selectedProject.company}</span>
                </div>
              )}
              
              <p className="modal-description">{selectedProject.longDescription}</p>
              
              <div className="modal-technologies">
                {selectedProject.technologies.map((tech, techIdx) => (
                  <span key={techIdx} className="modal-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="modal-actions">
                <a 
                  href={selectedProject.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="modal-link primary"
                >
                  <FaExternalLinkAlt />
                  <span>Live Demo</span>
                </a>
                {selectedProject.github && (
                  <a 
                    href={selectedProject.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="modal-link secondary"
                  >
                    <FaGithub />
                    <span>View Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="showcase-footer">
          <p className="showcase-cta">
            Ready to tackle complex technical challenges? Let's build innovative solutions together!
          </p>
          <a href="#connect" className="cta-button">
            <span>Start a Project</span>
            <div className="button-glow"></div>
          </a>
        </div>
      </div>
    </section>
  );
};
