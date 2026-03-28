// import { useFontShifter } from "@/hooks/useFontShifter";
import { useLocaleContext } from "@/hooks/useLocaleContext";
import i18n from "@/i18n";
import { CiGlobe } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { useState } from "react";

const LocaleSwitcher = () => {
  const { locale } = useLocaleContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={toggleOpen}
        className="inline-flex items-center cursor-pointer uppercase text-gray-300 hover:text-gray-400 hover:bg-gray-100/10 px-3 py-1.5 rounded-md text-sm focus:outline-none"
      >
        <CiGlobe size={20} />
        <span className="px-1">{locale === "bn" ? "বাংলা" : "Eng"}</span>
        <span className="ml-1"><FaAngleDown /></span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${locale === "bn"
                  ? "bg-gray-100 dark:bg-gray-900 text-black dark:text-white font-lato"
                  : "text-gray-700 dark:text-gray-300 font-anek"
                }`}
              onClick={() => {
                i18n.changeLanguage("bn");
                setIsOpen(false);
              }}
            >
              বাংলা
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${locale === "en"
                  ? "bg-gray-100 dark:bg-gray-900 text-black dark:text-white font-lato"
                  : "text-gray-700 dark:text-gray-300"
                }`}
              onClick={() => {
                i18n.changeLanguage("en");
                setIsOpen(false);
              }}
            >
              English
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LocaleSwitcher;