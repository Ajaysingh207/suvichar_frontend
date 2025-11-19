// src/api.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // important for cookie auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
