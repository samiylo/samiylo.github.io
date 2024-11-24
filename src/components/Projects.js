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
                <h2>Projects</h2>
                <p>Explore my key projects that showcase a blend of innovative problem-solving, robust design, and real-world application.</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="third">
                  <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    <Nav.Item>
                    <Nav.Link eventKey="first">Apps</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">ML ~ AI</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">Cloud</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Tab.Pane eventKey="first">
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
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                    </Tab.Pane>
                    {/* <BufferGeometryLines></BufferGeometryLines> */}
                    <Tab.Pane eventKey="third">
                    <BufferGeometryLines />
                    <p>Cloud computing leverages a network of remote servers to store, manage, and process data, providing scalable and on-demand resources for applications. Distributed services within this model work collaboratively across multiple servers or nodes, ensuring reliability, scalability, and performance by balancing workloads and data across various locations. When integrated with edge computing, these services bring computational power closer to the data source or user, reducing latency and enhancing real-time processing. This synergy enables faster response times and efficient resource utilization, making it ideal for applications like IoT, video streaming, and AI-driven analytics.</p>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2}></img>
    </section>
  )
}
