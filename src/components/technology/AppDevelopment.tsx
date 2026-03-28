// components/AppDevelopment.tsx
import { SiFlutter, SiReact, SiKotlin, SiSwift } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import AnimatedText from "../reusable-components/AnimatedText";


export default function AppDevelopment() {
    const skills = [
        { icon: <SiFlutter className="text-sky-400 text-5xl" />, label: "Flutter" },
        { icon: <SiReact className="text-sky-500 text-5xl" />, label: "React Native" },
        { icon: <SiKotlin className="text-purple-500 text-5xl" />, label: "Kotlin" },
        { icon: <SiSwift className="text-orange-500 text-5xl" />, label: "Swift" },
        { icon: <FaJava className="text-yellow-600 text-5xl" />, label: "Java" },
    ];

    return (
        <section className="bg-white dark:bg-black py-8">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-0 text-center">
                {/* Title */}
                <AnimatedText
                    text='App Development'
                    loop={false}
                    className="text-2xl font-semibold mb-12"
                />
                

                {/* Icons grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-20 gap-y-10">
                    {skills.map((skill, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            {skill.icon}
                            <span className="text-base text-gray-900 dark:text-gray-300 ">{skill.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
