import Image from "next/image";
import phoneImage from "@/assets/Projects/double-mobile.png"
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import AnimatedText from "../reusable-components/AnimatedText";
import { Project } from "@/types/projectType";

interface ProjectShowcaseProps {
  project: Project;
}

export default function ProjectShowcase({ project }: ProjectShowcaseProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Get the first image from ProjectImage array or use default
  const mainImage = project.ProjectImage && project.ProjectImage.length > 0
    ? project.ProjectImage[0].image
    : phoneImage;

  console.log(project);

  return (
    <section className="bg-white dark:bg-black pt-6 px-4 lg:px-0">
      <div className="max-w-[1280px] mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left - Image */}
          <div className="bg-white dark:bg-gray-600 rounded-[20px] shadow-xl border p-4 flex justify-center">
            <Image
              src={mainImage}
              alt={project.name}
              width={400}
              height={600}
              className="rounded-xl object-contain"
              priority
            />
          </div>

          {/* Right - Title */}
          <div>
            <Heading>
              <AnimatedText
                text={project.name}
                loop={true}
                loopDelay={5}
                speed={0.05}
                className="text-3xl md:text-[60px] font-bold text-black dark:text-white leading-tight text-center"
              />
            </Heading>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Service */}
          <div className="pt-[12px] border-t border-gray-200">
            <Paragraph className="text-black dark:text-gray-300 text-md font-semibold mb-1">Service</Paragraph>
            <Paragraph className="text-gray-500 dark:text-gray-400 font-medium">Web Development</Paragraph>
          </div>

          {/* Client */}
          <div className="pt-[12px] border-t border-gray-200">
            <Paragraph className="text-black dark:text-gray-300 text-md font-semibold mb-1">Category</Paragraph>
            <Paragraph className="text-gray-500 dark:text-gray-400 font-medium">{project.category}</Paragraph>
          </div>

          {/* Date */}
          <div className="pt-[12px] border-t border-gray-200">
            <Paragraph className="text-black dark:text-gray-300 text-md font-semibold mb-1">Date</Paragraph>
            <Paragraph className="text-gray-500 dark:text-gray-400 font-medium">
              {formatDate(project.createdAt)}
            </Paragraph>
          </div>

          {/* Technology */}
          <div className="pt-[12px] border-t border-gray-200">
            <Paragraph className="text-black dark:text-gray-300 text-md font-semibold mb-1">Live Demo</Paragraph>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 font-medium hover:underline"
            >
              Visit Website
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}