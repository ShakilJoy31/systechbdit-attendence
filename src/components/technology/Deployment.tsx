// components/AppDevelopment.tsx
import AnimatedText from "../reusable-components/AnimatedText";
import { FaAws } from "react-icons/fa";
import { SiGooglecloud } from "react-icons/si";
import { FaDigitalOcean } from "react-icons/fa";
import { FaCpanel } from "react-icons/fa6";
import { IoLogoVercel } from "react-icons/io5";


export default function Deployment() {
    const skills = [
        { icon: <FaAws className="text-yellow-600 text-5xl" />, label: "AWS" },
        { icon: <SiGooglecloud className="text-sky-700 text-5xl" />, label: "Google Cloud" },
        { icon: <FaDigitalOcean className="text-sky-500 text-5xl" />, label: "Digital Ocean" },
        { icon: <FaCpanel className="text-sky-500 text-5xl" />, label: "Cpanel" },
        { icon: <IoLogoVercel className="text-black dark:text-white text-5xl" />, label: "Vercel" },
    ];

    return (
        <section className="bg-white dark:bg-black py-8">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-0 text-center">
                {/* Title */}
                <AnimatedText
                    text='Place Where We Deploy'
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
