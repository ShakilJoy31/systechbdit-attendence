// components/ProjectBanner.tsx
import Image from "next/image";
import projectLeftImage from '@/assets/Projects/Screenshot (936).png'
import projectRightImage from '@/assets/Projects/Screenshot (937).png'
import { GoArrowDownRight } from "react-icons/go";
import Heading from "../reusable-components/Heading";
import AnimatedText from "../reusable-components/AnimatedText";

export default function ProjectBanner() {
    return (
        <section className="bg-gradient-to-b from-[#003D64] to-[#0B0B2D] px-4 py-8 md:py-12">
            <div className="max-w-[1280px] mx-auto text-center">
                {/* Heading */}
                <Heading className="flex items-center justify-center mb-12">
                    <AnimatedText
                        text="Projects"
                        loop={true}
                        loopDelay={5}
                        className="text-white text-5xl mt-4 md:mt-0 md:text-[80px] font-bold flex items-center justify-center gap-2"
                    />
                    <span className="text-2xl md:text-3xl text-white "><GoArrowDownRight size={45}></GoArrowDownRight></span>
                </Heading>


                <div className="grid md:grid-cols-2 gap-6 md:gap-8">

                    <Image style={{ borderRadius: '36px' }}
                        src={projectLeftImage}
                        alt="Collaboration"
                        width={600}
                        height={400}
                        className="w-full lg:h-[450px] md:h-[400px] sm:h-[350px] h-[300px] "
                    />

                    <Image style={{ borderRadius: '36px' }}
                        src={projectRightImage}
                        alt="Figma Plugin"
                        width={600}
                        height={400}
                        className="w-full lg:h-[450px] md:h-[400px] sm:h-[350px] h-[300px] "
                    />

                </div>
            </div>
        </section>
    );
}
