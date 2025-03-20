import { Container, Row, Col } from "react-bootstrap";
// import logo from "../assets/img/logo.png";
import { SocialIcon } from "react-social-icons";
import 'react-social-icons/discord';
import 'react-social-icons/twitter';
import 'react-social-icons/github';

export const LGLJClient = () => {
  return (
    <LGLJClient className="lglj">
      <Container>
        <Row className="align-items-center">
          <Col size={12} sm={6}>
            {/* <img id="footer-logo" oncontextmenu="return false;" src={logo} alt="Logo" /> */}
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
            <SocialIcon target="_blank" bgColor="white" fgColor="purple" url="https://discord.com"/>
                <SocialIcon target="_blank" bgColor="white" fgColor="purple" url="https://linkedin.com/in/samiylo"/>
                <SocialIcon target="_blank" bgColor="white" fgColor="purple" url="https://github.com/samiylo"/>
            </div>
            <p>Copyright 2025. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </LGLJClient>
  )
}

export default LGLJClient;
