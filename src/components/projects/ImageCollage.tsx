import Image from "next/image";
import { cn } from "@/lib/utils";
import { Project } from "@/types/projectType";
import phoneImage from "@/assets/Projects/double-mobile.png";

interface ImageCollageProps {
  project: Project;
}

export default function ImageCollage({ project }: ImageCollageProps) {
  // Use actual images from ProjectImage array, or default images if not available
  const images = project.ProjectImage && project.ProjectImage.length > 0 
    ? project.ProjectImage.map(img => img.image)
    : [phoneImage.src, phoneImage.src, phoneImage.src, phoneImage.src];

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-0 py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-[15px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg transition-all duration-300 hover:shadow-lg md:hover:shadow-xl",
              "md:col-span-7 h-[250px] sm:h-[350px] md:h-[400px] lg:h-[470px]", // Responsive heights
              index % 4 === 1 && "md:col-span-5",
              index % 4 === 2 && "md:col-span-5",
              index % 4 === 3 && "md:col-span-7"
            )}
          >
            <Image
              src={image}
              alt={`${project.name} - Gallery image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}