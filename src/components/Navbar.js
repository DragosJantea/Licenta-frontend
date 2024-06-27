// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import "./Navbar.css";

const Navbar = () => {
  const { auth, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (auth) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <nav>
        <ul className="nav-links">
          {role === "client" && auth && (
            <li>
              <Link to="/alloffers">All Offers</Link>
            </li>
          )}
          {role === "vendor" && auth && (
            <li>
              <Link to="/myoffers">Offers</Link>
            </li>
          )}
          {role === "vendor" && auth && (
            <li>
              <Link to="/createoffer">Create Offer</Link>
            </li>
          )}
          {role === "client" && auth && (
            <li>
              <Link to="/todolist">Checklist</Link>
            </li>
          )}
          {auth && (
            <li>
              <Link to="/myactions">Requests</Link>
            </li>
          )}
          {/* {!auth && (
            <li>
              <Link to="/register">Register</Link>
            </li>
          )} */}
          <li>
            <button className="auth-button" onClick={handleAuthAction}>
              {auth ? "Logout" : "Login"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
