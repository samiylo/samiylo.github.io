import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import 'animate.css';
import TrackVisibility from 'react-on-screen';


export const LgHomeComponent = () => {

  const projects = [
    {
      title: "LGLJ Designs",
      description: "Bakery & Ecommerce",

    },
    {
      title: "Bitcoin Wallet",
      description: "Security & Privacy",

    },
    {
      title: "Web Crawler",
      description: "Web Scraping",
   
    },
    {
      title: "Business Startup",
      description: "Design & Development",

    },
    {
      title: "Consulting",
      description: "Architecture & Pricing",

    },
    {
      title: "Business Startup",
      description: "Design & Development",

    },
  ];

  return (
    <section className="lglj-home" id="lglj-home">
      <Container>
        <Row>
          <Col size={12}>
          </Col>
        </Row>
      </Container>

    </section>
  )
}
