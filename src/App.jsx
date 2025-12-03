import React from "react";
import Facebook from "./Facebook/Facebook";
import Fbregistar from "./Facebook/Fbregistar";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import UserChatPage from "./Pages/UserChatBox";
import Appbar from "./Pages/Admin/Appbar";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
         <Route path="/" element={<Facebook />} /> 
        <Route path="/registar" element={<Fbregistar />} />
        <Route
          path="/user/chat"
          element={
            <PrivateRoute>
              <UserChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/appbar"
          element={
            <PrivateRoute>
              <Appbar />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/not-authorized"
          element={<h1>You cannot access this page</h1>}
        />
      </Routes>
    </div>
  );
}
