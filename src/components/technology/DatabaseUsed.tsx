// components/AppDevelopment.tsx
import AnimatedText from "../reusable-components/AnimatedText";
import { BiLogoMongodb } from "react-icons/bi";
import { GrMysql } from "react-icons/gr";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiSqlite } from "react-icons/si";
import { IoLogoFirebase } from "react-icons/io5";

export default function Database() {
    const skills = [
        { icon: <BiLogoMongodb className="text-green-600 text-5xl" />, label: "MongoDB" },
        { icon: <GrMysql className="text-sky-500 text-5xl" />, label: "MySql" },
        { icon: <BiLogoPostgresql className="text-sky-500 text-5xl" />, label: "PostgreSQL" },
        { icon: <SiSqlite className="text-sky-500 text-5xl" />, label: "Swift" },
        { icon: <IoLogoFirebase className="text-yellow-600 text-5xl" />, label: "Firebase" },
    ];

    return (
        <section className="bg-white dark:bg-black py-8">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-0 text-center">
                {/* Title */}
                <AnimatedText
                    text='Database We Use'
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
