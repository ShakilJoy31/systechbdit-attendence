"use client";
import { useState } from "react";
import { FaPaypal } from "react-icons/fa";
import { SiAmazonpay, SiVenmo } from "react-icons/si";
import { MdCreditCard } from "react-icons/md";
import { RiCashLine } from "react-icons/ri";
import Button from "../reusable-components/Button";
import { HiSparkles } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function PaymentMethod() {
    const [selected, setSelected] = useState("card");
    const router = useRouter();
    const paymentOptions = [
        { id: "cash", label: "Cash on Delivery", icon: <RiCashLine className="text-orange-500 text-2xl sm:text-[32px]" /> },
        { id: "venmo", label: "Venmo", icon: <SiVenmo className="text-blue-500 text-2xl sm:text-[32px]" /> },
        { id: "paypal", label: "PayPal", icon: <FaPaypal className="text-blue-600 text-2xl sm:text-[32px]" /> },
        { id: "amazon", label: "Amazon Pay", icon: <SiAmazonpay className="text-black dark:text-white text-2xl sm:text-[32px]" /> },
        { id: "card", label: "Card", icon: <MdCreditCard className="text-orange-500 text-2xl sm:text-[32px]" /> },
    ];

    return (
        <div className="bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-300 p-4 sm:p-6 max-w-full sm:max-w-[942px] mx-auto mb-8 sm:mb-[87px]">
            {/* Title */}
            <h2 className="text-lg font-semibold mb-3 sm:mb-4">Payment Method</h2>

            {/* Country */}
            <div className="mb-4 sm:mb-6">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 ">Country/region</label>
                <div className="relative">
                    <input
                        type="text"
                        value="Dhaka"
                        readOnly
                        className="w-full border rounded-md px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="absolute right-3 top-2 text-gray-400">▼</span>
                </div>
            </div>

            {/* Payment Options */}
            <div className="border dark:border-gray-300 rounded-md">
                <div className="px-3 sm:px-4 py-2 sm:py-3 border-b dark:border-gray-300 mb-2">
                    <span className="font-medium text-sm sm:text-base">Payment Option</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0">
                    {paymentOptions.map((option) => (
                        <label
                            key={option.id}
                            className="flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 sm:p-4 cursor-pointer"
                        >
                            {option.icon}
                            <span className="text-xs sm:text-sm text-center ">{option.label}</span>
                            <input
                                type="radio"
                                name="payment"
                                checked={selected === option.id}
                                onChange={() => setSelected(option.id)}
                                className="accent-orange-500 mt-1"
                            />
                        </label>
                    ))}
                </div>

                {/* Card Fields */}
                {selected === "card" && (
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 ">Name on Card</label>
                            <input
                                type="text"
                                className="w-full border dark:border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Card Number</label>
                            <input
                                type="text"
                                className="w-full border dark:border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Expire Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className="w-full border dark:border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">CVC</label>
                                <input
                                    type="text"
                                    className="w-full border dark:border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Button */}
            <div className="mt-4 sm:mt-6 flex justify-center">
                <Button
                    onClick={() => router.push('/pricing/pricing-details/upload-company-information')}
                    className="bg-[#1776BB] w-full sm:w-[344px] hover:cursor-pointer flex justify-center hover:bg-[#0f5ed1] text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg font-medium items-center gap-2 transition text-sm sm:text-base"
                >
                    <HiSparkles className="text-base sm:text-lg" />
                    Start Free Trial
                </Button>
            </div>
        </div>
    );
}