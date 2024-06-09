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
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry.
        </p>
        <div className="hero-buttons">
          <button className="call-button">(406) 555-0120</button>
          <button className="video-button">Play Video</button>
        </div>
        <div className="image-carousel">{}</div>
      </div>
    </section>
  );
};

export default HeroSection;
