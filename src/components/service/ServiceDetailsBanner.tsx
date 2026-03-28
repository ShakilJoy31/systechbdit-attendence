// components/UiUxService.tsx
import Image from "next/image";
import uiuxImage from "@/assets/Service/service-details-banner.jpg";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import AnimatedText from "../reusable-components/AnimatedText";

export default function ServiceDetails() {
    return (
        <section className="max-w-[1280px] mx-auto w-full bg-white dark:bg-black ">
            <Heading>
                <AnimatedText
                    className="text-[35px] md:text-[50px] font-semibold text-black dark:text-white mb-6 text-center ml-4 md:ml-0 "
                    text="UI/UX Design Service"
                    loop={true}
                    loopDelay={5}
                />
            </Heading>
            <div className="px-4 grid md:grid-cols-2 items-center gap-12 lg:px-0">
                {/* Left Content */}
                <div>
                    <Paragraph className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6 font-semibold ">
                        We design user-centric interfaces that are not only visually appealing but
                        also functionally powerful. From idea to execution, we ensure your users
                        have a smooth and meaningful journey.
                    </Paragraph>
                    <ul className="text-gray-700 dark:text-gray-400 space-y-2 font-semibold">
                        <li>+ UI/UX Consulting</li>
                        <li>+ UX Research</li>
                        <li>+ Usability Testing</li>
                        <li>+ Wireframing</li>
                        <li>+ Prototyping</li>
                        <li>+ UX Audit</li>
                    </ul>
                </div>

                {/* Right Content */}
                <div>
                    <div className="relative ">
                        <Image
                            src={uiuxImage}
                            alt="UI/UX Design"
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
