import React, { useEffect, useState } from "react";
import { fetchUserById, fetchUsers } from "../Servieces/Service";
import { getSocket } from "../SocketIo/Socket";
import chatlogo from "../assets/chatlogo.avif";
import { FaAlignJustify } from "react-icons/fa";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { isLoggedIn } from "../Utils/auth";

export default function UserList({ onSelect, activeChat }) {
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [singleUser, setSingleUser] = useState(null);

  const socket = getSocket();
  const myId = JSON.parse(localStorage.getItem("user"));

  const loadMyData = async () => {
    if (!myId) return;
    const data = await fetchUserById(myId);
    setSingleUser(data?.user);
  };

  useEffect(() => {
    loadMyData();
  }, [myId]);

  // load all users
  useEffect(() => {
    const load = async () => {
      const data = await fetchUsers();
      let list = data.user || [];
      list = list.filter((u) => u._id !== myId);
      setUsers(list);
    };
    load();
  }, [myId]);

  // socket events
  useEffect(() => {
    if (!myId) return;
    socket.emit("userOnline", myId);

    socket.on("onlineUsers", (arr) => {
      const map = {};
      arr.forEach((id) => (map[id] = true));
      setOnlineUsers(map);
    });

    socket.on("typing", ({ from }) => {
      setTypingUsers((prev) => ({ ...prev, [from]: true }));
    });

    socket.on("stopTyping", ({ from }) => {
      setTypingUsers((prev) => ({ ...prev, [from]: false }));
    });

    socket.on("newMessageNotification", (payload) => {
      const from = payload.from;

      if (from !== activeChat) {
        setUnreadCounts((prev) => ({ ...prev, [from]: (prev[from] || 0) + 1 }));
      }

      setLastMessages((prev) => ({
        ...prev,
        [from]: { text: payload.message, createdAt: payload.createdAt },
      }));

      setUsers((prev) => {
        const user = prev.find((u) => u._id === from);
        if (!user) return prev;
        return [user, ...prev.filter((u) => u._id !== from)];
      });
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("newMessageNotification");
    };
  }, [socket, myId, activeChat]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      const otherId = msg.sender === myId ? msg.receiver : msg.sender;

      setLastMessages((prev) => ({
        ...prev,
        [otherId]: { text: msg.message, createdAt: msg.createdAt },
      }));

      if (msg.sender !== myId && activeChat !== msg.sender) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1,
        }));
      }

      setUsers((prev) => {
        const user = prev.find((u) => u._id === otherId);
        if (!user) return prev;
        return [user, ...prev.filter((u) => u._id !== otherId)];
      });
    });

    return () => socket.off("receiveMessage");
  }, [socket, activeChat, myId]);

  const handleSelect = (u) => {
    onSelect(u);
    setUnreadCounts((prev) => ({ ...prev, [u._id]: 0 }));
    setTypingUsers((prev) => ({ ...prev, [u._id]: false }));
  };

  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await axios.post(
      "http://localhost:3000/api/logout",
      {},
      { withCredentials: true }
    );

   
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    isLoggedIn(false)

    toast.success("Logged out");

    navigate("/");
  } catch (error) {
    toast.error("Logout failed");
    console.error("Logout error:", error);
  }
};


  return (
    <div style={{ width: 320, borderRight: "1px solid #eee", padding: 12 }}>
      <div className="flex " style={{ marginBottom: 10 }}>
        <img src={chatlogo} alt="logo" style={{ width: 80 }} />
        <p className="p- mx-4 my-4 text-2xl text-orange-500 font-bold">
          Suvichar
        </p>
        <FaAlignJustify
          size={22}
          className="cursor-pointer my-8 mx-2 "
          onClick={() => setOpen(!open)}
        />
      </div>
      <div className="flex items-center gap-4">
        {open && (
          <div
            className="absolute left-80 top-14 bg-white shadow-lg rounded-md w-40 p-2 z-50"
            style={{ zIndex: 50 }}
          >
            <ul className="flex flex-col gap-2">
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpenProfile(!openProfile)}
              >
                Profile
                {openProfile && (
                  <div
                    className="absolute left-130 top-100 bg-white shadow-lg rounded-md p-6 z-50 "
                    style={{ width: 400 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        height: 150,
                        width: 150,
                        borderRadius: "50%",
                        overflow: "hidden",
                        marginBottom: 10,
                      }}
                      className="mx-22"
                    >
                      <img
                        src={
                          singleUser?.image
                            ? `http://localhost:3000/uploads/${singleUser.image}`
                            : "https://via.placeholder.com/150"
                        }
                        alt="profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <p className="text-xl font-bold">
                      Name :{singleUser?.name}
                    </p>
                    <p className="text-xl font-bold">
                      Surname :{singleUser?.surname}
                    </p>
                    <div className=" flex justify-between">
                      <p className="mt-2 mb-2 text-gray-600 font-bold">
                        update profile picture
                      </p>

                      <Profile id={myId} onUploaded={loadMyData} />
                    </div>
                  </div>
                )}
              </li>

              <li className="p-2 hover:bg-gray-100 cursor-pointer">Settings</li>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* USERS LIST */}
      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => handleSelect(u)}
          style={{
            padding: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
            background: activeChat === u._id ? "#f8f8f8" : "transparent",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* ✅ User Profile Picture */}
            <div
              className="userimage"
              style={{
                height: "50px",
                width: "50px",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <img
                src={
                  u?.image
                    ? `http://localhost:3000/uploads/${u.image}`
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

            {/* Online dot + name section */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {/* Online dot */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: onlineUsers[u._id] ? "green" : "#bbb",
                }}
              />

              <div>
                <div style={{ fontWeight: 600 }}>{u.name || u.userName}</div>

                {/* Last Message */}
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  {lastMessages[u._id]?.text?.slice(0, 40) || "No messages yet"}
                </div>

                {/* Typing... */}
                {typingUsers[u._id] && (
                  <div style={{ fontSize: 12, color: "#0a84ff" }}>
                    typing...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Unread Count */}
          {unreadCounts[u._id] > 0 && (
            <div
              style={{
                background: "red",
                color: "white",
                padding: "4px 8px",
                borderRadius: 18,
                fontSize: 12,
                minWidth: 28,
                textAlign: "center",
              }}
            >
              {unreadCounts[u._id]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
