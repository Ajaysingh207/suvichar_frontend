import React from "react";
import lap from "../assets/lapt.avif";
import lap1 from "../assets/lap1.avif";
// import img1 from "../assets/lap.jpeg";

const Caroussel = () => {
  return (
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="carousel flex flex-col  relative bg-white ">
            <div className="right w-full relative">
              <img
                src={lap}
                alt="loading"
                className="w-full h-auto  object-cover"
              />

              <div className="absolute inset-0 hidden md:flex flex-col  text-black p-14 ">
                <p className=" text-4xl space-x-1.5 ">Meet Surface Laptop</p>
                <div>
                  <p className="my-2 text-xl   sm:text-sm">
                    Unlock AI features like Live Captions and Cocreator with
                    this
                  </p>
                </div>
                <div>
                  <p className=" text-xl  sm:text-sm"> exceptionally powerful laptop</p>
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
                <p className=" text-2xl space-x-1 font-bold text-black">
                  Meet Surface Laptop
                </p>
                <div>
                  <p className=" text-sm my-2">
                    Unlock AI features like Live Captions and Cocreator with
                    this exceptionally powerful laptop
                  </p>
                </div>
                <div>
                  <button className=" bg-blue-500 text-white  rounded p-1 my-2 ">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item relative ">
          <img src={lap1} className="d-block w-100" alt="Slide 2" />
          <div className="absolute inset-0 hidden md:flex flex-col  text-black p-14 ">
            <p className=" text-4xl space-x-1.5 md:text-sm">Meet Surface Laptop</p>
            <div>
              <p className="my-2 text-xl sm:text-sm ">
                Unlock AI features like Live Captions and Cocreator with this
              </p>
            </div>
            <div>
              <p className=" text-xl sm:text-sm"> exceptionally powerful laptop</p>
            </div>
            <div>
              <button className="my-2 bg-blue-500 md:text-sm  text-white p-2 rounded-2xl ">
                Learn More
              </button>
            </div>
          </div>
          <div className="left text-black p-4  md:hidden">
            <div className="">
              <p className=" text-2xl space-x-1 font-bold text-black">
                Meet Surface Laptop
              </p>
              <div>
                <p className=" text-sm my-2">
                  Unlock AI features like Live Captions and Cocreator with this
                  exceptionally powerful laptop
                </p>
              </div>
              <div>
                <button className=" bg-blue-500 text-white  rounded p-1 my-2 ">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Caroussel;
