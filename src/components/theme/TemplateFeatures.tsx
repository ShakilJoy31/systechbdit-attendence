"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, Zap, Smartphone, Shield, Code, Palette } from "lucide-react";

const features = [
    {
        icon: Smartphone,
        title: "Mobile First Design",
        description: "Every template is designed mobile-first with perfect responsiveness across all devices."
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Optimized for speed with lazy loading, image optimization, and minimal bundle sizes."
    },
    {
        icon: Shield,
        title: "Secure & Reliable",
        description: "Built with security best practices and regular updates to keep your store safe."
    },
    {
        icon: Code,
        title: "Clean Code",
        description: "Well-documented, modular code that's easy to customize and extend for your needs."
    },
    {
        icon: Palette,
        title: "Easy Customization",
        description: "Change colors, fonts, and layouts with simple configuration files or visual editors."
    },
    {
        icon: CheckCircle,
        title: "SEO Optimized",
        description: "Built-in SEO features to help your store rank higher in search engine results."
    }
];

export default function TemplateFeatures() {
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
        <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Why Choose Our Templates?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Built with modern technology and best practices to ensure your success
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ 
                                y: -5,
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 group cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-4">
                                <motion.div
                                    className="flex-shrink-0 w-12 h-12 bg-[#1776BA] dark:bg-[#1776ba73] rounded-xl flex items-center justify-center group-hover:text-white transition-colors duration-300"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <feature.icon className="w-6 h-6 text-[#EE5F33] " />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}