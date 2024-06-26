import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateOfferForm.css";

const vendorTypesWithMaxAttendees = ["VENUES"];

const CreateOfferForm = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [vendorType, setVendorType] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    maxAttendees: "",
    price: "",
    address: "",
    availableDates: [], // New field for available dates
  });
  const [image, setImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // State for the date picker
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchVendorType = async () => {
      try {
        const response = await fetch("http://localhost:8080/vendors/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVendorType(data.vendorType);
        } else {
          console.error("Failed to fetch vendor type");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (auth) {
      fetchVendorType();
    }
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear the error message for the field being edited
    setErrors({ ...errors, [name]: "" });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (!value) {
      setErrors({ ...errors, [name]: "You must provide a valid response." });
    }
  };

  const handleDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key] && key !== "maxAttendees" && key !== "availableDates") {
        newErrors[key] = "You must provide a valid response.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!vendorTypesWithMaxAttendees.includes(vendorType)) {
      form.maxAttendees = -1;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("offer", JSON.stringify(form));

    try {
      const response = await fetch("http://localhost:8080/vendors/me/offers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Offer created successfully");
        navigate("/myoffers");
      } else {
        console.error("Failed to create offer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addAvailableDate = () => {
    if (selectedDate) {
      setForm((prevForm) => ({
        ...prevForm,
        availableDates: [...prevForm.availableDates, selectedDate],
      }));
      setSelectedDate(null); // Clear the date picker
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
  });

  return (
    <div className="page-container">
      <div className="card create-offer-card">
        <div className="card-content">
          <div className="image-container">
            <img src="/wed2.jpg" className="card-img" alt="Create Offer" />
          </div>
          <div className="form-container">
            <h2 className="card-title text-center">Create Offer</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Offer Name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-control"
                />
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>
              <div className="form-group">
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-control"
                ></textarea>
                {errors.description && (
                  <small className="text-danger">{errors.description}</small>
                )}
              </div>
              {vendorTypesWithMaxAttendees.includes(vendorType) && (
                <div className="form-group">
                  <input
                    type="number"
                    name="maxAttendees"
                    placeholder="Max Attendees"
                    value={form.maxAttendees}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                  />
                  {errors.maxAttendees && (
                    <small className="text-danger">{errors.maxAttendees}</small>
                  )}
                </div>
              )}
              <div className="form-group">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-control"
                />
                {errors.price && (
                  <small className="text-danger">{errors.price}</small>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-control"
                />
                {errors.address && (
                  <small className="text-danger">{errors.address}</small>
                )}
              </div>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                {image ? (
                  <p>{image.name}</p>
                ) : (
                  <p>Drag 'n' drop an image here, or click to select one</p>
                )}
              </div>
              <div className="date-picker">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select available date"
                  className="form-control"
                />
                <button
                  type="button"
                  onClick={addAvailableDate}
                  className="btn btn-primary"
                >
                  Add Date
                </button>
              </div>
              <ul>
                {form.availableDates.map((date, index) => (
                  <li key={index}>{date.toLocaleDateString()}</li>
                ))}
              </ul>
              <button type="submit" className="btn btn-primary">
                Create Offer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOfferForm;
