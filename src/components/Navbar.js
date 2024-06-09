import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="header">
      <div className="logo"> {/* You can place your logo here */}</div>
      <nav>
        <ul>
          <li>
            <Link to="/alloffers">All Offers</Link>
          </li>
          <li>
            <Link to="/myactions">My Actions</Link>
          </li>
        </ul>
      </nav>
      <div className="contact-button">
        <button>Contact Us</button>
      </div>
    </header>
  );
};

export default Navbar;
