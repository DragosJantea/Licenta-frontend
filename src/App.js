import React from "react";
import HeroSection from "./components/HeroSection";
import Layout from "./components/Layout";
import "./App.css";
import AllOffers from "./components/AllOffers";
import Register from "./components/Register";
import Login from "./components/Login";
import MyOffers from "./components/MyOffers";
import CreateOfferForm from "./components/CreateOfferForm";
import MyActions from "./components/MyActions";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ToDoList from "./components/ToDoList";
import OfferDetails from "./components/OfferDetails";

const App = () => {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/alloffers" element={<AllOffers />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/myoffers" element={<MyOffers />} />
              <Route path="/createoffer" element={<CreateOfferForm />} />
              <Route path="/myactions" element={<MyActions />} />
              <Route path="/todolist" element={<ToDoList />} />
              <Route path="/offers/:id" element={<OfferDetails />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
