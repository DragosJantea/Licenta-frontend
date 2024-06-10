import React from "react";
import "./Offer.css";

const Offer = ({ offer }) => {
  return (
    <div className="offer">
      <h3>{offer.name}</h3>
      <p>{offer.description}</p>
      <h4>Schedules:</h4>
      <ul>
        {offer.schedules.map((schedule, index) => (
          <li key={index}>
            <strong>{schedule.name}:</strong> {schedule.startDate} to{" "}
            {schedule.endDate}, {schedule.weekDay}, {schedule.startTime} to{" "}
            {schedule.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Offer;
