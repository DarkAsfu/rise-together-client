"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import slide1img from "../../../public/slide1.jpeg";
import slide2img from "../../../public/slide2.jpeg";
import slide3img from "../../../public/slide3.jpeg";
import { ChevronsRight, HandHeart } from "lucide-react";

const slideData = [
  {
    title: "Empowering Communities",
    shortDesc: "Building stronger communities",
    paragraph:
      "Join us in our mission to create positive change through collective action and community engagement. Together we can make a difference.",
    bgImage: slide1img,
  },
  {
    title: "Sustainable Future",
    shortDesc: "Creating a better tomorrow",
    paragraph:
      "We're committed to sustainable development and environmental stewardship. Let's work together for a greener, cleaner future.",
    bgImage: slide2img,
  },
  {
    title: "Education For All",
    shortDesc: "Fund Dreams Change Lives",
    paragraph:
      "Supporting educational initiatives that empower individuals and transform communities. Every person deserves access to quality education.",
    bgImage: slide3img,
  },
];

const Banner = () => {
  return (
    <Swiper
      navigation={true}
      modules={[Navigation, Autoplay]}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      className="mySwiper [&_.swiper-button-next]:text-white [&_.swiper-button-next]:bg-primary/60 [&_.swiper-button-next]:rounded-full [&_.swiper-button-next]:p-6 [&_.swiper-button-next]:after:!text-[16px] [&_.swiper-button-next]:after:!text-white [&_.swiper-button-prev]:text-white [&_.swiper-button-prev]:bg-primary/60 [&_.swiper-button-prev]:rounded-full [&_.swiper-button-prev]:p-6 [&_.swiper-button-prev]:after:!text-[16px] [&_.swiper-button-prev]:after:!text-white -mt-22"
    >
      {slideData.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative h-screen md:h-[800px] w-full">
            <div className="relative h-full w-full">
              {/* Background Image */}
              <Image
                src={slide.bgImage}
                alt={slide.title}
                fill
                className="object-cover mix-blend-color-burn grayscale"
              />
            </div>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#003b4a] opacity-80"></div>
            {/* Text content */}
            <div className="absolute inset-0 flex flex-col justify-center text-white  max-w-7xl mx-auto px-2 xl:px-0">
              <h2 className="text-[14px] md:text-[35px] font-bold uppercase tracking-widest text-secondary">
                {slide.title}
              </h2>
              <h1 className="text-white text-[34px] md:text-[60px] font-bold leading-[1.2] mb-5 relative capitalize max-w-2xl">
                {slide.shortDesc}
              </h1>
              <p className="text-[12px] md:text-[16px] text-[#d7d7d7] mb-[35px] max-w-2xl">
                {slide.paragraph}
              </p>
              <div className="flex gap-4">
                <button className="group cursor-pointer slide-anime px-3 md:px-5 py-3 rounded-full max-w-max dark:bg-white bg-primary-base text-white dark:text-black flex justify-between items-center font-semibold bg-primary gap-1">
                  Donate Now{" "}
                  <div className="group-hover:translate-x-2 transition-all">
                    <HandHeart size={18} />
                  </div>
                </button>
                <a
                  className="flex max-w-max gap-2 cursor-pointer px-4 py-3 dark:hover:bg-black bg-secondary hover:bg-white hover:text-black text-white dark:hover:text-white transition-all  dark:border-white dark:bg-white dark:text-black rounded-full font-semibold"
                  href="#"
                >
                  Learn More
                  <ChevronsRight />
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
