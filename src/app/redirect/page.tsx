// src/app/redirect/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Create a separate component for the content that uses searchParams
function RedirectContent() {
  const searchParams = useSearchParams();
  const to = searchParams.get('to') || '/admin/dashboard';
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get window dimensions safely
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    console.log('RedirectPage: Switching layout to', to);
    
    // Animation for dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 300);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(dotsInterval);
          
          // Final redirect with a smooth transition
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = to;
            }
          }, 300);
          return 100;
        }
        return prev + 1;
      });
    }, 20); //! Complete in ~2 seconds

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [to]);

  // Safe function to get random position
  const getRandomPosition = (max: number) => {
    return windowSize.width > 0 ? Math.random() * max : 0;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Animated Background Particles - Fixed window reference */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={{
              x: getRandomPosition(windowSize.width),
              y: getRandomPosition(windowSize.height),
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: getRandomPosition(windowSize.width),
              y: getRandomPosition(windowSize.height),
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Animated Logo/Icon */}
        <motion.div
          className="relative mb-12"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="relative">
            {/* Outer Ring */}
            <motion.div
              className="absolute -ins-4 border-4 border-blue-400/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Middle Ring */}
            <motion.div
              className="absolute -ins-2 border-2 border-purple-400/50 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Core */}
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 40px rgba(59, 130, 246, 0.8)",
                  "0 0 20px rgba(59, 130, 246, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </motion.svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Text */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Preparing Your Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Just a moment while we set everything up{dots}
          </p>
        </motion.div>

        {/* Animated Progress Bar */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Loading</span>
            <motion.span
              key={progress}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {progress}%
            </motion.span>
          </div>
          
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            >
              {/* Shimmer effect on progress bar */}
              <motion.div
                className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["0%", "300%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>

        {/* Loading Steps Animation */}
        <div className="grid grid-cols-3 gap-4 max-w-lg w-full mb-8">
          {[
            { label: "Security Check", color: "bg-green-500" },
            { label: "Session Setup", color: "bg-blue-500" },
            { label: "Loading Data", color: "bg-purple-500" },
          ].map((step, index) => (
            <motion.div
              key={step.label}
              className="text-center"
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: progress > (index + 1) * 33 ? 1 : 0.3,
                scale: progress > (index + 1) * 33 ? 1.1 : 1
              }}
              transition={{ delay: index * 0.2 }}
            >
              <div className={`h-2 ${step.color} rounded-full mb-2`} />
              <p className="text-sm text-gray-400">{step.label}</p>
              <motion.div
                className={`w-2 h-2 ${step.color} rounded-full mx-auto mt-1`}
                animate={{ 
                  scale: progress > (index + 1) * 33 ? [1, 1.5, 1] : 1,
                  opacity: progress > (index + 1) * 33 ? [1, 0.5, 1] : 0.5
                }}
                transition={{ duration: 1, repeat: Infinity, delay: index * 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Floating Elements */}
        <div className="flex space-x-4">
          {['🔒', '⚡', '🚀', '💫'].map((emoji, index) => (
            <motion.div
              key={emoji}
              className="text-2xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 360],
              }}
              transition={{
                y: { duration: 1.5, repeat: Infinity, delay: index * 0.2 },
                rotate: { duration: 3, repeat: Infinity, delay: index * 0.5 },
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        {/* Subtle Hint */}
        <motion.p
          className="mt-12 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Experience the future of dashboard navigation
        </motion.p>

        {/* Signature/Watermark */}
        <motion.div
          className="absolute bottom-8 right-8 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-px bg-gray-600" />
              <span>Linuxeon Portal</span>
              <div className="w-16 h-px bg-gray-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Audio Visualization Effect (CSS-only) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center space-x-1">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 bg-gradient-to-t from-blue-500/30 to-purple-600/30 rounded-t"
            animate={{
              height: [10, Math.random() * 60 + 20, 10],
            }}
            transition={{
              duration: 1 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Particle Explosion on Complete - Fixed window reference */}
      <AnimatePresence>
        {progress === 100 && (
          <>
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={`explosion-${i}`}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: windowSize.width > 0 ? windowSize.width / 2 : 0,
                  y: windowSize.height > 0 ? windowSize.height / 2 : 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: windowSize.width > 0 ? windowSize.width / 2 + (Math.random() - 0.5) * 300 : 0,
                  y: windowSize.height > 0 ? windowSize.height / 2 + (Math.random() - 0.5) * 300 : 0,
                  scale: [0, 1, 0],
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: 0.5,
                  delay: Math.random() * 0.2,
                }}
                exit={{ opacity: 0 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main export with Suspense boundary
export default function RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-xl text-gray-300">Initializing redirect...</div>
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}