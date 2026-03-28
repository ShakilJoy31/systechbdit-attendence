"use client";
import React from "react";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import { Controller, useForm } from "react-hook-form";
import TipTapEditor from "../dashboard/tiptap/TipTapEditor";
import Button from "../reusable-components/Button";
import { HiSparkles } from "react-icons/hi";
import AddFeatures from "./AddFeaturesDropdown";
import AnimatedText from "../reusable-components/AnimatedText";

const CompanyInfo = () => {
    const {
        control,
    } = useForm({
        defaultValues: {
            companyName: "",
        }
    });

    return (
        <section>
            <div className="mb-4 flex justify-center pt-[85px] mt-16">
                <span className="text-sm font-medium px-4 py-1 border border-gray-300 rounded-full">
                    Boost your productivity
                </span>
            </div>

            {/* Main heading */}
            <Heading className="text-center">
                <AnimatedText
                    text='Let’s Craft Your Custom Plan'
                    loop={false}
                    className="text-3xl text-center md:text-4xl font-extrabold text-[#0A0A33] dark:text-white mb-4"
                />

            </Heading>

            {/* Subtitle */}
            <Paragraph className="text-center">
                 <AnimatedText
                    text='Fill out the form below to help us understand your project. Our team will get back to you shortly'
                    loop={false}
                    speed={0.02}
                    className="text-gray-700 dark:text-gray-300 text-center max-w-2xl mx-auto text-base md:text-lg"
                /> 
            </Paragraph>

            <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-black rounded-xl shadow-lg dark:shadow-gray-300 mt-[120px] mb-[100px] ">

                <form className="space-y-6">
                    {/* Company Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Write your company name"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
                        />
                    </div>

                    {/* Company Address */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Company Address <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Write your company address"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
                        />
                    </div>

                    {/* Country & Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-black focus:ring focus:ring-blue-300 focus:outline-none"
                            >
                                <option>Select Country</option>
                                <option>USA</option>
                                <option>Bangladesh</option>
                                <option>India</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Contact Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="Write your company address"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Owner & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Owner Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Input name"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Input email address"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Delivery Date & Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Expected Delivery Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Project Budget <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter your Budget"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Project Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Short Project Description <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="companyName"
                            control={control}
                            render={({ field }) => (
                                <TipTapEditor content={field.value} onUpdate={field.onChange} />
                            )}
                        />
                    </div>

                    {/* Add Features */}
                    <AddFeatures></AddFeatures>

                    {/* Submit */}
                    <div className="mt-6 flex justify-center ">
                        <Button
                            className="bg-[#1776BB] w-[344px] hover:cursor-pointer flex justify-center hover:bg-[#0f5ed1] text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium items-center gap-2 mx-auto lg:mx-0 transition text-sm sm:text-base">
                            <HiSparkles className="text-lg sm:text-xl" />
                            Start Free Trial
                        </Button>

                    </div>
                </form>
            </div>
        </section>
    );
};

export default CompanyInfo;
