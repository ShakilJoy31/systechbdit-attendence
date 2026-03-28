// components/RecentWork.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Palette,
  Code,
  TrendingUp,
  PenTool,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";

export default function RecentWork() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, });

  const services = [
    {
      icon: Palette,
      title: "Design",
      description: "Stunning visual experiences that captivate and engage your audience",
      color: "bg-[#1776ba73]",
      bgColor: "bg-gradient-to-br from-[#1776BA]/10 to-[#EE5F33]/10",
      delay: 0.1
    },
    {
      icon: Code,
      title: "Development",
      description: "Robust, scalable solutions built with cutting-edge technologies",
      color: "bg-[#1776ba73]",
      bgColor: "bg-gradient-to-br from-[#1776BA]/10 to-[#EE5F33]/10",
      delay: 0.2
    },
    {
      icon: TrendingUp,
      title: "Marketing",
      description: "Data-driven strategies to amplify your brand's reach and impact",
      color: "bg-[#1776ba73]",
      bgColor: "bg-gradient-to-br from-[#1776BA]/10 to-[#EE5F33]/10",
      delay: 0.3
    },
    {
      icon: PenTool,
      title: "Writing",
      description: "Compelling content that tells your story and drives engagement",
      color: "bg-[#1776ba73]",
      bgColor: "bg-gradient-to-br from-[#1776BA]/10 to-[#EE5F33]/10",
      delay: 0.4
    }
  ];

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
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center px-4 py-20 lg:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#1776BA]/20 to-[#EE5F33]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#1776BA]/20 to-[#EE5F33]/20 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >

          {/* Left Column - Content */}
          <motion.div
            className="relative"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#1776BA]" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recent Work Showcase
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="mb-6">
              <Heading className="text-3xl md:text-4xl lg:text-5xl font-bold ">
                <span className="bg-gradient-to-r from-[#1776BA] to-[#EE5F33] bg-clip-text text-transparent">
                  Delivered Consistently
                </span>
              </Heading>
            </div>

            {/* Description */}
            <motion.div
              className="mb-6"
            >
              <Paragraph className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                We take a comprehensive approach to the creation and development of brands,
                helping local companies enter the market and established brands expand their audience
                with innovative solutions.
              </Paragraph>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mb-6"
            >
              {[
                { number: "150+", label: "Projects" },
                { number: "98%", label: "Success Rate" },
                { number: "50+", label: "Happy Clients" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className=""
                >
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1776BA] to-[#EE5F33] bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1776BA] to-[#EE5F33] text-white font-semibold rounded-2xl shadow-2xl shadow-[#1776BA]/25 hover:shadow-[#1776BA]/40 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">View All Projects</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />

              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.button>
          </motion.div>

          {/* Right Column - Services Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 gap-4 md:gap-6 "
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                custom={service.delay}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group relative p-6 rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-black/5 hover:shadow-2xl hover:shadow-[#1776BA]/10 transition-all duration-500 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${service.bgColor}`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${service.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-6 h-6 text-[#EE5F33] " />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#1776BA] group-hover:to-[#EE5F33] group-hover:bg-clip-text transition-all duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {service.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-[#1776BA]" />
                  </div>
                </div>

                {/* Border Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${service.color} -z-10`}>
                  <div className="absolute inset-[2px] rounded-3xl bg-white dark:bg-gray-900" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-10 left-10 w-4 h-4 bg-[#1776BA] rounded-full opacity-60 blur-sm"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-10 right-10 w-3 h-3 bg-[#EE5F33] rounded-full opacity-60 blur-sm"
        />
      </div>
    </section>
  );
}