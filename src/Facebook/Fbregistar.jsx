// src/pages/Register.jsx
import React, { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";

export default function Fbregistar() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [day, setDay] = useState("16");
  const [month, setMonth] = useState("Nov");
  const [year, setYear] = useState("2005");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, surname, day, month, year, gender, userName: email, password };
    try {
      const res = await api.post("/registar", formData);
      toast.success(res.data.message || "Registered");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="shadow-lg rounded-2xl bg-white p-6 w-full max-w-xl">
        <div className="text-center mb-4">
          <p className="text-3xl font-bold mb-0">Create a new account</p>
          <span className="text-gray-600">It's quick and easy.</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <TextField label="Name" size="small" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Surname" size="small" value={surname} onChange={(e) => setSurname(e.target.value)} />
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-3 gap-3 mt-1">
              <TextField select size="small" value={day} onChange={(e) => setDay(e.target.value)}>
                {[...Array(31)].map((_, i) => <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>)}
              </TextField>
              <TextField select size="small" value={month} onChange={(e) => setMonth(e.target.value)}>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <TextField select size="small" value={year} onChange={(e) => setYear(e.target.value)}>
                {Array.from({ length: 120 }, (_, i) => 2025 - i).map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </TextField>
            </div>
          </div>

          <div className="mb-4">
            <label>Gender</label>
            <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="custom" control={<Radio />} label="Custom" />
            </RadioGroup>
          </div>

          <div className="mb-4">
            <TextField label="Mobile number or email address" size="small" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-5">
            <TextField label="Password" type="password" size="small" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="flex justify-center">
            <Button type="submit" variant="contained" size="large" sx={{ backgroundColor: "#00a400" }}>
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
