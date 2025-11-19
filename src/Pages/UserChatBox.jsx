// src/pages/UserChatPage.jsx
import React, {   useState } from "react";
import UserList from "../Component/UserList";
import ChatBox from "../Pages/ChatBox";

export default function UserChatPage() {
  const [receiver, setReceiver] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));  
  const senderId = user;
  // useEffect(() => {
  //   // if no logged-in user, redirect to login (you can implement navigation)
  //   if (!senderId) {
  //     window.location.href = "/";
  //   }
  // }, [senderId]);

  return (
    <div style={{ display: "flex", height: "86vh", margin: 20, boxShadow: "0 0 6px rgba(0,0,0,0.08)" }}>
      <UserList onSelect={(u) => setReceiver(u)} />
      {receiver ? (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
            <h3>{receiver.name || receiver.userName}</h3>
          </div>
          <ChatBox sender={senderId} receiver={receiver._id} />
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
}
