"use client";

import React from "react";
import bannerBackgroundImage from "../../assets/Home/startBuildingImage.png";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import Button from "../reusable-components/Button";
import { HiSparkles } from "react-icons/hi";
import BrandSection from "./BrandSection";
import { useRouter } from "next/navigation";

const StartBuilding = () => {
    const router = useRouter();

    return (
        <section
            className="min-h-screen flex flex-col justify-between"
            style={{
                backgroundImage: `url(${bannerBackgroundImage.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Top Section */}
            <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between px-4 py-12 md:py-20 gap-8 md:gap-10">
                {/* Text Content */}
                <div className="w-full lg:max-w-[600px] space-y-4 sm:space-y-6 text-center lg:text-left mt-6 lg:mt-0">
                    <Heading className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-tight">
                        Start Sending SMS in Minutes
                    </Heading>
                    <Paragraph className="text-white text-sm sm:text-base md:text-lg leading-relaxed max-w-[90%] md:max-w-full mx-auto lg:mx-0">
                        Launch powerful SMS campaigns instantly. No coding required - just sign up and start engaging with your customers through reliable, high-performance messaging.
                    </Paragraph>
                    <Button onClick={()=> router.push('/pricing')}
                        className="bg-[#1776BB] hover:bg-[#0f5ed1] text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium flex items-center gap-2 mx-auto lg:mx-0 transition text-sm sm:text-base">
                        <HiSparkles className="text-lg sm:text-xl" />
                        Get Started Free
                    </Button>
                </div>

                {/* Image */}
                <div className="w-full lg:w-auto mt-8 lg:mt-0">
                    <BrandSection />
                </div>
            </div>
        </section>
    );
};

export default StartBuilding;