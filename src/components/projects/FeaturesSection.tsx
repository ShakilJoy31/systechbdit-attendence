import { Project } from "@/types/projectType";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";


interface FeaturesSectionProps {
  project: Project;
}

export default function FeaturesSection({ project }: FeaturesSectionProps) {
  const features = [
    {
      title: "Project Category",
      description: project.category,
      icon: "📁"
    },
    {
      title: "Live Demo",
      description: "Available for viewing",
      icon: "🌐"
    },
    {
      title: "Project Status",
      description: "Completed",
      icon: "✅"
    },
    {
      title: "Technology",
      description: "Modern Web Stack",
      icon: "⚡"
    }
  ];

  return (
    <section className="bg-white dark:bg-black py-16 px-4">
      <div className="max-w-[1280px] mx-auto">
        <Heading className="text-3xl md:text-4xl font-bold text-center mb-12">
          Project Highlights
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                {feature.title}
              </h3>
              <Paragraph className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </Paragraph>
            </div>
          ))}
        </div>

        {/* Additional Project Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4">About This Project</h3>
            <Paragraph className="text-gray-600 dark:text-gray-300">
              {project.description}
            </Paragraph>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Quick Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-300">Project Name:</span>
                <span className="text-black dark:text-white font-medium">{project.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-300">Category:</span>
                <span className="text-black dark:text-white font-medium">{project.category}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-300">Launch Date:</span>
                <span className="text-black dark:text-white font-medium">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                <span className="text-green-500 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}