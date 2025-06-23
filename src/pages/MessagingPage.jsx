import React, { useState, useEffect } from "react";
import "./MessagingPage.css";
import Header from "./Header";

const MessagingPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "Alex",
      time: "4:36 PM",
      text: `Hi Sam - I'm Alex, your Airbnb Superhost Ambassador. I have hosted for almost 10 years, and live in San Francisco. I've also worked with hosts from all around the world. I'd be more than happy to help you with setting up your listing - just ask away!`,
    },
    {
      sender: "Alex",
      time: "4:37 PM",
      text: "Congratulations on publishing your listing. How can I help?",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    
    <div className={isDesktop ? "messaging-layout-desktop" : "messaging-container"}>
        
      {isDesktop ? (
       
        <>
          {/* Colonne 1 : Liste des messages */}
          
          <div className="sidebar">
            <h2>Messages</h2>
            <div className="conversation-preview">
              <img src="https://via.placeholder.com/40" alt="Alex" />
              <div>
                <strong>Alex</strong>
                <p>Cette conversation a été fermée...</p>
              </div>
            </div>
          </div>

          {/* Colonne 2 : Conversation */}
          <div className="conversation-desktop">
            <div className="header">
              <div className="profile-info">
                <img src="https://via.placeholder.com/40" alt="Alex" className="avatar" />
                <div>
                  <div className="name">Alex</div>
                  <div className="role">Superhost Ambassador</div>
                </div>
              </div>
            </div>

            <div className="conversation">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.sender === "You" ? "you" : "alex"}`}>
                  <div className="bubble">{msg.text}</div>
                </div>
              ))}
            </div>

            <div className="message-input">
              <button className="image-button">🖼️</button>
              <input
                type="text"
                placeholder="Write a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="send-button" onClick={handleSend}>Send</button>
            </div>
          </div>

          {/* Colonne 3 : Détails */}
          <div className="details">
            <h3>Détails</h3>
            <p><strong>Alex</strong></p>
            <p>Superhost basé à San Francisco. Disponible pour vous aider.</p>
          </div>
        </>
      ) : (
        <>
          {/* Version Mobile (inchangée) */}
          <div className="header">
            <button className="back-button">&larr;</button>
            <div className="profile-info">
              <img src="https://via.placeholder.com/40" alt="Alex" className="avatar" />
              <div>
                <div className="name">Alex</div>
                <div className="role">Superhost Ambassador</div>
              </div>
            </div>
            <button className="details-button">Details</button>
          </div>

          <div className="conversation">
            <div className="today">Today</div>
            <div className="matched-info">
              You’re now matched with Alex. <span className="link">Learn More</span>
            </div>

            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === "You" ? "you" : "alex"}`}>
                {msg.sender !== "You" && (
                  <img src="https://via.placeholder.com/30" alt="Alex" className="avatar-small" />
                )}
                <div className="bubble">{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="message-input">
            <button className="image-button">🖼️</button>
            <input
              type="text"
              placeholder="Write a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="send-button" onClick={handleSend}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagingPage;
