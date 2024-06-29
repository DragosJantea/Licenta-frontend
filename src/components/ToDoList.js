import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ToDoList.css";

const vendorTypes = [
  "VENUES",
  "PHOTOGRAPHY",
  "DJS",
  "HAIR_AND_MAKEUP",
  "CATERING",
  "FLOWERS",
  "VIDEOGRAPHY",
];

const ToDoList = () => {
  const [checkedItems, setCheckedItems] = useState(new Set());

  useEffect(() => {
    const savedToDoList = localStorage.getItem("toDoList");
    if (savedToDoList) {
      setCheckedItems(new Set(JSON.parse(savedToDoList)));
    }
  }, []);

  const handleCheckboxChange = (type) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = new Set(prevCheckedItems);
      if (newCheckedItems.has(type)) {
        newCheckedItems.delete(type);
      } else {
        newCheckedItems.add(type);
      }
      localStorage.setItem(
        "toDoList",
        JSON.stringify(Array.from(newCheckedItems))
      );
      return newCheckedItems;
    });
  };

  return (
    <div className="page-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="to-do-list card shadow-lg">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src="/wed2.jpg"
              alt="Placeholder"
              className="img-fluid rounded-start"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h2 className="card-title text-center text-primary">
                To-Do List
              </h2>
              <ul className="list-group list-group-flush">
                {vendorTypes.map((type) => (
                  <li key={type} className="list-group-item">
                    <label className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={checkedItems.has(type)}
                        onChange={() => handleCheckboxChange(type)}
                      />
                      <span>{type}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
