// components/ProjectCard.tsx
"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  liveLink: string;
  id: number;
}

export default function ProjectCard({ title, subtitle, description, image, liveLink, id }: ProjectCardProps) {
    const router = useRouter();
    return (
        <motion.div 
            className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 h-[480px] flex flex-col hover:scale-[1.02] hover:-translate-y-2"
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Image Container with Fixed Height */}
            <div onClick={() => router.push(`/projects/project-details/${id}`)} className="relative h-64 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    priority
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Subtle Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-300" />
            </div>

            {/* Text Content */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div onClick={() => router.push(`/projects/project-details/${id}`)}>
                    {/* Title with Gradient Text */}
                    <h3 className="text-xl font-bold mb-2 h-12">
                        <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            {title}{" "}
                        </span>
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            {subtitle}
                        </span>
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {description}
                    </p>
                </div>
                
                {/* Bottom Action Area */}
                <div className="mt-2 pt-2 border-t border-gray-800 dark:border-gray-100">
                    <div onClick={() => window.open(liveLink, "_blank")} className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            View Live Project
                        </span>
                        <motion.div 
                            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                        >
                            <FiArrowUpRight className="text-sm" />
                        </motion.div>
                    </div>
                </div>

            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </motion.div>
    );
}