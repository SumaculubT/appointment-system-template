import React from "react";
import CarHero from "../../assets/home/carhero.webm";
import { FaArrowRight } from "react-icons/fa";

const Home = () => {
  return (
    <>
      <div className=" font-raleway bg-gray-200">
        <header className="relative flex items-center justify-center h-screen overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute z-10 w-auto min-w-full min-h-full max-w-none object-cover"
          >
            <source src={CarHero} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="relative z-20 p-5 text-center bg-opacity-50 rounded-lg max-w-2xl mx-auto">
            <h1 className=" text-white text-3xl md:text-4xl lg:text-5xl mb-4">
              Automotive Services Inc.
            </h1>
            <p className=" text-white text-lg md:text-xl mb-8">
              Where your dream is our Expertise.
            </p>
            <a className=" cursor-pointer flex flex-row w-fit h-full p-1 gap-6 hover:gap-12 shadow-md bg-red-100 transform -skew-x-12 duration-300 m-auto">
              <span className=" text-gray-900 ml-6 font-semibold m-auto ">
                Book Now
              </span>
              <div className="  text-white bg-gray-900 px-4 py-2 flex justify-end ">
                <FaArrowRight className=" m-auto text-xl" />
              </div>
            </a>
          </div>
        </header>
        <section className=" h-screen"></section>
      </div>
    </>
  );
};

export default Home;
