import React, { useEffect, useState } from "react";
import { fetchUsers } from "../Servieces/Service";

export default function UserList({ onSelect }) {
  const [users, setUsers] = useState([]);
  const me = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const load = async () => {
      try {
        
        const data = await fetchUsers();
        let list = data.user
        setUsers(list.filter(u => u._id !== me));
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    load();
  }, []);

  return (
    <div style={{ width: 280, borderRight: "1px solid #eee", padding: 12 }}>
      <h3>People</h3>
      {users.map(u => (
        <div key={u._id} style={{ padding: 8, cursor: "pointer" }} onClick={() => onSelect(u)}>
          <strong>{u.name || u.userName}</strong>
          <div style={{ fontSize: 12, color: "#666" }}>{u.userName}</div>
        </div>
      ))}
    </div>
  );
}
