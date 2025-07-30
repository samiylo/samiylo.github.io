import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import Spline from '@splinetool/react-spline';

import { SocialIcon } from "react-social-icons";
import 'react-social-icons/discord';
import 'react-social-icons/twitter';
import 'react-social-icons/github';

import { HashLink } from 'react-router-hash-link';

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand href="/">
          <Spline 
            scene="https://prod.spline.design/kcNfbALfc98G-jW2/scene.splinecode" 
            style={{ width: '200px', height: '100px' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
            <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Skills</Nav.Link>
            <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Projects</Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <SocialIcon className="box" target="_blank" bgColor="white" fgColor="purple" url="https://discord.com"/>
                <SocialIcon className="box" target="_blank" bgColor="white" fgColor="purple" url="https://linkedin.com/in/samiylo"/>
                <SocialIcon className="box" target="_blank" bgColor="white" fgColor="purple" url="https://github.com/samiylo"/> 
            </div>
            <HashLink to='#connect'>
              <button className="vvd"><span>Let's Connect</span></button>
            </HashLink>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
