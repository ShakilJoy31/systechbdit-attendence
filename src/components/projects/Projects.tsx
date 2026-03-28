"use client";

import { useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import { GoDotFill } from "react-icons/go";
import Button from "../reusable-components/Button";
import { ProjectsResponse, Project } from "@/utils/helper/projectDataFetching";

interface ProjectsProps {
    projectsData?: ProjectsResponse;
}

export default function Projects({ projectsData }: ProjectsProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
    
    console.log(projectsData)
    
    // Transform API data to match your component's needs
    const transformApiData = (apiProjects: Project[]) => {
        return apiProjects.map((project) => ({
            id: project.id,
            title: project.name,
            subtitle: "- Project",
            description: project.description,
            category: project.category,
            liveLink: project.link,
            // Use the first image from ProjectImage array if available, otherwise use a default image
            image: project.ProjectImage && project.ProjectImage.length > 0 
                ? project.ProjectImage[0].image 
                : "/default-project-image.jpg" // Add a default project image
        }));
    };

    // Use the transformed API data
    const projects = useMemo(() => 
        transformApiData(projectsData?.data || []), 
        [projectsData]
    );

    // Get unique categories from projects for filter buttons
    const categories = useMemo(() => {
        const uniqueCategories = new Set(projects.map(project => project.category));
        return ['All Categories', ...Array.from(uniqueCategories)];
    }, [projects]);

    // Filter projects based on selected category
    const filteredProjects = useMemo(() => 
        selectedCategory === 'All Categories'
            ? projects
            : projects.filter(project => project.category === selectedCategory),
        [selectedCategory, projects]
    );

    // Show loading state if no data
    if (!projectsData?.success || projects.length === 0) {
        return (
            <section className="max-w-[1280px] mx-auto px-4 lg:px-0 py-8">
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        {projectsData?.message || "No projects found."}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-[1280px] mx-auto px-4 lg:px-0 py-8">
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

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="hover:cursor-pointer">
                        <ProjectCard
                            title={project.title}
                            id={project.id}
                            subtitle={project.subtitle}
                            description={project.description}
                            image={project.image}
                            liveLink={project.liveLink}
                        />
                    </div>
                ))}
            </div>

            {/* Show message when no projects match the selected category */}
            {filteredProjects.length === 0 && selectedCategory !== 'All Categories' && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        No projects found in the &quot;{selectedCategory}&quot; category.
                    </p>
                </div>
            )}

            {/* Load More Button - You can implement pagination later */}
            {projectsData.meta && projectsData.meta.totalPage > 1 && (
                <div className="flex justify-center">
                    <Button className="flex items-center w-[202px] gap-2 bg-[#0057B8] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#004a9c] transition mt-[80px]">
                        <GoDotFill size={25}></GoDotFill>
                        <span>Load More</span>
                    </Button>
                </div>
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
        </section>
    );
}