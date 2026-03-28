"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function BrandSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  // Animation variants
  const pillVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };


  // Reusable pill component with 3D height
  const Pill = ({
    children,
    custom,
  }: {
    children: React.ReactNode;
    custom: number;
  }) => (
    <motion.span
      custom={custom}
      variants={pillVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`relative text-white text-base sm:text-lg font-medium tracking-wide
      rounded-full px-8 py-2 sm:py-3
      bg-gradient-to-b from-[#4b4b8a] to-[#262646]
      border border-[#5a5a9e]/40
      shadow-[0_16px_0_#1b1b35,0_10px_18px_rgba(0,0,0,0.7)]
      after:content-[''] after:absolute after:inset-0 after:rounded-full 
      after:border after:border-white/20
      after:shadow-[inset_0_2px_4px_rgba(255,255,255,0.25)]
      after:pointer-events-none`}
    >
      {children}
    </motion.span>
  );

  return (
    <div
      ref={ref}
      className="relative rounded-2xl bg-gradient-to-br from-[#0f0f25] to-[#1b1b35] border border-white/5 overflow-hidden">
      {/* Heading */}
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-snug text-center p-4 ">
        Join 1000s of brands already
        <br className="hidden sm:block" /> building with Instant.
        <br className="hidden sm:block" /> Get in on the action
      </h2>
      <p className="text-gray-400 text-sm sm:text-base text-center">
        We are always ready to assist you
      </p>

      {/* Pills + Background */}
      <div
        className="relative "
        style={{
          perspective: "1200px",
        }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            transform: "rotateX(60deg) rotateZ(45deg) scale(1.5)",
          }}
        ></div>

        {/* Pills container */}
        <div
          className="relative flex flex-col items-center space-y-8"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(55deg) rotateZ(-35deg)",
          }}
        >
          <div className="flex space-x-6">
            <Pill custom={0}>Mobile Phones</Pill>
          </div>

          <div className="flex space-x-6">
            <Pill custom={2}>galaxy s22</Pill>
            <Pill custom={3}>iphone 13 mini</Pill>
          </div>

          <div className="flex space-x-6">
            <Pill custom={4}>redmi note 11</Pill>
            <Pill custom={5}>pixel 6a</Pill>
          </div>
        </div>
      </div>
    </div>
  );
}
