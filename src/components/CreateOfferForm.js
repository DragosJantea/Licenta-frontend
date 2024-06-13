import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDropzone } from 'react-dropzone';
import "./CreateOfferForm.css";

const CreateOfferForm = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    maxAttendees: "",
    schedules: [
      {
        name: "",
        startDate: "",
        endDate: "",
        weekDay: "",
        startTime: "",
        endTime: "",
      },
    ],
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedules = form.schedules.map((schedule, i) =>
      i === index ? { ...schedule, [name]: value } : schedule
    );
    setForm({ ...form, schedules: newSchedules });
  };

  const addSchedule = () => {
    setForm({
      ...form,
      schedules: [
        ...form.schedules,
        {
          name: "",
          startDate: "",
          endDate: "",
          weekDay: "",
          startTime: "",
          endTime: "",
        },
      ],
    });
  };

  const handleDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    formData.append('offer', JSON.stringify(form));

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
        navigate("/myoffers"); // Redirect to My Offers page
      } else {
        console.error("Failed to create offer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
  });

  return (
    <div className="create-offer-form">
      <h2>Create Offer</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Offer Name"
          value={form.name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        ></textarea>
        <input
          type="number"
          name="maxAttendees"
          placeholder="Max Attendees"
          value={form.maxAttendees}
          onChange={handleChange}
        />
        <h3>Schedules</h3>
        {form.schedules.map((schedule, index) => (
          <div key={index} className="schedule">
            <input
              type="text"
              name="name"
              placeholder="Schedule Name"
              value={schedule.name}
              onChange={(e) => handleScheduleChange(index, e)}
            />
            <input
              type="date"
              name="startDate"
              value={schedule.startDate}
              onChange={(e) => handleScheduleChange(index, e)}
            />
            <input
              type="date"
              name="endDate"
              value={schedule.endDate}
              onChange={(e) => handleScheduleChange(index, e)}
            />
            <input
              type="text"
              name="weekDay"
              placeholder="Week Day"
              value={schedule.weekDay}
              onChange={(e) => handleScheduleChange(index, e)}
            />
            <input
              type="time"
              name="startTime"
              value={schedule.startTime}
              onChange={(e) => handleScheduleChange(index, e)}
            />
            <input
              type="time"
              name="endTime"
              value={schedule.endTime}
              onChange={(e) => handleScheduleChange(index, e)}
            />
          </div>
        ))}
        <button type="button" onClick={addSchedule}>
          Add Schedule
        </button>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {image ? (
            <p>{image.name}</p>
          ) : (
            <p>Drag 'n' drop an image here, or click to select one</p>
          )}
        </div>
        <button type="submit">Create Offer</button>
      </form>
    </div>
  );
};

export default CreateOfferForm;
