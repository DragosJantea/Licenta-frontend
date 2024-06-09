import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "client", // Default to client
    vendorType: "", // Vendor type, only used if role is vendor
  });

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
        ? "http://localhost:8080/clients"
        : "http://localhost:8080/vendors";
    const body =
      form.role === "client"
        ? {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
          }
        : {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            vendorType: form.vendorType,
          };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful", data);
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
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
        {form.role === "vendor" && (
          <input
            type="text"
            name="vendorType"
            placeholder="Vendor Type (e.g., VENUES)"
            value={form.vendorType}
            onChange={handleChange}
          />
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
