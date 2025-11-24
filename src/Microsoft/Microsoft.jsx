import React from "react";
// import Navbar from "../Pages/Navbar";
import Caroussel from "../Component/Caroussel";
import imgage1 from "../assets/win.svg";

export default function Microsoft() {
  return (
    <>
      <div className="container">
        <div className="nav"></div>
        <Navbar />

        <div>
          <Caroussel />
        </div>

        <div className="micro-exp my-1 flex flex-col lg:flex-row gap-4 items-center justify-center">
          <div className="flex cursor-pointer">
            <div className="image h-5 w-6">
              <img src={imgage1} alt=" loading" />
            </div>
            <p className=" text-sm  underline text-blue-700">
              Choose your microsoft 365
            </p>
          </div>
          <div className="flex cursor-pointer">
            <div className="image h-5 w-6">
              <img src={imgage1} alt=" loading" />
            </div>
            <p className=" text-sm  underline text-blue-700">
              Choose your microsoft 365
            </p>
          </div>
          <div className="flex cursor-pointer">
            <div className="image h-5 w-6">
              <img src={imgage1} alt=" loading" />
            </div>
            <p className=" text-sm  underline text-blue-700">
              Choose your microsoft 365
            </p>
          </div>
          <div className="flex cursor-pointer">
            <div className="image h-5 w-6">
              <img src={imgage1} alt=" loading" />
            </div>
            <p className=" text-sm  underline text-blue-700">
              Choose your microsoft 365
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
