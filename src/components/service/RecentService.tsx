import AnimatedText from "../reusable-components/AnimatedText";
import Heading from "../reusable-components/Heading";

export default function RecentService() {
    return (
        <section className="my-12 md:my-16 lg:my-[80px] px-4">
            <div className="max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8">
                    <div className="text-gray-800 dark:text-gray-300 text-base md:text-lg lg:text-base pt-2 md:pt-4 flex justify-center md:justify-start">
                        SMS Solutions
                    </div>

                    <div>
                        <Heading>
                            <AnimatedText
                                text="Powerful SMS services designed for business growth"
                                loop={false}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-[56px] font-bold leading-tight max-w-3xl"
                            />
                        </Heading>
                    </div>
                </div>
            </div>
        </section>
    );
}