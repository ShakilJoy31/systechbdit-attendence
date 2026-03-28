"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import swiperImage from "@/assets/Home/slider-1.svg";

import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import { Autoplay } from "swiper/modules";

const industries = [
  { id: 1, name: "E-commerce", image: swiperImage.src, bg: "bg-gray-400", description: "Order updates & promotions" },
  { id: 2, name: "Healthcare", image: swiperImage.src, bg: "bg-green-400", description: "Appointment reminders" },
  { id: 3, name: "Banking", image: swiperImage.src, bg: "bg-teal-400", description: "OTP & alerts" },
  { id: 4, name: "Education", image: swiperImage.src, bg: "bg-gray-200", description: "Campus notifications" },
  { id: 5, name: "Logistics", image: swiperImage.src, bg: "bg-purple-200", description: "Delivery tracking" },
  { id: 6, name: "Restaurants", image: swiperImage.src, bg: "bg-orange-400", description: "Reservation confirmations" },
  { id: 7, name: "Real Estate", image: swiperImage.src, bg: "bg-blue-400", description: "Property alerts" },
  { id: 8, name: "Travel", image: swiperImage.src, bg: "bg-sky-300", description: "Booking confirmations" },
  { id: 9, name: "Retail", image: swiperImage.src, bg: "bg-green-300", description: "Promotional offers" },
  { id: 10, name: "SaaS", image: swiperImage.src, bg: "bg-red-300", description: "Account notifications" },
  { id: 11, name: "Insurance", image: swiperImage.src, bg: "bg-yellow-300", description: "Policy updates" },
  { id: 12, name: "Automotive", image: swiperImage.src, bg: "bg-lime-300", description: "Service reminders" },
  { id: 13, name: "Government", image: swiperImage.src, bg: "bg-amber-400", description: "Public alerts" },
  { id: 14, name: "Non-Profit", image: swiperImage.src, bg: "bg-indigo-300", description: "Donation appeals" },
  { id: 15, name: "Fitness", image: swiperImage.src, bg: "bg-blue-200", description: "Class reminders" },
  { id: 16, name: "Events", image: swiperImage.src, bg: "bg-pink-300", description: "Ticket confirmations" },
  { id: 17, name: "Telecom", image: swiperImage.src, bg: "bg-purple-300", description: "Service updates" },
  { id: 18, name: "Manufacturing", image: swiperImage.src, bg: "bg-orange-300", description: "Supply alerts" },
  { id: 19, name: "Beauty", image: swiperImage.src, bg: "bg-fuchsia-300", description: "Appointment alerts" },
  { id: 20, name: "Entertainment", image: swiperImage.src, bg: "bg-emerald-400", description: "Event notifications" }
];

const IndustryExpertise = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <section className="w-full py-12 bg-white dark:bg-background dark:border rounded-[24px]">
      <div className="max-w-full mx-auto ">
        {/* Heading */}
        <div className="text-center">
          <Heading className="text-2xl md:text-3xl lg:text-4xl font-bold">
            SMS Solutions For <span className="text-blue-500">Every Industry</span>
          </Heading>
          <Paragraph className="text-gray-700 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            Powering communication across diverse sectors with reliable SMS solutions tailored to specific industry needs
          </Paragraph>
        </div>

        {/* Swiper */}
        <Swiper
          spaceBetween={20}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            320: { slidesPerView: 2.5 },
            640: { slidesPerView: 4.5 },
            1024: { slidesPerView: 9 },
          }}
        >
          {industries.map((item) => (
            <SwiperSlide key={item.id}>
              {({ isActive }) => (
                <div
                  className={`transition-all duration-500 rounded-4xl p-4 mt-20 flex flex-col items-center justify-center text-center mb-6 shadow-lg ${isActive ? "scale-120" : "scale-90 "
                    } ${item.bg}`}
                >

                  <div className="w-[115px] h-[82px] mb-3 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain w-full h-full "
                    />
                  </div>

                  <Heading className="text-xs md:text-sm font-medium text-white drop-shadow h-4 flex flex-col justify-end">
                    {item.name}
                  </Heading>
                  <Paragraph className="text-xs text-white/80 mt-1">
                    {item.description}
                  </Paragraph>

                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default IndustryExpertise;