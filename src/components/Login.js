import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import { Link } from "react-router-dom";

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
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="username"
          placeholder="Email"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="client"
              checked={form.role === "client"}
              onChange={handleRoleChange}
            />
            Client
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="vendor"
              checked={form.role === "vendor"}
              onChange={handleRoleChange}
            />
            Vendor
          </label>
        </div>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
