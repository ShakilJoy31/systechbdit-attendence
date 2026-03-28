"use client"

import { ArrowLeft } from "lucide-react";
import Heading from "../reusable-components/Heading";
import AnimatedText from "../reusable-components/AnimatedText";
import Button from "../reusable-components/Button";

interface PlanDetailsProps {
  title: string;
  subtitle?: string;
  features: { text: string; disabled?: boolean }[];
}

export default function PlanDetails({
  title,
  subtitle = "Your Plan",
  features,
}: PlanDetailsProps) {
  return (
    <section className="px-4 lg:px-0 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={()=> window.history.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">{subtitle}</p>
          <Heading>
            <AnimatedText
              text={title}
              loop={false}
              className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white"
            />
          </Heading>
        </div>
        <div className="w-10" />
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-200" />

      {/* What to Expect */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">What to Expect</h2>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 ${feature.disabled ? "text-gray-400 line-through" : "text-gray-800 dark:text-gray-400"
                }`}
            >
              <span className="text-green-600">✓</span>
              {feature.text}

            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
