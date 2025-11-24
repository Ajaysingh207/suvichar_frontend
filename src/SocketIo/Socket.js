
// import { io } from "socket.io-client";

// const SOCKET_URL = "http://localhost:3000";

// let socket;

// export const getSocket = () => {
//   if (!socket) {
//     socket = io(SOCKET_URL, {
//       withCredentials: true,
//     });
//   }
//   return socket;
// };

// src/SocketIo/Socket.js
import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io("http://localhost:3000", { withCredentials: true });
  }
  return socket;
}

export default getSocket;

