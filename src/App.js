import React from "react";
import HeroSection from "./components/HeroSection";
import Layout from "./components/Layout";
import "./App.css";
import AllOffers from "./components/AllOffers";
import Register from "./components/Register";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/alloffers" element={<AllOffers />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
