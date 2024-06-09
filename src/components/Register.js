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
    if (form.role === "client") {
      try {
        const response = await fetch("http://localhost:8080/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
          }),
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
    } else {
      console.log("Vendor registration selected, but not implemented.");
      // Handle vendor registration logic here when implemented
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
