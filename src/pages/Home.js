import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <div className="headerContainer">
      <h1 style={{ color: "white" }}>opnCore</h1>
        <p style={{ color: "white" }}> TOOLS FOR GOOD </p>
        <Link to="/about">
          <button> CONTACT US </button>
        </Link>
      </div>

      <div id="top-container">
        <div id="ai-container" className="round-corners">
          
        </div>

        <div id="web-app-container" className="round-corners">
          
        </div>

        <div id="web-app-container" className="round-corners">
          
          </div>
  
          <div id="ai-container" className="round-corners">
            
          </div>
  

      </div>
    </div>
  );
}

export default Home;
