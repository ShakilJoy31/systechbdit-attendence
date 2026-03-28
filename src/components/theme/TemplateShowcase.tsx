"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, ShoppingCart, Star } from "lucide-react";
import Button from "../reusable-components/Button";
import { useRouter } from "next/navigation";

// Define the interfaces
export interface ThemeImage {
  id: number;
  themeId: number;
  image: string;
}

export interface Theme {
  id: number;
  name: string;
  description: string;
  link: string;
  image?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  ThemeImage: ThemeImage[];
}

export interface ThemesResponse {
  success: boolean;
  statusCode: number;
  meta: {
    page: number;
    size: number;
    total: number;
    totalPage: number;
  };
  message: string;
  data: Theme[];
}

interface TemplateShowcaseProps {
  themesData: ThemesResponse;
}

// Default templates data in case API fails
const defaultTemplates = [
    {
        id: 1,
        name: "Borcelle E-Commerce",
        category: "eCommerce & Marketplace",
        description: "A sleek, modern e-commerce template with advanced product filtering, cart functionality, and seamless checkout process.",
        image: "/Project-Screenshot/e-commerce.png",
        liveUrl: "https://e-commerce-template-olive-seven.vercel.app",
        price: "$89",
        features: ["Responsive Design", "Dark Mode", "Product Reviews", "Wishlist", "Cart"],
        rating: 4.9,
        sales: 1247
    },
    {
        id: 2,
        name: "Gramer Hut",
        category: "Organic Food",
        description: "Fresh and clean design for organic food stores with recipe sections, delivery tracking, and subscription options.",
        image: "/Project-Screenshot/gramer-hut.png",
        liveUrl: "https://gramer-haat.vercel.app",
        price: "$79",
        features: ["Organic Food", "Delivery Tracking", "Subscription Box", "Farm Stories"],
        rating: 4.8,
        sales: 892
    },
    {
        id: 3,
        name: "Fashnova",
        category: "eCommerce & Marketplace",
        description: "High-tech template for electronics stores with comparison tools, tech specs, and customer support integration.",
        image: "/Project-Screenshot/fashinova.png",
        liveUrl: "https://fashnova-kappa.vercel.app",
        price: "$95",
        features: ["Fashion", "Catogories", "Men", "Women", "Child"],
        rating: 4.7,
        sales: 756
    },
    {
        id: 4,
        name: "Taste Hub",
        category: "Restaurant",
        description: "Trendy fashion template with lookbook, size guides, and social media integration for clothing brands.",
        image: "/Project-Screenshot/taste-hub.png",
        liveUrl: "https://taste-hub-jjsf.vercel.app",
        price: "$85",
        features: ["Lookbook", "Size Guide", "Social Feed", "Style Quiz"],
        rating: 4.9,
        sales: 1345
    },
    {
        id: 5,
        name: "Car Garage",
        category: "Showroom",
        description: "Trendy fashion template with lookbook, size guides, and social media integration for clothing brands.",
        image: "/Project-Screenshot/car-garage.png",
        liveUrl: "https://car-garage-xi.vercel.app",
        price: "$85",
        features: ["Lookbook", "Size Guide", "Social Feed", "Style Quiz"],
        rating: 4.5,
        sales: 445
    },
    {
        id: 6,
        name: "Juyela",
        category: "Fashion",
        description: "Trendy fashion template with lookbook, size guides, and social media integration for clothing brands.",
        image: "/Project-Screenshot/juyela.png",
        liveUrl: "https://juyala.vercel.app",
        price: "$85",
        features: ["Lookbook", "Size Guide", "Social Feed", "Style Quiz"],
        rating: 4.8,
        sales: 745
    }
];

// Function to transform API data to template format
function transformApiDataToTemplates(apiData: Theme[]) {
  return apiData.map(theme => ({
    id: theme.id,
    name: theme.name,
    category: theme.category,
    description: theme.description,
    // Use the first image from ThemeImage array if available, otherwise use the image field or default
    image: theme.ThemeImage && theme.ThemeImage.length > 0 
      ? theme.ThemeImage[0].image 
      : theme.image || "/default-template-image.jpg",
    liveUrl: theme.link,
    price: "$79",
    features: ["Responsive Design", "Modern UI", "Fast Performance"],
    rating: 4.8,
    sales: 500
  }));
}

