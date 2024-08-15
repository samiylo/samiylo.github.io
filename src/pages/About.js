import React from "react";
import StorePicture from "../assets/store-picture.png";
import "../styles/About.css";
function About() {
  return (
    <div className="about">
      <div
        className="aboutTop"
        style={{ backgroundImage: `url(${StorePicture})` }}
      ></div>
      <div className="aboutBottom">
        <h1 style={{color: "white"}}> ABOUT US</h1>
        <p>
        Our mission is to empower individuals and organizations by providing accessible, open source tools designed to streamline processes, foster innovation, and enhance productivity. We believe in the transformative power of collaboration and aim to cultivate a vibrant community where developers, enthusiasts, and users can come together to solve problems and create solutions. By sharing our expertise and resources openly, we strive to democratize access to technology, enabling anyone, regardless of background or resources, to leverage cutting-edge tools to achieve their goals. Whether it's simplifying complex tasks, accelerating development cycles, or promoting transparency and accountability, we are committed to making a meaningful impact and helping others thrive in the digital age. Join us on our journey to build a more inclusive and equitable future through the power of open source.
        </p>
      </div>
    </div>
  );
}

export default About;
