// src/api.js
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const API_BASE = apiUrl;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
