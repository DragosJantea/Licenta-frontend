import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css";

const vendorTypes = [
  "VENUES",
  "PHOTOGRAPHY",
  "DJS",
  "HAIR_AND_MAKEUP",
  "CATERING",
  "FLOWERS",
  "VIDEOGRAPHY",
];

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "client", // Default to client
    vendorType: "", // Vendor type, only used if role is vendor
    iban: "", // IBAN, only used if role is vendor
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
            iban: form.iban,
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
    <div className="page-container">
      <div className="card register-card">
        <div className="row no-gutters h-100">
          <div className="col-md-6">
            <img src="/crof.jpg" className="card-img" alt="Elegant Wedding" />
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="card-body">
              <h2 className="card-title text-center">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={form.email}
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
                {form.role === "vendor" && (
                  <>
                    <div className="form-group">
                      <select
                        name="vendorType"
                        value={form.vendorType}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="">Select Vendor Type</option>
                        {vendorTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="iban"
                        className="form-control"
                        placeholder="IBAN"
                        value={form.iban}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
                <p className="text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
