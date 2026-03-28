"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "../reusable-components/Button";
import { HiSparkles } from "react-icons/hi";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import { useRouter } from "next/navigation";
import { reviews } from "@/utils/constant/reviewers";

// Dummy reviews data - 8 reviews for each star rating (5 to 1)


const ReviewSection = () => {
    const router= useRouter();

    const [selectedStars, setSelectedStars] = useState<number>(5);
    const filteredReviews = reviews.filter((r) => r.stars === selectedStars);

    return (
        <section className="w-full py-12 bg-gray-50 dark:bg-gray-800 rounded-[24px] mb-[10px] ">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Heading */}
                <div className="text-center mb-6">
                    <Heading className="text-3xl font-bold text-black dark:text-white">
                        Loved by{" "}
                        <span className="text-blue-700">customers</span> everywhere
                    </Heading>
                    <Paragraph className="text-gray-500 mt-2">
                        See what our users say about our products and services
                    </Paragraph>
                </div>

                
                <div className="flex justify-center mb-8">
                    <div className="flex bg-gray-50 dark:bg-gray-900 rounded-lg p-1 shadow-sm">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <Button
                                key={star}
                                onClick={() => setSelectedStars(star)}
                                className={`flex items-center justify-center px-4 py-2 rounded-lg hover:cursor-pointer text-base font-semibold transition-colors duration-200 ${selectedStars === star
                                    ? "bg-[#1776BB] text-white dark:text-black"
                                    : "bg-transparent text-gray-900 dark:text-gray-300"
                                    }`}
                            >
                                {star}
                                <span className="ml-1 text-yellow-400">★</span>
                            </Button>
                        ))}
                    </div>
                </div>


                {/* Reviews Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredReviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white dark:bg-black dark:border border-gray-300 rounded-xl shadow p-5 flex flex-col hover:shadow-md transition"
                        >
                            {/* Avatar + Name */}
                            <div className="flex items-center mb-3">
                                <div className="relative w-10 h-10">
                                    <Image
                                        src={review.avatar}
                                        alt={review.name}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div className="ml-3">
                                    <Heading className="font-semibold text-[16px] ">{review.name}</Heading>
                                    <Paragraph className="text-xs text-gray-500 dark:text-gray-300">{review.role}</Paragraph>
                                </div>
                            </div>

                            {/* Product Name */}
                            <Paragraph className="text-sm font-medium text-gray-500 dark:text-gray-300">{review.product}</Paragraph>

                            {/* Stars */}
                            <div className="flex items-center text-yellow-400 text-sm my-2">
                                {"★".repeat(review.stars)}
                                {"☆".repeat(5 - review.stars)}
                            </div>

                            {/* Review Text */}
                            <Paragraph className="text-sm text-gray-500 dark:text-gray-300 flex-grow">
                                {review.text}
                            </Paragraph>

                            {/* Date */}
                            <Paragraph className="text-xs text-gray-400 mt-3">{review.date}</Paragraph>
                        </div>
                    ))}
                </div>

               <div className="flex justify-center ">
                 <Button onClick={()=> router.push('/contact')}
                    className="bg-[#1776BB] hover:cursor-pointer hover:bg-[#0f5ed1] mt-[38px] flex justify-center text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium items-center gap-2 mx-auto lg:mx-0 transition text-sm sm:text-base">
                    <HiSparkles className="text-lg sm:text-xl" />
                    Let&apos;s build something
                </Button>
               </div>
               
            </div>
        </section>
    );
};

export default ReviewSection;