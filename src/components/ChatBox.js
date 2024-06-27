import React, { useState, useEffect } from "react";
import "./ChatBox.css";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { auth, role, logout } = useAuth();

  const handlePromptChange = (value) => {
    setInput(value);
  };

  const sendMessage = async (updatedMessages) => {
    try {
      const response = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSendMessage = () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    console.log("New Messages: ", newMessages);
    sendMessage(newMessages);
  };

  useEffect(() => {
    console.log("Chat context updated:", messages);
  }, [messages]);

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => handlePromptChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
