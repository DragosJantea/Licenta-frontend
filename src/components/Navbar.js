import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { auth, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (auth) {
      logout();
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="header">
      <div className="logo"> {/* You can place your logo here */}</div>
      <nav>
        <ul>
          {role === "client" && (
            <li>
              <Link to="/alloffers">All Offers</Link>
            </li>
          )}
          {role === "vendor" && (
            <li>
              <Link to="/myoffers">My Offers</Link>
            </li>
          )}
          <li>
            <Link to="/myactions">My Actions</Link>
          </li>
          {!auth && (
            <li>
              <Link to="/register">Register</Link>
            </li>
          )}
          <li>
            <button className="auth-button" onClick={handleAuthAction}>
              {auth ? "Logout" : "Login"}
            </button>
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
