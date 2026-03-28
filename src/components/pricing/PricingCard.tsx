"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PricingCardProps {
    discountLabel?: string;
    title: string;
    price: string;
    period: string;
    externalLink: string;
    features: string[];
    extraLinks?: { label: string }[];
}

export default function PricingCard({
    discountLabel,
    title,
    price,
    period,
    externalLink,
    features,
}: PricingCardProps) {
    const router = useRouter();

    return (
        <div className="border border-gray-300 rounded-2xl p-[8px] shadow-sm max-w-sm relative h-[450px] flex flex-col">
            {/* Discount Badge */}
            {discountLabel && (
                <div className="bg-[#1776BB] text-white text-sm font-medium px-4 py-1 rounded-full inline-block mb-4 absolute top-[-15px] left-1/2 transform -translate-x-1/2">
                    {discountLabel}
                </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-[21px]">{title}</h3>

            {/* Price */}
            <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl font-bold">{price}</span>
                <span className="text-gray-500 text-lg">/{period}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-4 justify-center">
                <button onClick={() => router.push(`/pricing/pricing-details/12`)} className="bg-[#1776BB] hover:cursor-pointer text-white py-1.5 px-2 text-sm rounded-[10px] font-medium hover:bg-blue-700 transition">
                    Buy now
                </button>
                
                <Link href={externalLink} target="_blank" className="border border-[#9F9FAF] text-gray-700 dark:text-gray-300 py-1.5 px-2 text-sm rounded-[10px] font-medium hover:cursor-pointer transition">
                    Free Demo
                </Link>
            </div>

            {/* Features - Scrollable Area */}
            <div className="flex-1 min-h-0 overflow-hidden mb-4">
                <ul className="space-y-2 h-full overflow-y-auto scrollbar-hide pr-2">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span className="">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Extra Links */}
            {/* <div className="space-y-2">
                {extraLinks.map((link, i) => (
                    <div
                        key={i}
                        className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
                    >
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-[#1776BB] focus:ring-[#1776BB]"
                            checked={selectedLink === i}
                            onChange={() => handleCheckboxChange(i)}
                        />
                        {link.label}
                    </div>
                ))}
            </div> */}

        </div>
    );
}