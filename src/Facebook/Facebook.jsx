import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Facebook() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const sendData = async (e) => {
    e.preventDefault();

    try {
    
      const response = await axios.post("http://localhost:3000/api/signup", {
        userName,
        password,
      });

      console.log( response.data);
      const token = response.token
      console.log(token);
      
      toast.success(response.data.message);
    } catch (error) {
      console.error(" Login failed:", error.response?.data || error.message);
      toast.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    }
    
  };

  return (
    <div>
      <form>
        <div className="container flex items-center justify-center mt-50  ">
          <div className="left  text-center w-1/4 mb-15">
            <img src="./fb.jpg" alt="Facebook logo" />
            <p className="text-2xl">
              Facebook helps you connect and share with the people in your life.
            </p>
          </div>
          <div className="right flex flex-col mx-30 w-1/4 bg-white  shadow-md  px-3 py-3 ">
            <input
              className=" px-2 my-2 h-12  border-2 border-gray-200   hover:border-blue-400"
              type="text"
              placeholder="Email address or Phone number"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
            <input
              className=" px-2 my-2 h-12  border-2 border-gray-200   hover:border-blue-400"
              type="text"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className=" my-2 py-2 bg-blue-600 rounded-md text-white text-2xl text-center hover:bg-blue-500 cursor-pointer"
              onClick={sendData}
            >
              Log in
            </button>
            <p className="py-2 text-center text-blue-400  hover:underline cursor-pointer">
              Forgotten password?
            </p>
            <hr className="my-2" />
            <button className="my-4 p-3 w-fit mx-auto   font-bold text-white rounded-md bg-green-400 hover:bg-green-300 cursor-pointer " onClick={()=>navigate("/registar")}>
              Create New Account
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
