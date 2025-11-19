// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
    });
  }
  return socket;
};
