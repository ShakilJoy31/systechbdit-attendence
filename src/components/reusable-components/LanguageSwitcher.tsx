"use client";
import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Button from "./Button";
import { LANGS } from "@/utils/constant/languageConstant";
import { IoLanguage } from "react-icons/io5";
import Image from "next/image";
import resetToEng from "../../../public/Screenshot (1183).png"

// types ...
declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new(options: GoogleTranslateOptions, element: string): unknown; 
          InlineLayout: { SIMPLE: unknown };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

interface GoogleTranslateOptions {
  pageLanguage: string;
  includedLanguages: string;
  autoDisplay: boolean;
  layout: unknown;
}

export default function LanguageSwitcher() {
  const initialized = useRef(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage");
    let langFromCookie: string | null = null;
    const cookieVal = getCookie("googtrans");
    if (cookieVal && cookieVal.startsWith("/")) {
      const parts = cookieVal.split("/");
      if (parts.length === 3) langFromCookie = parts[2];
    }
    const preferredLang = savedLang || langFromCookie || "en";
    setSelectedLang(preferredLang);
    translateTo(preferredLang, true);
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: LANGS.map((l) => l.code).join(","),
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function translateTo(code: string, isInitialLoad = false) {
    const select = document.querySelector<HTMLSelectElement>(
      "#google_translate_element select.goog-te-combo"
    );

    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    } else {
      // fallback with cookie
      const setCookie = (name: string, value: string, domain?: string) => {
        document.cookie =
          name + "=" + value + "; path=/; SameSite=Lax" + (domain ? "; domain=" + domain : "");
      };
      const host = window.location.hostname;
      setCookie("googtrans", `/en/${code}`);
      setCookie("googtrans", `/en/${code}`, "." + host);
      if (!isInitialLoad) window.location.reload();
    }

    if (!isInitialLoad) {
      localStorage.setItem("preferredLanguage", code);
      setSelectedLang(code);
    }
  }

  const filteredLangs = LANGS.filter(
    (lang) =>
      lang.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div id="google_translate_element" className="hidden" />

      <div className="relative">
        <div className="flex items-center gap-1 relative dark:bg-gray-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
          <Button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="text-gray-800 dark:text-gray-100 bg-gray-100 hover:cursor-pointer py-2 pl-3 pr-2 w-12 flex justify-between items-center dark:bg-gray-700 transition-colors duration-150 rounded-lg"
            title="Select Language"
            aria-label="Select language">
            <span className="truncate text-sm font-medium">
              <IoLanguage className="w-5 h-5"></IoLanguage>
            </span>
          </Button>
        </div>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col animate-fadeIn">
            <div className="border-b border-cyan-500 pl-3 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="relative">
                <FiSearch className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search languages..."
                  className="w-full pl-6 py-3 text-sm bg-white dark:bg-gray-800 rounded-md outline-none transition-colors duration-200 text-black dark:text-white "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus={true}
                />
              </div>
            </div>

             <Button title="Reset to English" onClick={() => translateTo("en")}
              type="button"
              className={`w-full text-left hover:cursor-pointer transition-colors duration-150 flex items-center`}>
              <Image
                src={resetToEng}
                alt="Template Logo"
                className="w-full h-auto"
              />
            </Button>

            <div className="overflow-y-auto max-h-64 py-1 scrollbar-hide scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {filteredLangs.length > 0 ? (
                filteredLangs.map((l) => (
                  <Button
                    type="button"
                    key={l.code}
                    onClick={() => {
                      translateTo(l.code);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full text-left hover:cursor-pointer px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center ${
                      selectedLang === l.code 
                        ? "bg-cyan-100 dark:bg-blue-900/30 text-cyan-700 dark:text-blue-300 font-medium" 
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {l.label}
                    {selectedLang === l.code && (
                      <span className="ml-2 text-xs bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-1.5 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </Button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">No languages found</div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: rgba(209, 213, 219, 0.8);
          border-radius: 3px;
        }
        .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.8);
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}