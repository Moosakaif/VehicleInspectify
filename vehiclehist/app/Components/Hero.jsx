"use client";

import React, { useState } from "react";
import { font } from "./font/font";
import { useRouter } from "next/navigation";
import ImageSlider from './ImageSlider';

const Hero = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const router = useRouter();
  
  const slide = {
    image: "/ferrari.jpg",
    heading: "Discover the hidden history of your car",
    text: "Order a detailed report to protect yourself from bad purchases sell with confidence and ensure your vehicle's safety",
  };
  
  const handleGetReport = () => {
    if (!registrationNumber.trim()) {
      alert("Please enter a registration number");
    } else {
      // Navigate to the result page with the registration number as a query parameter
      router.push(`/packages`);
    }
  };
  return (
    <section className="bg-black text-white px-6 py-14 lg:px-16 lg:py-24">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    
    {/* LEFT CONTENT */}
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold leading-snug">
        Discover the <span className="text-yellow-400">hidden history</span> of your car
      </h1>
      <p className="text-base sm:text-lg">
        Order a detailed report to protect yourself from bad purchases,
        sell with confidence and ensure your vehicle's safety.
      </p>

      <div className="flex flex-col sm:flex-row max-w-md w-full">
        <input
          type="text"
          placeholder="Enter Registration Number"
          className="p-3 rounded-md sm:rounded-l-md sm:rounded-r-none text-black flex-grow"
           value={registrationNumber} // ✅ Always controlled
              onChange={(e) => setRegistrationNumber(e.target.value)}
               //className="p-3 rounded-md sm:rounded-l-md sm:rounded-r-none text-black flex-grow"  
        />
        <button className="bg-yellow-500 text-black font-semibold px-6 py-3 mt-3 sm:mt-0 sm:rounded-r-md sm:rounded-l-none rounded-md"
          onClick={handleGetReport}
        >
          Get Report
        </button>
      </div>
    </div>

    {/* RIGHT SLIDER CENTERED */}
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg">
        <ImageSlider />
      </div>
    </div>
  </div>
</section>

  );
};

export default Hero;

