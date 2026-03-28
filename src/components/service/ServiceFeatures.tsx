// components/FeatureGrid.tsx
import Image from "next/image";
import icon1 from "@/assets/Logo/service-logo.svg";
import icon2 from "@/assets/Logo/service-logo.svg";
import icon3 from "@/assets/Logo/service-logo.svg";
import icon4 from "@/assets/Logo/service-logo.svg";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";

export default function ServiceFeature() {
  const features = [
    {
      icon: icon1,
      title: "Skilled design team",
      desc: "We work closely with your team to understand your mission, values, and goals, forming the foundation of your brand identity.",
    },
    {
      icon: icon2,
      title: "Skilled design team",
      desc: "Scale your traffic, content, and site performance to match your business –without worrying about reliability.",
    },
    {
      icon: icon3,
      title: "Dedicated support",
      desc: "From implementation support to in-the-moment troubleshooting, we’re here to offer personalized help.",
    },
    {
      icon: icon4,
      title: "Security and compliance",
      desc: "We work closely with you throughout the design journey, security  and compliance features and reliable hosting infrastructure.",
    },
  ];

  return (
    <section className="w-full bg-[#0D0D0D] py-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-0 grid grid-cols-1 md:grid-cols-4">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-start gap-4 px-6 ${idx !== features.length - 1
              ? "md:border-r md:border-b-0 border-b mb-4 pb-4 md:mb-0 md:pb-0 border-gray-700"
              : ""
              }`}
          >
            <Image className="bg-[#1776BA] p-2 rounded-full " src={feature.icon} alt={feature.title} width={50} height={50} />
            <Heading className="text-white font-semibold text-lg">
              {feature.title}
            </Heading>
            <Paragraph className="text-gray-400 text-sm leading-relaxed">
              {feature.desc}
            </Paragraph>
          </div>
        ))}
      </div>
    </section>
  );
}
