"use client"

import { FaUsers, FaCheckCircle, FaSms, FaChartLine, FaCogs, FaRocket } from "react-icons/fa";
import Image from "next/image";
import meetingRightImage from "@/assets/Technology/12109.jpg";
import researchImage from "@/assets/Technology/370266-PC0MK1-83-removebg-preview.png";
import designImage from "@/assets/Technology/2156737-removebg-preview.png";
import developmentImage from "@/assets/Technology/6544292-removebg-preview.png";
import testingImage from "@/assets/Technology/5101869-removebg-preview.png";
import finalizedImage from "@/assets/Technology/145-removebg-preview.png";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import { useState } from "react";

export default function MeetingComponent() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    
    const steps = [
        {
            icon: <FaUsers className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl" />,
            title: "Consultation & Needs Analysis",
            description: "We start by understanding your business communication needs, target audience, and SMS campaign goals to create a tailored messaging strategy.",
            image: meetingRightImage,
        },
        {
            icon: <FaSms className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl" />,
            title: "SMS Strategy Planning",
            description: "Develop a comprehensive SMS marketing strategy including audience segmentation, messaging templates, and campaign scheduling for optimal engagement.",
            image: researchImage,
        },
        {
            icon: <FaCogs className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl" />,
            title: "Platform Setup & Integration",
            description: "Configure your SMS platform with APIs, webhooks, and integration with your existing CRM, e-commerce, or marketing tools for seamless operation.",
            image: designImage,
        },
        {
            icon: <FaRocket className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl" />,
            title: "Campaign Launch",
            description: "Deploy your SMS campaigns with advanced features like personalization, scheduling, and A/B testing to maximize engagement and conversion rates.",
            image: developmentImage,
        },
        {
            icon: <FaChartLine className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl" />,
            title: "Performance Monitoring",
            description: "Track delivery rates, engagement metrics, and ROI with real-time analytics dashboards and automated reporting for continuous optimization.",
            image: testingImage,
        },
        {
            icon: <FaCheckCircle className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl" />,
            title: "Ongoing Optimization",
            description: "Regular analysis and refinement of SMS campaigns based on performance data to ensure maximum effectiveness and customer satisfaction.",
            image: finalizedImage,
        },
    ];

    const toggleDescription = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const currentImage = activeIndex !== null ? steps[activeIndex].image : meetingRightImage;

    return (
        <section className="bg-white dark:bg-black rounded-[24px] pt-8 md:p-8 lg:p-12 lg:mx-4 md:mx-2 mx-1 mb-[20px] ">
            {/* Heading */}
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
                <Heading className="text-2xl md:text-3xl lg:text-4xl font-bold dark:text-white text-black">
                    Our SMS Platform <span className="text-blue-600">Implementation Process</span>
                </Heading>
                <Paragraph className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base">
                    From strategy to successful campaigns, we guide you through every step of SMS implementation
                </Paragraph>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1280px] mx-auto gap-x-0 md:gap-x-4">
                {/* Left Side: Steps */}
                <div className="space-y-4 sm:space-y-6">
                    {steps.map((step, idx) => (
                        <div key={idx}>
                            {/* Step Item */}
                            <div 
                                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                                    activeIndex === idx 
                                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" 
                                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                                onClick={() => toggleDescription(idx)}
                            >
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mt-1 rounded-full transition-colors duration-300 ${
                                    activeIndex === idx 
                                        ? "bg-blue-100 dark:bg-blue-800" 
                                        : "bg-gray-100 dark:bg-gray-800"
                                }`}>
                                    {step.icon}
                                </div>
                                <div className="flex-1">
                                    <Heading className={`font-semibold text-base sm:text-lg flex items-center transition-colors duration-300 ${
                                        activeIndex === idx 
                                            ? "text-blue-700 dark:text-blue-300" 
                                            : "text-gray-700 dark:text-gray-300"
                                    }`}>
                                        {step.title}
                                    </Heading>
                                    <div 
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                            activeIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                    >
                                        <Paragraph className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                                            {step.description}
                                        </Paragraph>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Image */}
                            {activeIndex === idx && (
                                <div className="md:hidden mt-4 p-4 border-2 border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-900/10">
                                    <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden">
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            fill
                                            className="object-cover transition-opacity duration-500"
                                            sizes="(max-width: 768px) 100vw, 400px"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Side: Image */}
                <div className="hidden md:block relative w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
                    <Image
                        src={currentImage}
                        alt={activeIndex !== null ? steps[activeIndex].title : "SMS Implementation Process"}
                        fill
                        className="rounded-lg sm:rounded-xl object-cover transition-opacity duration-500"
                        sizes="(max-width: 1024px) 50vw, 600px"
                    />
                </div>
            </div>
        </section>
    );
}