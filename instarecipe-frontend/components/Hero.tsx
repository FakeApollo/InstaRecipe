"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

interface HeroProps {
  onScrollToIngredients: () => void;
}

const Hero: React.FC<HeroProps> = ({ onScrollToIngredients }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = ["/food.jpg", "/soup.jpg", "/soup2.jpg"];

  // Add this for automatic slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="min-h-screen relative flex items-center justify-start overflow-hidden">
      {/* Slideshow Container */}
      <div className="absolute inset-0 flex">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url('${slide}')`,
            }}
          />
        ))}
      </div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <Navbar />

      {/* Hero Content - Left Aligned */}
      <div className="relative z-10 text-white px-8 md:px-16 lg:px-24 w-full max-w-2xl">
        <h1 className="leading-none mb-8">
          <span className="text-6xl md:text-7xl lg:text-6xl text-red-200">Insta</span>
          <br />
          <span className="block mt-2 text-8xl md:text-9xl lg:text-8xl font-semibold">
            Recipe
          </span>
        </h1>

        {/* Description Text - Added between title and button */}
        <p className="text-sm md:text-xl mb-8 text-white/90 font-light">
          আপনার রান্নাঘরে যা আছে, তা দিয়ে রান্না করুন সহজ ও সুস্বাদু রেসিপি।
        </p>

        <button
          onClick={onScrollToIngredients}
          className="px-10 py-5 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 hover:cursor-pointer transition-all transform hover:scale-105 shadow-lg text-xl"
        >
          LET'S MAKE
        </button>
      </div>
    </section>
  );
};

export default Hero;
