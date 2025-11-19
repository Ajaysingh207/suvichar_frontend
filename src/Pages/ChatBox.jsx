import React, { useEffect, useRef, useState } from "react"; 
import { fetchMessages, sendMessageApi } from "../Servieces/Service";
import { getSocket as socketSingleton } from "../SocketIo/Socket";

export default function ChatBox({ sender, receiver }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();
  const socket = socketSingleton();

  useEffect(() => {
    if (!sender || !receiver) return;

    // Join chat room
    socket.emit("joinRoom", { senderId: sender, receiverId: receiver });

    // Receive messages
    
    socket.on("receiveMessage", (msg) => {
    
      if (
        (msg.sender === sender && msg.receiver === receiver) ||
        (msg.sender === receiver && msg.receiver === sender)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [sender, receiver, socket]);

  // Load old messages from DB
  useEffect(() => {
    const load = async () => {
      if (!sender || !receiver) return;
      const data = await fetchMessages(sender, receiver);
      setMessages(data);
    };
    load();
  }, [sender, receiver]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!text.trim()) return;

    const payload = {
      sender,
      receiver,
      message: text,
    };

    try {
      // Save message in DB
      await sendMessageApi(payload);

      // Emit socket event
      socket.emit("sendMessage", payload);

      // Clear input
      setText("");
    } catch (err) {
      console.error("Send message error", err);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 12 }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.sender === sender ? "flex-end" : "flex-start",
              margin: "6px 0",
            }}
          >
            <div
              style={{
                background: m.sender === sender ? "#DCF8C6" : "#fff",
                padding: 10,
                borderRadius: 10,
                maxWidth: "70%",
              }}
            >
              {m.message}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: 10 }}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} style={{ padding: "10px 16px" }}>
          Send
        </button>
      </div>
    </div>
  );
}
