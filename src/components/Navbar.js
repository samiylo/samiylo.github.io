import React, { useState } from "react";
import Logo from "../assets/opnCore.png";
import { Link } from "react-router-dom";
import ReorderIcon from "@material-ui/icons/Reorder";
import "../styles/Navbar.css";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };
  return (
    <div className="navbar-container">
    <div className="navbar">
    <img className="main-logo" alt="Logo" src={Logo} />
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        {/* <img className="main-logo" alt="Logo" src={Logo} /> */}
        <div className="hiddenLinks">
          <Link to="/"> Home </Link>
          
          <Link to="/about"> About </Link>
          <Link to="/contact"> Contact </Link>
        </div>
      </div>
      <div className="rightSide">
        <Link className="jiggle-on-hover" to="/"> Home </Link>
        
        <Link className="jiggle-on-hover" to="/about"> About </Link>
        <Link className="jiggle-on-hover" to="/contact"> Contact </Link>
        <button onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
    </div>
  );
}

export default Navbar;
