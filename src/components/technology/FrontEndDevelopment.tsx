// components/FrontEndDevelopment.tsx
import { FaCss3Alt, FaHtml5, FaReact, FaVuejs } from "react-icons/fa";
import { SiJavascript, SiTailwindcss, SiBootstrap, SiTypescript, SiNextdotjs, SiRedux } from "react-icons/si";
import AnimatedText from "../reusable-components/AnimatedText";

export default function FrontEndDevelopment() {
    const skills = [
        { icon: <FaCss3Alt className="text-blue-600 text-5xl" />, label: "CSS" },
        { icon: <FaHtml5 className="text-orange-600 text-5xl" />, label: "HTML" },
        { icon: <SiJavascript className="text-yellow-500 text-5xl" />, label: "JavaScript" },
        { icon: <SiTailwindcss className="text-sky-400 text-5xl" />, label: "tailwindcss" },
        { icon: <SiBootstrap className="text-purple-700 text-5xl" />, label: "Bootstrap" },
        { icon: <SiTypescript className="text-blue-500 text-5xl" />, label: "TypeScript" },
        { icon: <FaReact className="text-sky-500 text-5xl" />, label: "React Js" },
        { icon: <SiNextdotjs className="text-gray-900 dark:text-white text-5xl" />, label: "NEXT.js" },
        { icon: <FaVuejs className="text-green-500 text-5xl" />, label: "Vue.js" },
        { icon: <SiRedux className="text-purple-500 text-5xl" />, label: "Redux" },
    ];

    return (
        <section className="bg-white dark:bg-black py-8">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-0 text-center">
                {/* Title */}
                <AnimatedText
                    text='Front End Development'
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
