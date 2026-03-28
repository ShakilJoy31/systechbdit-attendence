import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import { HiSparkles } from "react-icons/hi";
import AnimatedText from "../reusable-components/AnimatedText";

interface BannerComponentProps {
    backgroundImage: string;
    title: string;
    description?: string;
    buttonText?: string;
}

export default function BannerComponent({
    backgroundImage,
    title,
    description,
    buttonText = "Explore SMS Platform"
}: BannerComponentProps) {
    return (
        <section
            className="relative h-[320px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20 bg-gradient-to-r from-black/10 via-black/20 to-black/10" />

            {/* Content Container - Centered both horizontally and vertically */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center text-center space-y-4 lg:space-y-6">

                    {/* Badge/Indicator */}
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <HiSparkles className="text-yellow-400 text-lg" />
                        <span className="text-white text-base font-medium">
                            {buttonText}
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="space-y-2 max-w-4xl">
                        <Heading className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                            {title}
                        </Heading>

                        {description && (
                            <Paragraph className="text-gray-200 text-md sm:text-lg lg:text-xl leading-relaxed font-light">
                                <AnimatedText
                                    text={description}
                                    loop={false}
                                    speed={0.005}
                                    className="text-gray-200"
                                />
                            </Paragraph>
                        )}
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <div className="animate-bounce">
                    <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center">
                        <div className="w-1 h-4 bg-white/80 rounded-full mt-3 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Additional decorative elements */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-white/30 rounded-full animate-pulse" />
            <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse delay-75" />
            <div className="absolute bottom-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-pulse delay-150" />
            <div className="absolute bottom-32 right-32 w-3 h-3 bg-blue-300/30 rounded-full animate-pulse delay-200" />
        </section>
    );
}