// src/Pages/UserChatPage.jsx
import React, { useEffect, useState } from "react";
import UserList from "../Component/UserList";
import ChatBox from "./ChatBox";
import { getSocket } from "../SocketIo/Socket";

export default function UserChatPage() {
  const [receiver, setReceiver] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user || user;

  // ensure socket connection exists and announce online
  const socket = getSocket();
  if (user && user._id) socket.emit("userOnline", user._id);

  const handleUserSelect = (selectedUser) => {
    setReceiver(selectedUser);
    setShowChat(true); // Show chat on mobile when user is selected
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  useEffect(() => {}, []);

  return (
    <div className="chat-container">
      {/* User List - Hidden on mobile when chat is shown */}
      <div className={`user-list-section ${showChat ? 'hide-mobile' : ''}`}>
        <UserList onSelect={handleUserSelect} activeChat={receiver?._id} />
      </div>

      {/* Chat Section */}
      <div className={`chat-section ${!showChat ? 'hide-mobile' : ''}`}>
        {receiver ? (
          <>
            <div className="chat-header">
              {/* Back button for mobile */}
              <button className="back-btn" onClick={handleBackToList}>
                ←
              </button>

              {/* User name */}
              <h3 className="user-name">{receiver?.name || receiver?.userName}</h3>

              {/* User image */}
              <div className="user-image">
                <img
                  src={
                    receiver?.image
                      ? `http://localhost:3000/uploads/${receiver.image}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="user"
                />
              </div>
            </div>
            <ChatBox sender={senderId} receiver={receiver._id} />
          </>
        ) : (
          <div className="empty-state">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          height: 86vh;
          margin: 20px;
          gap: 0;
        }

        .user-list-section {
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .chat-section {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid #eee;
          gap: 12px;
        }

        .back-btn {
          display: none;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          color: #333;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: #007bff;
        }

        .user-name {
          flex: 1;
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .user-image {
          height: 50px;
          width: 50px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .user-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .empty-state {
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
        }

        .empty-state p {
          color: #666;
          font-size: 16px;
        }

        .hide-mobile {
          display: flex;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .chat-container {
            margin: 10px;
            height: calc(100vh - 80px);
          }

          .back-btn {
            display: block;
          }

          .user-list-section {
            position: absolute;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 10;
          }

          .chat-section {
            position: absolute;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 11;
          }

          .hide-mobile {
            display: none !important;
          }

          .user-name {
            font-size: 16px;
          }

          .user-image {
            height: 40px;
            width: 40px;
          }
        }

        @media (max-width: 480px) {
          .chat-container {
            margin: 5px;
          }

          .chat-header {
            padding: 12px;
          }

          .user-name {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}