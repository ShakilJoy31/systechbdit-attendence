"use client";

import { Phone, Shield, Zap, Clock } from "lucide-react";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import Button from "../reusable-components/Button";
import { useRouter } from "next/navigation";

export default function WhyTechElement() {
  const router = useRouter();
  
  const items = [
    {
      number: "01",
      title: "High Delivery Rate",
      description: "Achieve 99.9% message delivery rate with our advanced routing algorithms and global carrier partnerships ensuring your SMS reach customers reliably.",
      icon: <Shield size={24} />
    },
    {
      number: "02",
      title: "Real-Time Analytics",
      description: "Monitor campaign performance with live dashboards, delivery reports, and engagement metrics to optimize your SMS marketing strategy.",
      icon: <Zap size={24} />
    },
    {
      number: "03",
      title: "24/7 Support",
      description: "Get expert assistance anytime with our dedicated support team. We ensure your SMS campaigns run smoothly around the clock.",
      icon: <Clock size={24} />
    },
  ];

  return (
    <section className="bg-white dark:bg-black rounded-2xl px-4 md:px-10 py-12 lg:mx-4 md:mx-2 mx-1 mb-[5px] ">
      {/* Heading */}
      <div className="text-center mb-10">
        <Heading className="text-2xl md:text-3xl lg:text-4xl text-black dark:text-white font-bold">
          Why Choose Our{" "}
          <span className="text-blue-600">SMS Platform</span>
        </Heading>
        <Paragraph className="text-gray-700 dark:text-gray-300 mt-3 max-w-3xl mx-auto">
          Experience reliable, scalable, and feature-rich SMS solutions designed to boost your customer engagement and business growth
        </Paragraph>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-b from-[#F6F9FC] to-[#E9E9FF] hover:bg-none hover:border dark:bg-none dark:border dark:border-gray-500 hover:border-gray-500 rounded-3xl p-6 shadow-sm transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-blue-600 font-medium">{item.number}</span>
              <div className="text-blue-600">
                {item.icon}
              </div>
            </div>
            <Heading className="text-lg font-bold mt-2 text-black dark:text-white">{item.title}</Heading>
            <Paragraph className="text-gray-600 dark:text-gray-300 text-sm mt-3">{item.description}</Paragraph>
          </div>
        ))}
      </div>

      {/* Contact Button */}
      <div className="flex justify-center mt-10">
        <Button onClick={()=> router.push('/contact')} className="flex items-center gap-2 bg-[#1776BB] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          <Phone size={18} /> Get Free Consultation
        </Button>
      </div>
    </section>
  );
}