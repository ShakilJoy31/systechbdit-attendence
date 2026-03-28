// components/Footer.tsx
import { FaTelegramPlane, FaWhatsapp, FaInstagram, FaFacebookF, FaPhone, FaSms } from "react-icons/fa";
import { MdLocationOn, MdEmail } from "react-icons/md";
import Image from "next/image";
// import siteLogo from "@/assets/Icons/Site-icon.png";
import siteLogo from "../../../public/The_Logo/systech-bd-1761568143.png";
import Paragraph from "../reusable-components/Paragraph";
import Heading from "../reusable-components/Heading";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-gray-700 dark:text-gray-300 border-t border-gray-300 pt-8 md:pt-10">
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
        {/* Logo & Info */}
        <div className="col-span-2">
          <div className="flex gap-x-[29px] mb-3 md:mb-4">
            <Image
              src={siteLogo}
              alt="SMS Platform"
              width={160}
              height={60}
              className=" invert brightness-200 dark:invert-0 dark:brightness-100"
            />
          </div>

          <div className="flex items-start gap-2 mb-2 md:mb-3">
            <MdLocationOn className="text-[#1776BB] text-lg md:text-xl mt-0.5 flex-shrink-0" />
            <Paragraph className="text-xs md:text-sm">
              Global SMS Service Provider - Connecting Businesses Worldwide
            </Paragraph>
          </div>
          
          <div className="flex items-center gap-2 mb-4 md:mb-2">
            <FaPhone className="text-[#1776BB] rotate-90 flex-shrink-0" />
            <Paragraph className="text-xs md:text-sm">+880 1601-590591 (Sales)</Paragraph>
          </div>
          <div className="flex items-center gap-2 mb-4 md:mb-2">
            <FaPhone className="text-[#1776BB] rotate-90 flex-shrink-0" />
            <Paragraph className="text-xs md:text-sm">+880 1601-590592 (Support)</Paragraph>
          </div>
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <MdEmail className="text-[#1776BB] text-lg md:text-xl flex-shrink-0" />
            <Paragraph className="text-xs md:text-sm">support@smsplatform.com</Paragraph>
          </div>

          {/* Social Icons */}
          <div className="flex gap-2 md:gap-3 mt-4 md:mt-6">
            <Link href="#" className="bg-[#1776BB] hover:bg-[#0f5ed1] duration-200 text-white p-2 md:p-3 rounded-full text-sm md:text-base">
              <FaTelegramPlane />
            </Link>
            <Link href="#" className="bg-[#1776BB] hover:bg-[#0f5ed1] duration-200 text-white p-2 md:p-3 rounded-full text-sm md:text-base">
              <FaWhatsapp />
            </Link>
            <Link href="#" className="bg-[#1776BB] hover:bg-[#0f5ed1] duration-200 text-white p-2 md:p-3 rounded-full text-sm md:text-base">
              <FaInstagram />
            </Link>
            <Link href="#" className="bg-[#1776BB] hover:bg-[#0f5ed1] duration-200 text-white p-2 md:p-3 rounded-full text-sm md:text-base">
              <FaFacebookF />
            </Link>
            <Link href="#" className="bg-[#1776BB] hover:bg-[#0f5ed1] duration-200 text-white p-2 md:p-3 rounded-full text-sm md:text-base">
              <FaSms />
            </Link>
          </div>
        </div>

        {/* SMS Solutions */}
        <div>
          <Heading className="font-bold mb-2 md:mb-4 text-sm md:text-base flex items-center gap-2">
            <FaSms className="text-[#1776BB]" /> SMS Solutions
          </Heading>
          <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
            {[
              "Bulk SMS Services",
              "Transactional SMS",
              "SMS API Integration",
              "Two-Way Messaging",
              "SMS Marketing",
              "SMS Gateway",
              "Short Code Services",
              "Voice SMS"
            ].map((item, index) => (
              <li key={index} className="hover:text-blue-500 cursor-pointer transition-colors duration-200">{item}</li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <Heading className="font-bold mb-2 md:mb-4 text-sm md:text-base">Quick Links</Heading>
          <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
            {[
              "Dashboard Login",
              "Pricing & Plans",
              "API Documentation",
              "SMS Features",
              "Coverage Map",
              "Success Stories",
              "SMS Templates",
              "Contact Support"
            ].map((item, index) => (
              <li key={index} className="hover:text-blue-500 cursor-pointer transition-colors duration-200">{item}</li>
            ))}
          </ul>
        </div>

        {/* Industries Served */}
        <div className="col-span-2 sm:col-span-1">
          <Heading className="font-bold mb-2 md:mb-4 text-sm md:text-base">Industries Served</Heading>
          <ul className="space-y-1 md:space-y-2 text-xs md:text-sm grid grid-cols-1">
            {[
              "E-commerce & Retail",
              "Banking & Finance",
              "Healthcare",
              "Education",
              "Logistics",
              "Real Estate",
              "Hospitality",
              "Government"
            ].map((item, index) => (
              <li key={index} className="hover:text-blue-500 cursor-pointer transition-colors duration-200">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="container mx-auto mt-8 md:mt-12 px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <Heading className="text-lg md:text-xl font-bold mb-2">Stay Updated with SMS Trends</Heading>
              <Paragraph className="text-sm md:text-base">
                Subscribe to our newsletter for SMS marketing tips, platform updates, and industry insights.
              </Paragraph>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 flex-grow md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-[#1776BB] hover:bg-[#0f5ed1] text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto mt-8 md:mt-10 border-t border-gray-400 flex flex-col md:flex-row justify-between items-center py-4 px-4 sm:px-6">
        <Paragraph className="flex items-center gap-1 mb-2 md:mb-0 text-[14px] ">
          © {new Date().getFullYear()} SMS Platform. All Rights Reserved.
        </Paragraph>
        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[14px]">
          <span className="text-green-600 flex items-center gap-1">
            <FaSms /> 99.9% Delivery Rate
          </span>
          <span>|</span>
          <Link href="/privacy-policy" className="hover:text-blue-500 cursor-pointer transition-colors duration-200">PRIVACY POLICY</Link>
          <span>|</span>
          <Link href="/terms-of-service" className="hover:text-blue-500 cursor-pointer transition-colors duration-200">TERMS OF SERVICE</Link>
          <span>|</span>
          <Link href="/gdpr-compliance" className="hover:text-blue-500 cursor-pointer transition-colors duration-200">GDPR COMPLIANCE</Link>
        </div>
      </div>
    </footer>
  );
}