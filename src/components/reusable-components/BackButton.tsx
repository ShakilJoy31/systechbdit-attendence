import React from 'react';
import { motion } from "framer-motion";
import { ArrowLeft } from 'lucide-react';


const BackButton: React.FC = () => {
    return (
        <div className="flex items-center gap-4">
            <motion.button
                onClick={() => window.history.back()}
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-3 hover:cursor-pointer bg-gradient-to-r from-blue-900/30 to-purple-900/30 hover:from-blue-900/40 hover:to-purple-900/40 border border-blue-700/30 hover:border-blue-500/50 rounded-xl px-5 py-3 transition-all duration-300 overflow-hidden"
            >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                {/* Icon */}
                <ArrowLeft className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />

                {/* Text */}
                <span className="text-white hidden sm:block font-medium relative">
                    Return
                </span>

                {/* Hover effect dot */}
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                    <div className="h-2 w-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-pulse" />
                </div>
            </motion.button>
        </div>
    );
};

export default BackButton;