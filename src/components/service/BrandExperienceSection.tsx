// components/BrandExperienceSection.tsx
import Image from "next/image";
import teamImage from "@/assets/Service/team-working.jpg";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import AnimatedText from "../reusable-components/AnimatedText";

export default function BrandExperienceSection() {
    return (
        <section className="bg-black text-white py-16">
            <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-x-[101px] px-4 lg:px-0">
                {/* Left Image */}
                <div className="relative w-full h-full">
                    <Image
                        src={teamImage}
                        alt="Team working together"
                        className="rounded-md object-cover"
                    />
                </div>

                {/* Right Content */}
                <div className="flex flex-col space-y-10">
                    {/* Heading */}
                    <Heading>
                        <AnimatedText className="text-[40px] lg:text-4xl font-bold leading-snug"
                            text='We sharpen your brands and businesses create exceptional experiences where people live work'
                            loop={false}
                            speed={0.02}
                        />
                    </Heading>

                    {/* Stats Section */}
                    <div className="space-y-8">
                        {/* First stat */}
                        <div className="flex items-start gap-8">
                            <div className="text-[60px] font-bold">2750</div>
                            <Paragraph className="text-gray-300 text-sm leading-relaxed max-w-sm">
                                A website refresh or redesign is a comprehensive overhaul that
                                includes substantial changes to the content, structure, visuals,
                                and code of your current website.
                            </Paragraph>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-600 w-full" />

                        {/* Second stat */}
                        <div className="flex items-start gap-8">
                            <div className="text-[60px] font-bold">92%</div>
                            <Paragraph className="text-gray-300 text-sm leading-relaxed max-w-sm">
                                High-quality custom logo design for Melbourne businesses. We are
                                here to support you. Description - Our logo design package
                                uniquely blends creative skills and strategic thinking. We don’t
                                just create brand identities.
                            </Paragraph>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-600 w-full" />

                        {/* Third stat */}
                        <div className="flex items-start gap-8">
                            <div className="text-[60px] font-bold">75%</div>
                            <Paragraph className="text-gray-300 text-sm leading-relaxed max-w-sm">
                                Every creative design begins with a clear objective. Whether
                                it’s branding, advertising, product design and user experience,
                                the design must align with the intended purpose to effectively
                                communicate its beyond beauty.
                            </Paragraph>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
