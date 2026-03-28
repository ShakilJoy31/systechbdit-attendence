import { Project } from "@/types/projectType";
import AnimatedText from "../reusable-components/AnimatedText";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";

interface ProjectDescriptionProps {
  project: Project;
}

export default function ProjectDescription({ project }: ProjectDescriptionProps) {
  return (
    <section className="bg-white dark:bg-black py-6 md:py-8 px-4">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left - Title */}
        <div>
          <Heading>
            <AnimatedText
              text='Build streamline and evolve together with solution'
              loop={false}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white leading-snug"
            />
          </Heading>
        </div>

        {/* Right - Description */}
        <div>
          <Paragraph>
            <AnimatedText
              text={project.description}
              loop={false}
              speed={0.01}
              className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6"
            />
          </Paragraph>

          <div className="mt-6">
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Visit Live Website
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}