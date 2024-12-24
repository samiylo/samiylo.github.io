import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from '../assets/img/logo.png';
// import navIcon1 from '../assets/img/nav-icon1.svg';
// import navIcon2 from '../assets/img/nav-icon2.svg';
// import navIcon3 from '../assets/img/nav-icon3.svg';
import { HashLink } from 'react-router-hash-link';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { SocialIcon } from "react-social-icons";
import 'react-social-icons/discord';
import 'react-social-icons/twitter';
import 'react-social-icons/github';


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
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
    
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <Container>
          <Navbar.Brand href="/">
            <img id="main-logo" src={logo} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            {/* <span className="navbar-toggler-icon"></span> */}
            <img className="navbar-toggler-icon-moblie" src={logo} alt="Logo" />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
              <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Projects</Nav.Link>
              <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Tools</Nav.Link>
            </Nav>
            <span className="navbar-text">
            <div className="icon">
                <SocialIcon className="box" target="_blank" bgColor="white" fgColor="purple" url="https://discord.com"/>
                <SocialIcon className="box" target="_blank" bgColor="white" fgColor="purple" url="https://linkedin.com/in/samiylo"/>
                <SocialIcon className="box" target="_blank" bgColor="white" fgColor="purple" url="https://github.com/samiylo"/>
            </div>
              <HashLink to='#connect'>
                <button className=" neon spotlight-pink liquid-button-inverse"><span className="letsConnectNav animated-border">Let’s Connect</span></button>
              </HashLink>
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    
  )
}
