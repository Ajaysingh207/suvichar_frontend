// src/Pages/UserChatPage.jsx
import React, { useEffect, useState } from "react";
import UserList from "../Component/UserList";
import ChatBox from "./ChatBox";
import { getSocket } from "../SocketIo/Socket";
import { FaAlignJustify } from "react-icons/fa";
// import image from "../assets/micro.svg";

export default function UserChatPage() {
  const [receiver, setReceiver] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user || user;

  // ensure socket connection exists and announce online
  const socket = getSocket();
  if (user && user._id) socket.emit("userOnline", user._id);


  useEffect(() => {});
  return (
    <div style={{ display: "flex", height: "86vh", margin: 20 }}>
      <UserList onSelect={setReceiver} activeChat={receiver?._id} />
      <div style={{ flex: 1 }}>
        {receiver ? (
          <>
            <div
              className="flex items-center justify-between p-4"
              style={{ borderBottom: "1px solid #eee" }}
            >
              {/* Left side: user name */}
              <h3>{receiver?.name || receiver?.userName}</h3>

              {/* Right side: image + icon */}
              <div className="flex items-center gap-4">
                <div
                  className="userimage"
                  style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "50%",
                    backgroundColor: "green",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                     receiver?.image
                        ? `http://localhost:3000/uploads/${receiver.image}`
                        : "https://via.placeholder.com/150"
                    }
                    alt="user"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
            <ChatBox sender={senderId} receiver={receiver._id} />
          </>
        ) : (
          <div
            style={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
