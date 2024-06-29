import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "client", // Default role
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleChange = (e) => {
    setForm({ ...form, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      form.role === "client"
        ? "http://localhost:8080/clients/sessions"
        : "http://localhost:8080/vendors/sessions";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful", data);
        login(data.jwt, form.role); // Save the JWT token and role in context
        navigate("/"); // Redirect to the home page or another protected page
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="page-container">
      <div className="card login-card">
        <div className="row no-gutters h-100">
          <div className="col-md-6">
            <img src="/crof.jpg" className="card-img" alt="Elegant Wedding" />
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    name="username"
                    className="form-control"
                    placeholder="Email"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group role-selection">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="clientRole"
                      value="client"
                      checked={form.role === "client"}
                      onChange={handleRoleChange}
                    />
                    <label className="form-check-label" htmlFor="clientRole">
                      Client
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="vendorRole"
                      value="vendor"
                      checked={form.role === "vendor"}
                      onChange={handleRoleChange}
                    />
                    <label className="form-check-label" htmlFor="vendorRole">
                      Vendor
                    </label>
                  </div>
                </div>
                <p className="text-center">
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
                <button type="submit" className="btn btn-primary btn-block">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
