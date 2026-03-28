"use client";

import React from "react";
import bannerBackgroundImage from "../../assets/Home/Hero-back.png";
import Image from "next/image";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import Button from "../reusable-components/Button";
import { HiSparkles } from "react-icons/hi";
import dotStar from '@/assets/Icons/Sparkles.svg'
import AnimatedText from "../reusable-components/AnimatedText";
import { useRouter } from "next/navigation";
import TechElementAnimated from "./TechElementAnimated";
import ProgrammingAnimation from '../../utils/constant/sms-animation.json'

const Banner = () => {
    const router = useRouter();

    return (
        <section
            className=" flex flex-col justify-around"
            style={{
                backgroundImage: `url(${bannerBackgroundImage.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}>
            

            {/* Top Section */}
            <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between px-4 py-12 md:py-20 gap-8 md:gap-10">
                {/* Text Content */}
                <div className="w-full lg:max-w-[600px] space-y-4 sm:space-y-6 text-center lg:text-left mt-6 lg:mt-0">
                    <Heading>
                        <AnimatedText
                            text="Powerful SMS Platform For Seamless Business Communication"
                            loop={false}
                            loopDelay={5}
                            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                        />
                    </Heading>

                    <Paragraph >
                        <AnimatedText
                            text="Send Bulk SMS, Automate Campaigns, And Engage Customers With Our Reliable, Scalable, And Secure SMS Service Platform. Trusted By Businesses Worldwide."
                            loop={false}
                            speed={0.005}
                            className="text-[#9F9FAF] text-sm sm:text-base md:text-lg leading-relaxed"
                        />
                    </Paragraph>

                    <Button onClick={()=> router.push('/contact')}
                        className="bg-[#1776BB] hover:cursor-pointer hover:bg-[#0f5ed1] text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium flex items-center gap-2 mx-auto lg:mx-0 transition text-sm sm:text-base">
                        <HiSparkles className="text-lg sm:text-xl" />
                        Start Sending SMS Now
                    </Button>
                </div>

                {/* Image */}
                <div className="w-full lg:w-auto mt-2 lg:mt-0 ">
                    <div className="flex justify-center lg:justify-end relative ">
                         <div className="block mx-auto w-[320px] sm:w-[420px] md:w-[520px] ">
                         <TechElementAnimated ProgrammingAnimation={ProgrammingAnimation} loop={true}></TechElementAnimated>
                    </div>
                        
                        <Image
                            src={dotStar}
                            alt="Main banner rotating image"
                            width={500}
                            height={500}
                            className="object-contain rotating-image-X absolute top-[30px] right-[-25px] w-[128px] h-[103px] "
                            priority
                        />
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-end gap-4 sm:gap-6 md:gap-[36px] mt-2 md:mt-8">
                        {[
                            { number: "99.9%", text: "Delivery Rate" },
                            { number: "10M+", text: "SMS Sent Monthly" },
                            { number: "500+", text: "Business Clients" },
                            { number: "Global", text: "Network Coverage" },
                        ].map((item, index) => (
                            <div key={index} className="text-center lg:text-right">
                                <Paragraph className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white ">
                                    {item.number}
                                </Paragraph>
                                <Paragraph className="text-[#9F9FAF] text-xs sm:text-sm md:text-[16px]">
                                    {item.text}
                                </Paragraph>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </section>
    );
};

export default Banner;