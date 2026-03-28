import AnimatedText from "../reusable-components/AnimatedText";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";

// components/DesignProcess.tsx
export default function ServiceProcess() {
  const steps = [
    {
      id: "001",
      title: "Discovery & Research",
      desc: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
    },
    {
      id: "002",
      title: "Wireframing & Prototyping",
      desc: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
    },
    {
      id: "003",
      title: "Design System",
      desc: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
    },
    {
      id: "004",
      title: "Final Delivery",
      desc: "Deliver design assets, design systems, and implementation guide",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-black py-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-0 grid md:grid-cols-[400px_1fr] gap-12 items-start">
        {/* Left Side */}
        <div className="text-left">
          <Paragraph className="text-sm font-semibold text-black dark:text-white mb-2">
            Our comprehensive design process
          </Paragraph>
          <Heading className="text-[140px] leading-none font-bold text-black dark:text-white">04</Heading>
        </div>

        {/* Right Side */}
        <div>
          <Heading >
            <AnimatedText
              className="text-[32px] leading-snug font-medium text-black dark:text-white mb-12"
              text='Whether you’re a startup or industry star, we’re here to promote your brand by creative research and real human centred design'
              loop={false}
              speed={0.02}
            />

          </Heading>

          <div className="divide-y divide-dotted divide-gray-300">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col md:flex-row md:items-start py-6 gap-4"
              >
                <span className="text-sky-500 font-medium text-sm min-w-[50px]">
                  ({step.id})
                </span>
                <div className="flex-1">
                  <Heading className="text-lg font-semibold text-black dark:text-white">
                    {step.title}
                  </Heading>
                </div>
                <Paragraph className="text-gray-600 dark:text-gray-300 text-sm md:w-[50%]">{step.desc}</Paragraph>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
