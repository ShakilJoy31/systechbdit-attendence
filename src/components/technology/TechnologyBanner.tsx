import Image from "next/image";
import serviceBannerImage from '@/assets/Service/service-flower.png'
import { GoArrowDownRight } from "react-icons/go";
import Heading from "../reusable-components/Heading";
import AnimatedText from "../reusable-components/AnimatedText";

export default function TechnologyBanner() {
    return (
        <section className="bg-gradient-to-b from-[#003D64] to-[#0B0B2D] px-4 py-12 md:py-16 lg:py-24">
            <div className="max-w-[1280px] mx-auto">
                <div className="grid md:grid-cols-3 items-center">
                    <div className="block mx-auto md:col-span-2">
                        <Heading className="flex items-center ">
                            <AnimatedText
                                text="Technology"
                                loop={true}
                                loopDelay={5}
                                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[80px] font-bold flex items-center justify-center md:justify-start gap-2"
                            />
                            <span className="text-2xl md:text-3xl text-white">
                                <GoArrowDownRight className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                            </span>
                        </Heading>
                        <AnimatedText
                            text='Tech Element IT Ltd. is committed to delivering exceptional solutions by utilizing cutting-edge technology stacks.'
                            loop={false}
                            speed={0.005}
                            className="text-[#9F9FAF] mt-[23px] "
                        />
                    </div>

                    <Image
                        src={serviceBannerImage}
                        alt="Service Banner"
                        width={600}
                        height={400}
                        className="w-[250px] sm:w-[320px] md:w-[355px] h-auto block mx-auto md:ml-auto md:col-span-1 "
                        priority
                    />
                </div>
            </div>
        </section>
    );
}