export default function TemplateShowcase({ themesData }: TemplateShowcaseProps) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);

    console.log(themesData)

    const router = useRouter();

    // Use API data if available, otherwise use default templates
    const apiTemplates = themesData.success && themesData.data.length > 0 
        ? transformApiDataToTemplates(themesData.data)
        : [];

    const allTemplates = apiTemplates.length > 0 ? apiTemplates : defaultTemplates;

    // Get unique categories from templates
    const categories = useMemo(() => {
        const uniqueCategories = new Set(allTemplates.map(template => template.category));
        return ['All', ...Array.from(uniqueCategories)];
    }, [allTemplates]);

    // Filter templates based on selected category
    const filteredTemplates = useMemo(() => 
        selectedCategory === 'All'
            ? allTemplates
            : allTemplates.filter(template => template.category === selectedCategory),
        [selectedCategory, allTemplates]
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Templates
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Handpicked templates designed to help you launch your online business faster
                    </p>
                </motion.div>

                {/* Filter Buttons */}
                <div className="relative mb-8">
                    <div className="flex overflow-x-auto pb-2 hide-scrollbar md:overflow-visible">
                        <div className="flex space-x-2 min-w-max md:min-w-0 bg-gray-50 dark:bg-gray-900 rounded-lg p-1 shadow-sm">
                            {categories.map((projectCategory) => (
                                <Button
                                    key={projectCategory}
                                    onClick={(e) => {
                                        setSelectedCategory(projectCategory);

                                        // Scroll the button into view if it's partially visible
                                        const button = e.currentTarget;
                                        const buttonRect = button.getBoundingClientRect();

                                        // Check if button is partially out of view on the right or left
                                        const isPartiallyVisible = (
                                            buttonRect.left >= 0 &&
                                            buttonRect.right <= window.innerWidth
                                        );

                                        // If not fully visible, scroll it into view
                                        if (!isPartiallyVisible) {
                                            button.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'nearest',
                                                inline: 'center'
                                            });
                                        }
                                    }}
                                    className={`flex-shrink-0 px-4 py-2 rounded-lg hover:cursor-pointer font-semibold transition-colors duration-200 ${selectedCategory === projectCategory
                                        ? "bg-[#1776BB] text-white"
                                        : "text-gray-700 dark:text-gray-200"
                                        }`}
                                >
                                    {projectCategory}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Templates Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    <AnimatePresence>
                        {filteredTemplates.map((template) => (
                            <motion.div
                                key={template.id}
                                layout
                                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                                onMouseEnter={() => setHoveredTemplate(template.id)}
                                onMouseLeave={() => setHoveredTemplate(null)}
                                whileHover={{ y: -10 }}
                            >
                                {/* Image Container with Scroll Effect */}
                                <div className="relative h-64 overflow-hidden">
                                    <motion.div
                                        animate={{
                                            y: hoveredTemplate === template.id ? "-100%" : "0"
                                        }}
                                        transition={{ duration: 8, ease: "linear" }}
                                        className="w-full h-[1100%]"
                                    >
                                        <Image
                                            src={template.image}
                                            alt={template.name}
                                            fill
                                            className="object-cover object-top"
                                            onError={(e) => {
                                                // Fallback image if the main image fails to load
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/default-template-image.jpg";
                                            }}
                                        />
                                    </motion.div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

                                    {/* Hover Actions */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileHover={{ opacity: 1, y: 0 }}
                                        className="absolute inset-0 flex items-center justify-center gap-4"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(template.liveUrl, '_blank');
                                            }}
                                        >
                                            <ExternalLink size={20} />
                                        </motion.button>
                                    </motion.div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                                        {template.category}
                                    </div>

                                    {/* Rating */}
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">{template.rating}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {template.name}
                                        </h3>
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {template.price}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                        {template.description}
                                    </p>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {template.features.slice(0, 2).map((feature, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                        {template.features.length > 2 && (
                                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                                                +{template.features.length - 2} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {template.sales.toLocaleString()} sales
                                        </div>
                                        <motion.button onClick={()=> router.push('/pricing/pricing-details/customer-info-fields')}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
                                        >
                                            <ShoppingCart size={16} />
                                            Purchase
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No templates found for the &quot;{selectedCategory}&quot; category.
                        </p>
                    </motion.div>
                )}

                {/* Add this to your global CSS or in a style tag */}
                <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        </section>
    );
}