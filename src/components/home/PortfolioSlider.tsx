"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import portfolioImage from '@/assets/Home/portfolio.jpg'
import portfolioImage2 from '@/assets/Service/portfolio-(1).webp'
import portfolioImage3 from '@/assets/Service/portfolio-(2).webp'
import portfolioImage4 from '@/assets/Service/portfolio-(3).webp'
import portfolioImage5 from '@/assets/Service/portfolio-(4).webp'
import Button from "../reusable-components/Button";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";

const portfolioItems = [
    {
        id: 1,
        title: "E-commerce SMS Campaign Management",
        image: portfolioImage.src,
        description: "Increased customer engagement by 45%"
    },
    {
        id: 2,
        title: "Banking Transaction Alerts System",
        image: portfolioImage2.src,
        description: "99.9% delivery rate for OTP messages"
    },
    {
        id: 3,
        title: "Healthcare Appointment Reminders",
        image: portfolioImage3.src,
        description: "Reduced no-shows by 60%"
    },
    {
        id: 4,
        title: "Logistics Delivery Notifications",
        image: portfolioImage4.src,
        description: "Real-time tracking updates"
    },
    {
        id: 5,
        title: "Educational Institution Notifications",
        image: portfolioImage5.src,
        description: "Automated campus alerts system"
    },
];

export default function PortfolioSlider() {
    return (
        <section className="w-full bg-white dark:bg-black py-12 relative">
            <div className="max-w-full mx-auto">
                <Heading className="text-3xl text-center md:text-4xl font-bold text-black mb-8 dark:text-white">
                    Success <span className="text-blue-600">Stories</span>
                </Heading>

                {/* Slider */}
                <div className="w-full h-[20px] bg-black dark:bg-gray-500"></div>

                {/* Slider Container */}
                <div className="pb-10">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1.2}
                        loop={true}
                        pagination={{
                            clickable: true,
                            el: '.swiper-pagination',
                            modifierClass: 'swiper-pagination-'
                        }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        modules={[Pagination, Autoplay]}
                        breakpoints={{
                            640: { slidesPerView: 2.5 },
                            1024: { slidesPerView: 4 },
                        }}
                    >
                        {portfolioItems.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="relative group overflow-hidden shadow-lg mb-4">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={400}
                                        height={300}
                                        className="object-cover w-full h-[300px] lg:h-[419px] transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-4">
                                        <Heading className="text-white text-lg font-semibold mb-3">
                                            {item.title}
                                        </Heading>
                                        <Paragraph className="text-white mb-3">
                                            {item.description}
                                        </Paragraph>
                                        <Button className="hover:cursor-pointer text-white px-4 py-2 rounded-lg bg-[#1776BB] transition">
                                            View Case Study
                                        </Button>
                                    </div>
                                </div>
                                <Paragraph className="text-[24px] px-2">{item.title}</Paragraph>
                                <Paragraph className="text-gray-600 dark:text-gray-400 text-sm px-2">
                                    {item.description}
                                </Paragraph>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Custom pagination container */}
                <div className="swiper-pagination !relative !mt-4 !bottom-0"></div>

                {/* Explore All Button */}
                <div className="mt-6 flex justify-center md:justify-end mr-[80px]">
                    <Button className="text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                        View All Case Studies →
                    </Button>
                </div>
            </div>

            {/* Custom CSS for pagination positioning */}
            <style jsx global>{`
                .swiper-pagination {
                    position: relative !important;
                    margin-top: 1rem !important;
                    bottom: 0 !important;
                }
                .swiper-pagination-bullet {
                    background: #1976d2 !important;
                }
            `}</style>
        </section>
    );
}