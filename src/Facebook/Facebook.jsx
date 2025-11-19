// src/pages/Login.jsx
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Facebook() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const sendData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/signup",
        { userName, password },
        { withCredentials: true }
      );
   
   
      // Expect backend to return response.data.user (with _id)
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      if (response.data.role === "user") navigate("/user/chat");
      else if (response.data.role === "admin") navigate("/admin");
      else navigate("/user/chat");

      toast.success(response.data.message || "Logged in");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <form>
        <div className="container flex items-center justify-center mt-8">
          <div className="left text-center w-1/4 mb-6">
            <img src="./fb.jpg" alt="Facebook logo" />
            <p className="text-2xl">
              Facebook helps you connect and share with the people in your life.
            </p>
          </div>

          <div className="right flex flex-col mx-4 w-1/4 bg-white shadow-md p-4">
            <input
              className="px-2 my-2 h-12 border-2 border-gray-200 hover:border-blue-400"
              type="text"
              placeholder="Email address or Phone number"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
            <input
              className="px-2 my-2 h-12 border-2 border-gray-200 hover:border-blue-400"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="my-2 py-2 bg-blue-600 rounded-md text-white text-2xl hover:bg-blue-500"
              onClick={sendData}
            >
              Log in
            </button>
            <p className="py-2 text-center text-blue-400 hover:underline cursor-pointer">
              Forgotten password?
            </p>
            <hr className="my-2" />
            <button
              type="button"
              className="my-4 p-3 w-fit mx-auto font-bold text-white rounded-md bg-green-400 hover:bg-green-300"
              onClick={() => navigate("/registar")}
            >
              Create New Account
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
