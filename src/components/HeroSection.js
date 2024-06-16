import React from "react";
import "../App.css";
import heroImage from "../images/image.png";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-image">
        <img src={heroImage} alt="Wedding" />{" "}
      </div>
      <div className="hero-text">
        <h3>Planned to perfection</h3>
        <h1>Extraordinary Weddings Don’t Just Happen, It’s Planned</h1>
        <div className="hero-buttons"></div>
        <div className="image-carousel">{}</div>
      </div>
    </section>
  );
};

export default HeroSection;
