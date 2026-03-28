"use client";

import React from "react";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import AnimatedText from "../reusable-components/AnimatedText";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ClientSectionProps {
  title: string;
  description: string;
  tags: string[];
}

const ClientSection: React.FC<ClientSectionProps> = ({
  title,
  description,
  tags,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  // Tags we want to "stand vertically"
  const verticalTags = ["Design. Test. Repeat.", "Custom Design"];

  const tagVariants: Variants = {
    hidden: { y: -300, opacity: 0, rotate: 0, scale: 0.9 },
    visible: (i: number) => {
      const isVertical = verticalTags.includes(tags[i]);

      // Randomized resting state for normal tags
      const finalRotate = (i % 2 === 0 ? -15 : 15) + Math.random() * 10 - 5;
      const finalX = (i % 2 === 0 ? -10 : 10) + Math.random() * 15 - 7;
      const finalY = Math.random() * 4;

      return {
        y: [-300, -150, -50, 0 + finalY],
        x: [0, 0, 0, isVertical ? 0 : finalX],
        opacity: [0, 0.5, 0.8, 1],
        rotate: isVertical
          ? [0, 0, 0, 90] // rotate 90° for standing tags
          : [0, finalRotate * 5, -finalRotate * 3, finalRotate],
        scale: [0.9, 1.02, 0.98, 1],
        transition: {
          delay: i * 0.25,
          duration: 2,
          ease: "easeIn",
          type: "tween",
        },
      };
    },
  };

  return (
    <section
      ref={ref}
      className="bg-gray-100 dark:bg-gray-900 rounded-xl md:rounded-[24px] p-6 md:p-8 lg:p-12 relative overflow-hidden"
    >
      {/* Top Row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8 md:mb-10 lg:mb-12">
        {/* Title */}
        <Heading>
          <AnimatedText
            text={title}
            loop={false}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold max-w-2xl leading-tight text-black dark:text-white"
          />
        </Heading>

        {/* Description */}
        <Paragraph className="text-gray-600 dark:text-gray-300 max-w-md text-sm sm:text-base md:text-lg">
          {description}
        </Paragraph>
      </div>

      {/* Tags falling section */}
      <div className="relative min-h-[120px] sm:min-h-[150px] md:min-h-[200px] mt-64 md:mt-0">
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start mb-6 ">
          {tags.map((tag, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={tagVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className={`bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium inline-block shadow-md ${
                verticalTags.includes(tag) ? "origin-bottom" : ""
              }`}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Bottom Lines */}
        <div className="absolute bottom-[-12px] sm:bottom-[-16px] md:bottom-[-20px] left-0 w-full flex flex-col gap-[2px]">
          <div className="h-[1px] sm:h-[2px] bg-black dark:bg-cyan-500"></div>
          <div className="h-[1px] sm:h-[2px] bg-black dark:bg-cyan-500"></div>
          <div className="h-[1px] sm:h-[2px] bg-black dark:bg-cyan-500"></div>
          <div className="h-[1px] sm:h-[2px] bg-black dark:bg-cyan-500"></div>
          <div className="h-[1px] sm:h-[2px] bg-black dark:bg-cyan-500"></div>
        </div>
      </div>
    </section>
  );
};

export default ClientSection;
