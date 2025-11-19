import React from "react";
import Facebook from "./Facebook/Facebook";
import Microsoft from "./Microsoft/Microsoft"; 
import Fbregistar from "./Facebook/Fbregistar";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import UserChatPage from "./Pages/UserChatBox";

import Appbar from "./Pages/Admin/Appbar";

export default function App() {
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<Facebook />} />
        <Route path="/microsoft" element={<Microsoft />} />
        <Route path="/registar" element={<Fbregistar />} />
        <Route path="/admin" element={<AdminDashboard />} />
       <Route path="/user/chat" element={<UserChatPage />} />
        <Route path="/appbar" element={< Appbar/>} />
      </Routes>
    </div>
  );
}



 



// import React from "react";

// export default function App() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
//       <div className="container flex flex-col lg:flex-row items-center justify-center gap-10 mt-10">
        
//         {/* LEFT SECTION */}
//         <div className="left text-center lg:text-left lg:w-1/3 mb-10 lg:mb-0">
//           <img
//             src="./fb.jpg"
//             alt="Facebook logo"
//             className="mx-auto lg:mx-0 mb-6 w-40 md:w-48"
//           />
//           <p className="text-xl md:text-2xl text-gray-700">
//             Facebook helps you connect and share with the people in your life.
//           </p>
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="right flex flex-col bg-white shadow-md p-6 rounded-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
//           <input
//             className="px-3 my-2 h-12 border-2 border-gray-200 rounded-md focus:border-blue-400 outline-none"
//             type="text"
//             placeholder="Email address or Phone number"
//           />
//           <input
//             className="px-3 my-2 h-12 border-2 border-gray-200 rounded-md focus:border-blue-400 outline-none"
//             type="password"
//             placeholder="Password"
//           />
//           <button className="my-3 py-3 bg-blue-600 rounded-md text-white text-xl font-semibold hover:bg-blue-500">
//             Log in
//           </button>
//           <p className="py-2 text-center text-blue-500 hover:underline cursor-pointer">
//             Forgotten password?
//           </p>
//           <hr className="my-3" />
//           <button className="my-3 py-3 px-4 mx-auto font-bold text-white rounded-md bg-green-500 hover:bg-green-400">
//             Create New Account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
