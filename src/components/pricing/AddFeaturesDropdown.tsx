"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const featuresList = [
  "Blog",
  "Portfolio",
  "Team Page",
  "Booking page",
  "Contact us page",
];

const AddFeatures = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleFeature = (feature: string) => {
    if (selected.includes(feature)) {
      setSelected(selected.filter((item) => item !== feature));
    } else {
      setSelected([...selected, feature]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-1">
        Add Features <span className="text-red-500">*</span>
      </label>

      {/* Dropdown Button */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 cursor-pointer focus:ring focus:ring-blue-300"
      >
        <span className="text-gray-700 dark:text-gray-300">
          {selected.length > 0 ? selected.join(", ") : "Enter features"}
        </span>
        <FiChevronDown className="text-gray-500" />
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute mt-1 w-full rounded-md bg-white dark:bg-black shadow-lg border border-gray-200 z-10">
          <div className="px-3 py-2 text-gray-500 text-sm border-b">
            Choose Your Features
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {featuresList.map((feature, idx) => (
              <li
                key={idx}
                onClick={() => toggleFeature(feature)}
                className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selected.includes(feature)
                    ? "text-black dark:text-white font-semibold"
                    : "text-gray-700 dark:text-gray-500 "
                }`}
              >
                {/* Circle Checkbox */}
                <span
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    selected.includes(feature)
                      ? "border-green-600 bg-green-600"
                      : "border-gray-400 bg-white"
                  }`}
                >
                  {selected.includes(feature) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddFeatures;