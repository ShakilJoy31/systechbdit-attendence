import { useCustomTranslator } from "@/hooks/useCustomTranslator";
import { useTheme } from "@/hooks/useThemeContext";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const { translate } = useCustomTranslator();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={toggleOpen}
        className="inline-flex items-center justify-center p-2 cursor-pointer rounded-md text-gray-300 hover:text-gray-400 hover:bg-gray-100/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
      >
        <Sun className="rotate-0 size-[21px] scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-[21px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer ${
                theme === "light" ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white" : "text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => {
                setTheme("light");
                setIsOpen(false);
              }}
            >
              {translate("লাইট", "Light")}
            </button>

            <button
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer ${
                theme === "dark" ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white" : "text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => {
                setTheme("dark");
                setIsOpen(false);
              }}
            >
              {translate("ডার্ক", "Dark")}
            </button>

            <button
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer ${
                theme === "system" ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white" : "text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => {
                setTheme("system");
                setIsOpen(false);
              }}
            >
              {translate("সিস্টেম", "System")}
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

export default ThemeSwitcher;