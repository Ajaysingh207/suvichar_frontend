import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import chatlogo from "../assets/chatlogo.avif"

import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";

export default function Facebook() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();
 const apiUrl = import.meta.env.VITE_API_URL;


  const sendData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/signup`,
        { userName, password },
        { withCredentials: true }
      );

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);
        setAuthenticated(true);
      }

      if (response.data.role === "user") navigate("/user/chat");
      else if (response.data.role === "admin") navigate("/admin");
      else navigate("/user/chat");

      toast.success(response.data.message || "Logged in");
    } catch (error) {
      toast.error("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form onSubmit={sendData} className="w-full max-w-6xl">
        <Box className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10">

          {/* Left Section */}
          <Box className="text-center md:text-left max-w-md">
            <img src={chatlogo} alt="Facebook logo" className="w-48 mx-auto md:mx-0" />
            <Typography variant="h5" className="mt-4 text-orange-700 font-semibold">
              Suvichar helps you connect and share with the people in your life.
            </Typography>
          </Box>

          {/* Right Section (Login Card) */}
          <Paper elevation={4} className="p-6 w-full max-w-sm rounded-lg">
            <TextField
              label="Email address or Phone number"
              variant="outlined"
              fullWidth
              className="my-3"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              className="my-3"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              className="!bg-blue-600 hover:!bg-blue-500 text-lg font-bold my-3 py-2"
            >
              Log In
            </Button>

            <Typography
              className="text-center text-blue-600 hover:underline cursor-pointer"
              onClick={() => alert("Password recovery")}
            >
              Forgotten password?
            </Typography>

            <Divider className="my-4" />

            <Button
              fullWidth
              variant="contained"
              className="!bg-green-500 hover:!bg-green-400 font-bold py-2"
              onClick={() => navigate("/registar")}
            >
              Create New Account
            </Button>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}
