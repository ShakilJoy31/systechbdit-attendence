"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ServiceFAQComponent = ({ faq, index }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(-1);
    const toggleFAQ = (index: number) =>
        setOpenIndex(openIndex === index ? null : index);
    const open = openIndex === index;
    return (
        <div

            className="py-5 hover:cursor-pointer"
        >
            <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-start w-full text-left"
            >
                <div className="flex gap-6">
                    <span className="text-sky-500 dark:text-sky-300 font-medium">{faq.number}</span>
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-300 hover:cursor-pointer">
                        {faq.question}
                    </span>
                </div>

                {/* Plus/Minus with a subtle motion */}
                <motion.span
                    className="text-gray-500 text-xl leading-none"
                    animate={{ rotate: open ? 0 : 0, scale: open ? 1 : 1 }}
                >
                    {open ? "−" : "+"}
                </motion.span>
            </button>

            {/* Animated answer */}
            <AnimatePresence initial={false}>
                {open && faq.answer && (
                    <motion.div
                        id={`faq-panel-${index}`}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="ml-[3.8rem] mt-2">
                            <p className="text-gray-800 dark:text-gray-400 text-sm">
                                {faq.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ServiceFAQComponent;