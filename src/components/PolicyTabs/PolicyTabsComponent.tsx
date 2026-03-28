"use client";

import React, { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../reusable-components/Button";
import { tabs } from "@/utils/constant/policyData";

export default function PolicyTabs() {
    const [active, setActive] = useState<string>(tabs[0].id);

    function onKey(e: KeyboardEvent<HTMLButtonElement>, id: string) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActive(id);
        }
    }

    return (
        <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-start">

                {/* Mobile segmented control */}
                <div className="md:hidden mb-6">
                    <div className="flex overflow-x-auto space-x-2 p-1 bg-gray-100 rounded-xl">
                        {tabs.map((t) => {
                            const isActive = t.id === active;
                            return (
                                <Button
                                    key={t.id}
                                    onClick={() => setActive(t.id)}
                                    onKeyDown={(e) => onKey(e, t.id)}
                                    className={`flex-1 whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                        isActive
                                            ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow"
                                            : "text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {t.title}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop sidebar */}
                <aside
                    className="hidden md:block rounded-lg border border-gray-300 p-6 h-min bg-white shadow-sm sticky top-24 self-start"
                    aria-label="Policy Navigation"
                >
                    <ul className="space-y-4">
                        {tabs.map((t) => {
                            const isActive = t.id === active;
                            return (
                                <li key={t.id}>
                                    <Button
                                        onClick={() => setActive(t.id)}
                                        onKeyDown={(e) => onKey(e, t.id)}
                                        aria-current={isActive ? "true" : "false"}
                                        className={`w-full hover:cursor-pointer flex items-center gap-3 text-left px-2 py-1.5 rounded transition-colors focus:outline-none ${
                                            isActive
                                                ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white"
                                                : "hover:bg-gray-50 focus:bg-gray-50"
                                        }`}
                                    >
                                        <span
                                            aria-hidden
                                            className={`flex-shrink-0 w-3 h-3 rounded-full transition-colors ${
                                                isActive ? "bg-black" : "bg-gray-300"
                                            }`}
                                        />
                                        <span
                                            className={`text-sm font-medium ${
                                                isActive ? "text-white" : "text-gray-600"
                                            }`}
                                        >
                                            {t.title}
                                        </span>
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                {/* Right content */}
                <main className="prose prose-sm md:prose md:prose-lg max-w-none text-gray-800">
                    <AnimatePresence mode="wait">
                        {tabs.map((t) =>
                            t.id === active ? (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -12 }}
                                    transition={{ duration: 0.28 }}
                                >
                                    <div className="mb-4">{t.content}</div>
                                </motion.div>
                            ) : null
                        )}
                    </AnimatePresence>
                </main>
                
            </div>
        </section>
    );
}
