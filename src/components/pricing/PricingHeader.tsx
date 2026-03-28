"use client"

import { useState, useMemo } from "react";
import AnimatedText from "../reusable-components/AnimatedText";
import Button from "../reusable-components/Button";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import PricingCard from "./PricingCard";

export default function PricingHeader() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All Plans');
    
    const categories = ['All Plans', 'Startup', 'Business', 'Enterprise', 'Pay As You Go', 'Non-Profit', 'Agency', 'Developer', 'Reseller'];

    const pricingPlans = [
        {
            discountLabel: "20% Off Annual",
            title: "Startup Plan",
            externalLink: "",
            price: "$49",
            period: "month",
            features: [
                "10,000 SMS/month",
                "Basic API Access",
                "Web Dashboard",
                "Email Support",
                "Delivery Reports",
                "SMS Templates"
            ],
            extraLinks: [
                { label: "Global Coverage" },
                { label: "99.9% Uptime" },
                { label: "24/7 Monitoring" },
            ]
        },
        {
            discountLabel: "Most Popular",
            title: "Business Plan",
            externalLink: "",
            price: "$99",
            period: "month",
            features: [
                "50,000 SMS/month",
                "Full API Access",
                "Priority Support",
                "Two-Way SMS",
                "Scheduled Campaigns",
                "Advanced Analytics"
            ],
            extraLinks: [
                { label: "Dedicated Account Manager" },
                { label: "SLA: 99.9%" },
                { label: "Bulk Import Tools" },
            ]
        },
        {
            discountLabel: "Custom Pricing",
            title: "Enterprise",
            externalLink: "",
            price: "Custom",
            period: "quote",
            features: [
                "Unlimited SMS Volume",
                "Dedicated Short Code",
                "24/7 Phone Support",
                "Custom Integrations",
                "Advanced Security",
                "SMS Gateway"
            ],
            extraLinks: [
                { label: "Dedicated Support Team" },
                { label: "Custom SLAs Available" },
                { label: "Enterprise Security" },
            ]
        },
        {
            discountLabel: "Flexible",
            title: "Pay As You Go",
            externalLink: "",
            price: "$0.01",
            period: "per SMS",
            features: [
                "No Monthly Commitment",
                "Pay Only For What You Use",
                "Real-Time Billing",
                "All API Features",
                "Basic Support",
                "Usage Dashboard"
            ],
            extraLinks: [
                { label: "No Contract Required" },
                { label: "Instant Activation" },
                { label: "Volume Discounts" },
            ]
        },
        {
            discountLabel: "30% Off",
            title: "Non-Profit",
            externalLink: "",
            price: "$29",
            period: "month",
            features: [
                "25,000 SMS/month",
                "Non-Profit Discount",
                "Priority Routing",
                "Compliance Assistance",
                "Donor Management Tools",
                "Basic Analytics"
            ],
            extraLinks: [
                { label: "501(c)(3) Verification Required" },
                { label: "Charity Tools Included" },
                { label: "Volunteer Management" },
            ]
        },
        {
            discountLabel: "Agency Discount",
            title: "Agency",
            externalLink: "",
            price: "$199",
            period: "month",
            features: [
                "100,000 SMS/month",
                "Multi-Client Dashboard",
                "White Label Option",
                "Client Reporting Tools",
                "API Rate Limit: 1000/min",
                "Bulk Campaign Management"
            ],
            extraLinks: [
                { label: "White Label Available" },
                { label: "Client Management Tools" },
                { label: "Agency Support Portal" },
            ]
        },
        {
            discountLabel: "Developer Friendly",
            title: "Developer",
            externalLink: "",
            price: "$79",
            period: "month",
            features: [
                "30,000 SMS/month",
                "Full API & Webhooks",
                "SDK Libraries",
                "Developer Documentation",
                "Test Environment",
                "Sandbox Mode"
            ],
            extraLinks: [
                { label: "All Programming Languages" },
                { label: "Webhook Support" },
                { label: "GitHub Integration" },
            ]
        },
        {
            discountLabel: "Wholesale Pricing",
            title: "Reseller",
            externalLink: "",
            price: "$299",
            period: "month",
            features: [
                "250,000 SMS/month",
                "Full White Label Solution",
                "Reseller Dashboard",
                "Sub-Account Management",
                "Branded Portal",
                "Reseller Support"
            ],
            extraLinks: [
                { label: "Full White Labeling" },
                { label: "Revenue Share Options" },
                { label: "Reseller Training" },
            ]
        }
    ];

    // Filter pricing plans based on selected category
    const filteredPricingPlans = useMemo(() => {
        console.log("Selected Category:", selectedCategory);
        
        if (selectedCategory === 'All Plans') {
            const allPlans = pricingPlans;
            console.log("Showing all plans:", allPlans.length);
            return allPlans;
        }
        
        const filtered = pricingPlans.filter(plan => plan.title === selectedCategory);
        console.log(`Filtered plans for "${selectedCategory}":`, filtered);
        return filtered;
    }, [selectedCategory, pricingPlans]);

    const handleCategoryClick = (category: string, e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Category clicked:", category);
        setSelectedCategory(category);

        // Scroll the button into view if it's partially visible
        const button = e.currentTarget;
        const buttonRect = button.getBoundingClientRect();

        // Check if button is partially out of view on the right or left
        const isPartiallyVisible = (
            buttonRect.left >= 0 &&
            buttonRect.right <= window.innerWidth
        );

        // If not fully visible, scroll it into view
        if (!isPartiallyVisible) {
            button.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    };

    return (
        <section className="text-center py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6">
            {/* Small pill text */}
            <div className="inline-block mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-medium px-3 py-1 sm:px-4 sm:py-1 border border-gray-300 rounded-full">
                    Transparent SMS Pricing
                </span>
            </div>

            {/* Main heading */}
            <Heading>
                <AnimatedText
                    text="SMS Service Pricing Plans"
                    loop={true}
                    loopDelay={5}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0A0A33] dark:text-white mb-3 sm:mb-4"
                />
            </Heading>

            {/* Subtitle */}
            <Paragraph className="text-gray-700 dark:text-gray-300 max-w-md sm:max-w-xl md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                <AnimatedText
                    text='Choose the perfect SMS plan for your business needs. All plans include 99.9% delivery guarantee, real-time analytics, and 24/7 support.'
                    loop={false}
                    speed={0.005}
                />
            </Paragraph>

            {/* Category Filter */}
            <div className="relative mb-8 mt-6 max-w-[1280px] mx-auto ">
                <div className="flex overflow-x-auto pb-2 hide-scrollbar md:overflow-visible">
                    <div className="flex space-x-2 min-w-max md:min-w-0 bg-gray-50 dark:bg-gray-900 rounded-lg p-1 shadow-sm">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                onClick={(e) => handleCategoryClick(category, e)}
                                className={`flex-shrink-0 px-4 py-2 rounded-lg hover:cursor-pointer font-semibold transition-colors duration-200 whitespace-nowrap ${
                                    selectedCategory === category
                                        ? "bg-[#1776BB] text-white shadow-md"
                                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
                
            </div>

            {/* Cards container */}
            <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 max-w-[1280px] mx-auto">
                {filteredPricingPlans.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No plans found for {selectedCategory}
                        </p>
                        <Button
                            onClick={() => setSelectedCategory('All Plans')}
                            className="mt-4 bg-[#1776BB] text-white px-6 py-2 rounded-lg hover:bg-[#1466a3] transition-colors"
                        >
                            Show All Plans
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-6 ">
                        {filteredPricingPlans.map((plan, index) => (
                            <div key={`${plan.title}-${index}`} className="w-full max-w-[350px] md:max-w-none">
                                <PricingCard
                                    discountLabel={plan.discountLabel}
                                    title={plan.title}
                                    price={plan.price}
                                    period={plan.period}
                                    externalLink={plan?.externalLink}
                                    features={plan.features}
                                    extraLinks={plan.extraLinks}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}