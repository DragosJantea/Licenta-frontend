import React from "react";
import HeroSection from "./components/HeroSection";
import Layout from "./components/Layout";
import "./App.css";
import AllOffers from "./components/AllOffers";
import MyActions from "./components/MyActions";
import MyOffers from "./components/MyOffers";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateOfferForm from "./components/CreateOfferForm";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/alloffers" element={<AllOffers />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/myactions" element={<MyActions />} />
              <Route path="/myoffers" element={<MyOffers />} />
              <Route path="/createoffer" element={<CreateOfferForm />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
