"use client"

import React, { useEffect, useState } from "react";
import { FiFigma } from "react-icons/fi";
import { FaDraftingCompass } from "react-icons/fa";
import { MdOutlineViewComfy } from "react-icons/md";
import AnimatedText from "../reusable-components/AnimatedText";

const features = [
    {
        icon: <FiFigma size={40} className="text-purple-400" />,
        title: "Unlimited Colors",
        description:
            "Barrel designs the experience in 3 steps, each increasing in detail, from the flow to the wireframes and from pen and paper",
        percent: 95,
        barColor: "bg-orange-500",
    },
    {
        icon: <FaDraftingCompass size={40} className="text-cyan-400" />,
        title: "High Quality Design",
        description:
            "Barrel designs the experience in 3 steps, each increasing in detail, from the flow to the wireframes and from pen and paper",
        percent: 70,
        barColor: "bg-orange-500",
    },
    {
        icon: <MdOutlineViewComfy size={40} className="text-lime-400" />,
        title: "Luxurious Layouts",
        description:
            "Barrel designs the experience in 3 steps, each increasing in detail, from the flow to the wireframes and from pen and paper",
        percent: 95,
        barColor: "bg-orange-500",
    },
];
const WhoWeAre = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // This code will only run on the client side
        setIsMobile(window.innerWidth < 640);
    }, []);

    return (
        <section className="dark:bg-[#0B0B14] bg-white py-12 sm:py-16 md:py-24 lg:py-32">
            <div className="w-full max-w-[1280px] mx-auto text-white dark:text-black flex flex-col justify-center px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-12 sm:mb-16 md:mb-20 lg:mb-[100px]">
                    {/* Top label */}
                    <p className="text-xs sm:text-sm font-medium tracking-wider pt-5 text-black dark:text-white">
                        WHO WE ARE
                    </p>

                    {/* Heading */}
                    <AnimatedText
                        text="Awesome international graphic design and digital advertising agency based"
                        loop={false}
                        speed={0.03}
                        loopDelay={5}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold max-w-4xl leading-snug sm:leading-tight text-black dark:text-white"
                    />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 text-center">
                    {features.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center px-4 sm:px-0">
                            {/* Icon */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg bg-[#111121] mb-4 sm:mb-6 shadow-lg">
                                {React.cloneElement(item.icon, {
                                    size: isMobile ? 30 : 40
                                })}
                            </div>

                            {/* Title */}
                            <AnimatedText
                                text={item.title}
                                loop={false}

                                className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-black dark:text-white"
                            />

                            {/* Description */}
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-xs">
                                {item.description}
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full max-w-xs">
                                <div className="flex justify-between text-xs mb-1 text-black dark:text-white">
                                    <span></span>
                                    <span>{item.percent}%</span>
                                </div>
                                <div className="w-full h-[2px] bg-gray-600 relative">
                                    <div
                                        className={`h-[2px] ${item.barColor}`}
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhoWeAre;