import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import hftImage from "../assets/img/HFT.jpg";
import bitcoinWalletImage from "../assets/img/bitcoinwallet.jpg";
import webCrawler from "../assets/img/webcrawler.jpg";
import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import BufferGeometryLines from "./three/_BufferGeometryLines";

export const Projects = () => {

  const projects = [
    {
      title: "High Frequency Trading",
      description: "Automation & Analysis",
      imgUrl: hftImage,
    },
    {
      title: "Bitcoin Wallet",
      description: "Security & Privacy",
      imgUrl: bitcoinWalletImage,
    },
    {
      title: "Web Crawler",
      description: "Web Scraping",
      imgUrl: webCrawler,
    },
    {
      title: "Business Startup",
      description: "Design & Development",
      imgUrl: projImg1,
    },
    {
      title: "Consulting",
      description: "Architecture & Pricing",
      imgUrl: projImg2,
    },
    {
      title: "Business Startup",
      description: "Design & Development",
      imgUrl: projImg3,
    },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                {/* <h2>Projects</h2> */}
                {/* <p>Delivering reactive solutions</p> */}
                <Tab.Container id="projects-tabs" defaultActiveKey="third">
                  <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    <Nav.Item>
                    <Nav.Link eventKey="first">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-terminal-fill" viewBox="0 0 16 16">
                      <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm9.5 5.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1m-6.354-.354a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708L4.793 6.5z"/>
                    </svg>
                    </Nav.Link>
                    </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="second"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-robot" viewBox="0 0 16 16">
                          <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
                          <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
                        </svg>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-clouds-fill" viewBox="0 0 16 16">
                          <path d="M11.473 9a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 14h8.5a2.5 2.5 0 1 0-.027-5"/>
                          <path d="M14.544 9.772a3.5 3.5 0 0 0-2.225-1.676 5.5 5.5 0 0 0-6.337-4.002 4.002 4.002 0 0 1 7.392.91 2.5 2.5 0 0 1 1.17 4.769z"/>
                        </svg>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Tab.Pane eventKey="first">
                    <h4>Apps</h4>
                      <Row>
                        {
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <h4>Machine Learning</h4>
                      <p>Machine learning is a crucial component of artificial intelligence, enabling computers to learn from data and improve their performance over time without being explicitly programmed. By using algorithms, machine learning models can identify patterns and make predictions or decisions based on large datasets. This allows AI systems to perform complex tasks such as image and speech recognition, natural language processing, and autonomous driving. These capabilities are transforming industries, enhancing productivity, and opening new possibilities in fields like healthcare, finance, and robotics. As machine learning continues to evolve, it significantly contributes to the development of more advanced and adaptive artificial intelligence applications.</p>
                    </Tab.Pane>
                    {/* <BufferGeometryLines></BufferGeometryLines> */}
                    <Tab.Pane eventKey="third">
                    <h4>Cloud Computing</h4>
                    <BufferGeometryLines />
                    <p>Cloud computing leverages a network of remote servers to store, manage, and process data, providing scalable and on-demand resources for applications. Distributed services within this model work collaboratively across multiple servers or nodes, ensuring reliability, scalability, and performance by balancing workloads and data across various locations.</p>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img alt="Projects" className="background-image-right" src={colorSharp2}></img>
    </section>
  )
}
