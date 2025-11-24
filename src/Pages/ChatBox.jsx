// src/Pages/ChatBox.jsx
import React, { useEffect, useRef, useState } from "react";
import { fetchMessages } from "../Servieces/Service";
import { getSocket } from "../SocketIo/Socket";

export default function ChatBox({ sender, receiver, onMessagesLoaded }) {
  const [messages, setMessages] = useState([]); 
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const socket = getSocket();
  const scrollContainerRef = useRef(null);

  // Utility: scroll container to bottom
  const scrollToBottom = () => {
    const el = scrollContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // Join room and attach socket listeners (clean listeners first)
  useEffect(() => {
    if (!sender || !receiver) return;

    // join deterministic room
    socket.emit("joinRoom", { senderId: sender, receiverId: receiver });

    // cleanup prior listeners to avoid duplication
    socket.off("receiveMessage");
    socket.off("typing");
    socket.off("stopTyping");
    socket.off("messageSeenUpdate");

    // Receive a message (server emits saved message object)
    const handleReceive = (msg) => {
      // only add messages relevant to this conversation
      if (
        (msg.sender === sender && msg.receiver === receiver) ||
        (msg.sender === receiver && msg.receiver === sender)
      ) {
        setMessages((prev) => {
          // avoid duplicate insertion if message already exists (by _id)
          if (msg._id && prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, { ...msg, seenBy: msg.seenBy || [] }];
        });
      }
    };

    socket.on("receiveMessage", handleReceive);

    // Typing indicators
    socket.on("typing", ({ from }) => {
      if (from === receiver) setIsTyping(true);
    });
    socket.on("stopTyping", ({ from }) => {
      if (from === receiver) setIsTyping(false);
    });

    // Message seen updates: server will broadcast {messageId, seenBy, chatWith}
    socket.on("messageSeenUpdate", ({ messageId, seenBy }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? {
                ...m,
                seenBy: Array.isArray(m.seenBy)
                  ? Array.from(new Set([...(m.seenBy || []), seenBy]))
                  : [seenBy],
              }
            : m
        )
      );
    });

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageSeenUpdate");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sender, receiver]);

  // Load chat history from REST (GET) when opening chat
  useEffect(() => {
    const load = async () => {
      if (!sender || !receiver) return;

      try {
        const data = await fetchMessages(sender, receiver);
        const list = Array.isArray(data) ? data : data.messages || [];

        // Normalize messages: ensure seenBy arrays exist
        const normalized = list.map((m) => ({ ...m, seenBy: m.seenBy || [] }));
        setMessages(normalized);
        onMessagesLoaded && onMessagesLoaded(normalized);

        // Mark all messages FROM the other user as seen
        // Emit messageSeen for each message that was sent by the other user (receiver)
        normalized
          .filter((m) => m.sender === receiver && m._id) // these are messages I received
          .forEach((m) => {
            socket.emit("messageSeen", { messageId: m._id, seenBy: sender, chatWith: receiver });
          });

        // scroll after loading
        setTimeout(scrollToBottom, 50);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sender, receiver]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing emitter (send to other user)
  useEffect(() => {
    if (!sender || !receiver) return;
    let timeout;
    if (text.length > 0) {
      socket.emit("typing", { from: sender, to: receiver });
      // debounce stopTyping
      timeout = setTimeout(() => {
        socket.emit("stopTyping", { from: sender, to: receiver });
      }, 800);
    } else {
      socket.emit("stopTyping", { from: sender, to: receiver });
    }
    return () => clearTimeout(timeout);
  }, [text, sender, receiver, socket]);

  // SEND message -> use socket only (server will save & broadcast)
  const handleSend = async () => {
    if (!text.trim() || !sender || !receiver) return;

    const payload = { sender, receiver, message: text.trim() };

    try {
      // emit to server socket; server will save and broadcast saved message back as 'receiveMessage'
      socket.emit("sendMessage", payload);

      // Clear input immediately (do not append locally; server will broadcast the saved message)
      setText("");

      // optional: you could optimistically push a local temporary message with a temp id,
      // then replace it when server sends real saved message. Here we keep UI driven by server.
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  // Render
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Header */}
      <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 600 }}>Chat</div>
          <div style={{ color: "#666", fontSize: 12 }}>{isTyping ? "Typing..." : ""}</div>
        </div>
      </div>

      {/* Messages container: flex child with overflow */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          minHeight: "60vh",
          // ensure the parent layout gives height; use calc to leave space for header+input if needed
          maxHeight: "calc(90vh - 180px)",
          boxSizing: "border-box",
        }}
      >
        {messages.map((m) => {
          const isMine = m.sender === sender;
          const seenByList = Array.isArray(m.seenBy) ? m.seenBy : m.seenBy ? [m.seenBy] : [];

          // double-tick condition: message was sent by me and the other user (receiver) is in seenByList
          const doubleTick = isMine && seenByList.includes(receiver);

          return (
            <div
              key={m._id || `${m.sender}-${m.createdAt}`}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                margin: "6px 0",
                  
              }}
            >
              <div
                style={{
                  background: isMine ? "#DCF8C6" : "#fff",
                  padding: 10,
                  borderRadius: 10,
                  maxWidth: "70%",
                
                  wordBreak: "break-word",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ fontSize: 18 }}>{m.message}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#666",
                    marginTop: 6,
                    textAlign: "right",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <span>{new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {isMine ? <span>{doubleTick ? "✔✔" : "✔"}</span> : null}
                </div>
              </div>
            </div>
          );
        })}
        <div />
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: "1px solid #eee", display: "flex", gap: 8  }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: 10 }}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: "#0b84ff",
            color: "white",
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
