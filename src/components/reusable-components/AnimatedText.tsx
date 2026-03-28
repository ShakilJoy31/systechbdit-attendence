"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  highlightColor?: string;
  speed?: number;
  delay?: number;
  triggerOnce?: boolean;
  loop?: boolean;
  loopDelay?: number;
  waveColor?: string;
  waveSpeed?: number;
  hoverScale?: number;
}

const AnimatedText = ({
  text,
  className = "",
  highlightColor = "#1776BB",
  speed = 0.05,
  delay = 0,
  triggerOnce = false,
  loop = true,
  loopDelay = 5,
  waveColor = "#EB5C2E",
  waveSpeed = 0.1,
  hoverScale = 1.1,
}: AnimatedTextProps) => {
  const [isInView, setIsInView] = useState(false);
  const [animationCycle, setAnimationCycle] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const [wavePosition, setWavePosition] = useState(-1);
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const waveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Split text into words
  const words = text.split(" ");
  
  // Calculate total characters for wave effect
  const totalChars = text.replace(/\s/g, "").length;

  // Animation for individual characters
  const charVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({ 
      opacity: 1,
      transition: { 
        delay: delay + (i * speed),
        duration: 0.1,
        onComplete: (i === totalChars - 1) ? () => {
          setTypingComplete(true);
          setWavePosition(0);
        } : undefined
      }
    })
  };

  // Animation for word highlights
  const highlightVariants: Variants = {
    hidden: { 
      width: 0,
      opacity: 0.8
    },
    visible: (i: number) => ({ 
      width: "100%",
      opacity: 0,
      transition: { 
        delay: delay + (i * 0.15),
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  // Word hover animation variants
  const wordHoverVariants: Variants = {
    normal: {
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    hovered: {
      scale: hoverScale,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  // Reset animation for looping
  const resetAnimation = () => {
    setIsInView(false);
    setTypingComplete(false);
    setWavePosition(-1);
    setHoveredWordIndex(null);
    
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
    
    setTimeout(() => {
      setIsInView(true);
    }, 50);
  };

  // Setup animation loop
  useEffect(() => {
    if (loop && isInView) {
      // Calculate total animation duration
      const totalAnimationTime = delay + (text.length * speed * 1000) + 1000; // Add 1s buffer
      
      // Set timeout to restart animation after completion + loopDelay
      loopTimeoutRef.current = setTimeout(() => {
        setAnimationCycle(prev => prev + 1);
        resetAnimation();
      }, totalAnimationTime + (loopDelay * 1000));
    }

    return () => {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, [isInView, loop, animationCycle, text.length, speed, delay, loopDelay]);

  // Handle wave effect after typing completes
  useEffect(() => {
    if (typingComplete) {
      // Start the wave effect
      waveIntervalRef.current = setInterval(() => {
        setWavePosition(prev => {
          return prev + 1;
        });
      }, waveSpeed * 1000);
    }

    return () => {
      if (waveIntervalRef.current) {
        clearInterval(waveIntervalRef.current);
      }
    };
  }, [typingComplete, totalChars, waveSpeed]);

  // Use Intersection Observer to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce && !loop) {
            observer.disconnect();
          }
        } else if (!triggerOnce && !loop) {
          setIsInView(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [triggerOnce, loop]);

  // Function to get the absolute character index
  const getAbsoluteCharIndex = (wordIndex: number, charIndex: number) => {
    let count = 0;
    for (let i = 0; i < wordIndex; i++) {
      count += words[i].length;
    }
    return count + charIndex;
  };

  // Handle word hover
  const handleWordHover = (index: number | null) => {
    setHoveredWordIndex(index);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
    >
      {/* Text content */}
      <div className="relative z-10 whitespace-pre-wrap leading-relaxed">
        {words.map((word, wordIndex) => {
          // Calculate the starting index for characters in this word
          const charStartIndex = words
            .slice(0, wordIndex)
            .reduce((acc, curr) => acc + curr.length, 0) + wordIndex;
          
          return (
            <motion.span 
              key={`${wordIndex}-${animationCycle}`} 
              className="relative inline-block mr-1.5"
              variants={wordHoverVariants}
              initial="normal"
              animate={hoveredWordIndex === wordIndex ? "hovered" : "normal"}
              onMouseEnter={() => handleWordHover(wordIndex)}
              onMouseLeave={() => handleWordHover(null)}
              whileHover="hovered"
            >
              {/* Word highlight effect - no background, just a moving line */}
              <motion.span
                custom={wordIndex}
                variants={highlightVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="absolute bottom-0 left-0 h-1 z-0 rounded-full"
                style={{ backgroundColor: highlightColor }}
              />
              
              {/* Word characters */}
              <span className="relative z-10">
                {word.split("").map((char, charIndex) => {
                  const absoluteIndex = getAbsoluteCharIndex(wordIndex, charIndex);
                  return (
                    <motion.span
                      key={`${charIndex}-${animationCycle}`}
                      custom={charStartIndex + charIndex}
                      variants={charVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      className="inline-block"
                      style={{ 
                        color: typingComplete && wavePosition === absoluteIndex ? 
                          waveColor : 'inherit',
                        transition: "color 0.2s ease"
                      }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
              
              {/* Space after word (except for last word) */}
              {wordIndex < words.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedText;