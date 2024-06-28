import React from "react";
import "./HeroSection.css"; // Update the path if necessary

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-video">
        <video src="/videos/recording.mp4" autoPlay loop muted />
      </div>
      <div className="hero-text">
        <h3>Planned to perfection</h3>
        <h1>Extraordinary Weddings Don’t Just Happen, It’s Planned</h1>
      </div>
    </section>
  );
};

export default HeroSection;
