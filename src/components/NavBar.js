import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';

import { SocialIcon } from "react-social-icons";
import 'react-social-icons/discord';
import 'react-social-icons/twitter';
import 'react-social-icons/github';
import logo from "../assets/img/logo.png";

import { HashLink } from 'react-router-hash-link';

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };

  const handleHomeClick = () => {
    navigate('/bled-roulette');
  };

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand href="/">
          <Spline 
            className="brand-logo"
            scene="https://prod.spline.design/kcNfbALfc98G-jW2/scene.splinecode" 
            style={{ width: '200px', height: '100px' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <img className="navbar-toggler-icon-moblie" src={logo} alt="Logo" />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={handleHomeClick}>Home</Nav.Link>
            <Nav.Link href="/agents" className={activeLink === 'agents' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('agents')}>Agents</Nav.Link>
            <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Models</Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <SocialIcon className="box" target="_blank" bgColor="white" fgColor="purple" url="https://discord.com"/>
                <SocialIcon className="box" target="_blank" bgColor="white" fgColor="purple" url="https://linkedin.com/in/samiylo"/>
                <SocialIcon className="box" target="_blank" bgColor="white" fgColor="purple" url="https://github.com/samiylo"/> 
            </div>
            <HashLink to='#connect'>
              <button className="see-more-button navbar-connect-btn">
                <div className="button-content">
                  <span className="button-text">Let's Connect</span>
                </div>
                <div className="button-glow"></div>
                <div className="button-particles"></div>
              </button>
            </HashLink>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
