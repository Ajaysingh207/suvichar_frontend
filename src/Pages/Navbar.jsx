import React from "react";

import lap from "../assets/lapt.avif";
export default function Navbar() {
  return (
    <>
      <div className="container">
        <div className=" flex  justify-between  ">
          <div className="hambarger py-2  px-2 ">
            <div className="line  w-4 border-2 border-black"></div>
            <div className="line my-1 w-4 border-2 border-black"></div>
            <div className="line  w-4 border-2 border-black "></div>
          </div>
          <div className="micro flex">
            <div className="logo"></div>
            <div className="microsoft">Microsoft</div>
          </div>
          <div className="profile ">profile</div>
        </div>
        {/* <div className="crousel flex flex-col  relative bg-white ">
          <div className="right w-full relative">
            <img
              src={lap}
              alt="loading"
              className="w-full h-auto  object-cover"
            />

            <div className="absolute inset-0 hidden md:flex flex-col  text-black p-14 ">
              <p className=" text-4xl space-x-1.5">Meet Surface Laptop</p>
              <div>
                <p className="my-2 text-xl">
                  Unlock AI features like Live Captions and Cocreator with this
                </p>
              </div>
              <div>
                <p className=" text-xl"> exceptionally powerful laptop</p>
              </div>
              <div>
                <button className="my-2 bg-blue-500 text-white p-2 rounded-2xl ">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="left text-black p-4  md:hidden">
            <div className="">
              <p className=" text-2xl space-x-1 font-bold text-black">Meet Surface Laptop</p>
              <div>
                <p className=" text-sm my-2">
                  Unlock AI features like Live Captions and Cocreator with this exceptionally powerful laptop 
                </p>
              </div>
              <div>
                <button className=" bg-blue-500 text-white  rounded p-1 my-2 ">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
