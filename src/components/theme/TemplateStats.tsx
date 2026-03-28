"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
    { number: "50", symbol: '+', label: "Premium Templates" },
    { number: "100", symbol: '+', label: "Responsive Design" },
    { number: "24", symbol: '/', label: "Support Included" },
    { number: "99", symbol: '+', label: "Client Satisfaction" }
];

export default function TemplateStats() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <section ref={ref} className="bg-gray-50 dark:bg-gray-800 py-16">
            <div className="max-w-[1280px] mx-auto px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="text-center"
                        >
                            <motion.div
                                className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : { scale: 0 }}
                                transition={{ 
                                    delay: index * 0.1 + 0.3,
                                    type: "spring",
                                    stiffness: 200
                                }}
                            >
                                {stat.number} <span className="text-[#EE5F33] ml-[-10px] ">{stat?.symbol}</span> <span className="ml-[-10px] ">{stat.number === '24' ? '7' : ''}</span>
                            </motion.div>
                            <div className="text-gray-600 dark:text-gray-300 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}