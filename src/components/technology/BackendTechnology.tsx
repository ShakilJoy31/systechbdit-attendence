// components/BackEndDevelopment.tsx
import {
  FaNodeJs,
  FaPython,
  FaPhp,
  FaDocker,
} from "react-icons/fa";
import {
  SiExpress,
  SiNestjs,
  SiDjango,
  SiPrisma,
  SiSequelize,
  SiSocketdotio,
} from "react-icons/si";
import AnimatedText from "../reusable-components/AnimatedText";

export default function BackEndDevelopment() {
  const skills = [
    { icon: <FaNodeJs className="text-green-600 text-5xl" />, label: "Node Js" },
    { icon: <FaPython className="text-blue-500 text-5xl" />, label: "Python" },
    { icon: <FaPhp className="text-indigo-500 text-5xl" />, label: "PHP" },
    { icon: <SiExpress className="text-gray-800 dark:text-white text-5xl" />, label: "Express Js" },
    { icon: <SiNestjs className="text-red-500 text-5xl" />, label: "Nest JS" },
    { icon: <SiDjango className="text-green-800 text-5xl" />, label: "Django" },
    { icon: <SiPrisma className="text-blue-700 text-5xl" />, label: "Prisma" },
    { icon: <SiSequelize className="text-sky-500 text-5xl" />, label: "Sequelize" },
    { icon: <SiSocketdotio className="text-black dark:text-white text-5xl" />, label: "Socket.io" },
    { icon: <FaDocker className="text-sky-500 text-5xl" />, label: "Docker" },
  ];

  return (
    <section className="bg-white dark:bg-black py-4">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-0 text-center">
        {/* Title */}
        <AnimatedText
          text='Back End Development'
          loop={false}
          className="text-2xl font-semibold mb-12"
        />
        {/* <h2 className="text-2xl font-semibold mb-12"></h2> */}

        {/* Icons grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-20 gap-y-10">
          {skills.map((skill, idx) => (
            <div key={idx} className="flex flex-col items-center justify-start gap-2">
              {skill.icon}
              <span className="text-base text-gray-900 dark:text-gray-300 ">{skill.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
