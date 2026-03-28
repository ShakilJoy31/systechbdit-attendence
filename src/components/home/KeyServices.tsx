"use client";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import portfolioImage from '@/assets/Home/portfolio.jpg'
import portfolioImage1 from '@/assets/Service/key-service-(1).webp'
import portfolioImage2 from '@/assets/Service/key-service-(2).webp'
import portfolioImage3 from '@/assets/Service/key-service-(3).webp'
import { CgArrowBottomRight } from "react-icons/cg";
import { useState, useEffect } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { FiChevronRight } from "react-icons/fi";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import TechElementAnimated from "./TechElementAnimated";
import ProgrammingAnimation from '../../utils/constant/serviceAnimation.json'
import Marquee from "react-fast-marquee";

const services = [
    {
        id: 1,
        title: "Bulk SMS Campaigns",
        description: "Send thousands of messages instantly with our high-speed bulk SMS platform.",
        image: portfolioImage.src,
    },
    {
        id: 2,
        title: "Transactional SMS",
        description: "Reliable OTP, alerts, and notifications with guaranteed delivery.",
        image: portfolioImage1.src,
    },
    {
        id: 3,
        title: "SMS API Integration",
        description: "Seamless integration with your existing systems and applications.",
        image: portfolioImage2.src,
    },
    {
        id: 4,
        title: "Two-Way SMS",
        description: "Enable customer responses and interactive messaging campaigns.",
        image: portfolioImage3.src,
    },
    {
        id: 5,
        title: "Scheduled Messaging",
        description: "Plan and schedule SMS campaigns for optimal delivery times.",
        image: portfolioImage.src,
    },
    {
        id: 6,
        title: "Personalized SMS",
        description: "Customize messages with customer names and dynamic content.",
        image: portfolioImage1.src,
    },
    {
        id: 7,
        title: "SMS Analytics",
        description: "Track delivery rates, responses, and campaign performance.",
        image: portfolioImage2.src,
    },
    {
        id: 8,
        title: "Short Code Services",
        description: "Professional short codes for high-volume messaging.",
        image: portfolioImage3.src,
    },
    {
        id: 9,
        title: "Global SMS Coverage",
        description: "Reach customers worldwide with our extensive network.",
        image: portfolioImage.src,
    },
    {
        id: 10,
        title: "Compliance Management",
        description: "Stay compliant with telecom regulations and GDPR.",
        image: portfolioImage1.src,
    },
];

const NavigationButtons = () => {
    const swiper = useSwiper();
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        const handleSlideChange = () => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
        };

        swiper.on('slideChange', handleSlideChange);
        return () => {
            swiper.off('slideChange', handleSlideChange);
        };
    }, [swiper]);

    return (
        <>
            {!isBeginning && (
                <button
                    onClick={() => swiper.slidePrev()}
                    className="custom-prev absolute top-1/2 left-4 hover:cursor-pointer z-50 transform -translate-y-1/2 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all duration-300"
                    aria-label="Previous slide"
                >
                    <FaArrowLeftLong size={24} />
                </button>
            )}
            {!isEnd && (
                <button
                    onClick={() => swiper.slideNext()}
                    className="custom-next absolute top-1/2 right-4 hover:cursor-pointer z-50 transform -translate-y-1/2 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all duration-300"
                    aria-label="Next slide"
                >
                    <FaArrowRightLong size={24} />
                </button>
            )}
        </>
    );
};

const ServiceTagsMarquee = () => {
    const serviceTags = [
        "BULK SMS",
        "TRANSACTIONAL",
        "API INTEGRATION", 
        "TWO-WAY",
        "ANALYTICS",
        "GLOBAL",
        "COMPLIANT"
    ];

    return (
        <div className=" overflow-hidden">
            <Marquee 
                speed={25}
                direction="left"
                gradient={true}
                gradientColor="#0b0b1a"
                gradientWidth={100}
                className="text-white font-medium text-[24px] md:text-[32px]"
            >
                {serviceTags.map((tag, index) => (
                    <div key={index} className="flex items-center mx-8">
                        <span className="transition-all duration-300 ">
                            {tag}
                        </span>
                        {index < serviceTags.length - 1 && (
                            <span className="mx-8 text-orange-500 text-[32px] animate-pulse">•</span>
                        )}
                    </div>
                ))}
            </Marquee>
        </div>
    );
};

export default function KeyServices() {
    return (
        <section className="bg-[#0b0b1a] text-white py-16">
            <div className="max-w-full mx-auto flex flex-col md:flex-row gap-10">
                {/* Left Section */}
                <div className="md:w-1/3 flex md:flex-col lg:justify-between w-full px-4 md:px-0">
                    <div className="block mx-auto ">
                        {/* Circle text logo */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-16 h-16 border border-white rounded-full flex items-center justify-center">
                                <span className="text-sm">SMS</span>
                            </div>
                        </div>

                        {/* Heading */}
                        <h2 className="text-4xl font-light leading-snug text-white">
                            <div className="flex gap-x-12 items-center"><span>CORE</span> <span><CgArrowBottomRight size={45}></CgArrowBottomRight></span></div>
                            <span className="font-semibold">Services</span>
                        </h2>
                    </div>

                    {/* Diamond image */}
                    <div className="block mx-auto w-3/4 h-3/4 ">
                         <TechElementAnimated ProgrammingAnimation={ProgrammingAnimation} loop={true}></TechElementAnimated>
                    </div>
                </div>

                {/* Right Section - Slider */}
                <div className="md:w-2/3 relative">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1.2}
                        breakpoints={{
                            640: { slidesPerView: 1.5 },
                            1024: { slidesPerView: 2.2 },
                        }}
                        modules={[Navigation]}
                        className="pb-8 relative"
                    >
                        <NavigationButtons />
                        {services.map((service) => (
                            <SwiperSlide key={service.id}>
                                <div className="relative rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-[1.02]">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        width={500}
                                        height={600}
                                        className="w-full h-[420px] object-cover"
                                        priority={service.id <= 3}
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 flex flex-col justify-end transition-opacity duration-300 group-hover:bg-black/50">
                                        <Heading className="text-lg md:text-xl font-semibold mb-2">
                                            {service.title}
                                        </Heading>
                                        <Paragraph className="text-gray-300 text-sm mb-3">
                                            {service.description}
                                        </Paragraph>
                                        <a
                                            href="#"
                                            className="text-white font-semibold underline underline-offset-2 hover:text-orange-400 transition-colors duration-300 inline-flex items-center gap-1"
                                        >
                                            Learn more
                                            <FiChevronRight size={16} className="inline" />
                                        </a>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Service Tags Marquee */}
            <ServiceTagsMarquee />
        </section>
    );
}