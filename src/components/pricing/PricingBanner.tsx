import Image from "next/image";
import serviceBannerImage from '@/assets/Service/service-flower.png'
import { GoArrowDownRight } from "react-icons/go";
import AnimatedText from "../reusable-components/AnimatedText";
import Heading from "../reusable-components/Heading";

export default function  PricingBanner() {
    return (
        <section className="bg-gradient-to-b from-[#003D64] to-[#0B0B2D] px-4 py-12 md:py-16 lg:py-24">
            <div className="max-w-[1280px] mx-auto">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="block mx-auto ">
                        <Heading className="flex items-center ">
                            <AnimatedText
                                text="Pricing"
                                loop={true}
                                loopDelay={5}
                                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[80px] font-bold flex items-center justify-center md:justify-start gap-2"
                            />

                            <span className="text-2xl md:text-3xl text-white">
                                <GoArrowDownRight className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                            </span>
                        </Heading>
                        {/* <p className="text-[#9F9FAF] mt-[23px] ">Tech Element IT Ltd. is committed to delivering exceptional solutions by utilizing cutting-edge technology stacks.</p> */}
                    </div>

                    <Image
                        src={serviceBannerImage}
                        alt="Service Banner"
                        width={600}
                        height={400}
                        className="w-[280px] sm:w-[320px] md:w-[355px] h-auto block mx-auto md:ml-auto"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}