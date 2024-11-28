import { Container, Row, Col } from "react-bootstrap";
import { MailchimpForm } from "./MailchimpForm";
import logo from "../assets/img/logo.png";
import { SocialIcon } from "react-social-icons";
import 'react-social-icons/discord';
import 'react-social-icons/twitter';
import 'react-social-icons/github';

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <MailchimpForm />
          <Col size={12} sm={6}>
            <img src={logo} alt="Logo" />
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
            <SocialIcon target="_blank" bgColor="white" fgColor="purple" url="https://discord.com"/>
                <SocialIcon target="_blank" bgColor="white" fgColor="purple" url="https://linkedin.com/in/samiylo"/>
                <SocialIcon target="_blank" bgColor="white" fgColor="purple" url="https://github.com/samiylo"/>
            </div>
            <p>Copyright 2024. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
