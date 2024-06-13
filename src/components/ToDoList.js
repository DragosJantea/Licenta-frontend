import React, { useState, useEffect } from "react";
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
    <div className="to-do-list">
      <h2>To-Do List</h2>
      <ul>
        {vendorTypes.map((type) => (
          <li key={type}>
            <label>
              <input
                type="checkbox"
                checked={checkedItems.has(type)}
                onChange={() => handleCheckboxChange(type)}
              />
              {type}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
