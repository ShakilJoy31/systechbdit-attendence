"use client";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaTags,
  FaRobot,
} from "react-icons/fa";
import { MdHelp, MdInfo } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import footerLogo from "../../../public/The_Logo/linuxeon_logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCustomTranslator } from "@/hooks/useCustomTranslator";

const PublicFooter = () => {
  const router = useRouter();
  const { translate } = useCustomTranslator();
  return (
    <footer className="bg-[#FD6801] text-white py-8 px-4 lg:px-10">
      <div className="container mx-auto w-full">
        <div className="flex flex-col lg:flex-row justify-between">
          {/* Newsletter Section */}
          <div className="mb-8 w-full lg:w-auto">
            <div className="flex gap-4 md:mb-10">
              <div className="text-lg font-semibold md:ml-0 mx-auto md:mx-0 mb-3">
                <Image
                  width={100}
                  height={100}
                  src={footerLogo}
                  alt={"footerLogo"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mb-4 sm:text-xs md:text-[14px]">
                <p>
                  {translate(
                    "প্রোইডনের সাথে বাংলাদেশে ব্যক্তিগতকৃত অনলাইন/অফলাইন",
                    "Experience Personalized Online/Offline "
                  )}
                </p>
                <p>
                  {translate(
                    "শপিং এর অভিজ্ঞতা উপভোগ করুন",
                    "Shopping in Bangladesh with Proydon"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center max-w-md mx-auto bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              {/* Input field */}
              <input
                type="email"
                placeholder="Enter your email address..."
                className="px-2 py-2 w-full focus:outline-none text-gray-800"
              />

              {/* Submit Button */}
              <Button
                variant={"outline"}
                className="text-gray-700 -rotate-45 px-4 py-2 "
              >
                <FiArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8 w-full lg:w-auto">
            {/* SUPPORT Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MdHelp className="mr-2" /> {translate("সাপোর্ট", "SUPPORT")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    onClick={() => router.push("/faq")}
                    href="#"
                    className="hover:text-blue-600 transition"
                  >
                    {translate("এফএকিউ", "FAQ")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition">
                    {translate(" ব্যবহারকারী নির্দেশিকা", "USER GUIDE")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition">
                    {translate("সাক্ষ্য-প্রমাণ / গ্রাহক মতামত", "TESTIMONIAL")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition">
                    {translate("গ্রাহক", "CUSTOMER")}
                  </a>
                </li>
              </ul>
            </div>

            {/* LINKS Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MdInfo className="mr-2" /> {translate("লিংকসমূহ", "LINKS")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-600 transition">
                    {translate("আমাদের সম্পর্কে", "ABOUT US")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 transition flex items-center"
                  >
                    {translate("দোকানসমূহ", "Stores")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition">
                    {translate("অ্যাপ", "APP")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition">
                    {translate("আইবিওএস ", "IBOS")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Discover Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2" />{" "}
                {translate("আবিষ্কার করুন", "Discover")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 transition flex items-center"
                  >
                    <FaMapMarkerAlt className="mr-2" />{" "}
                    {translate("কাছাকাছি দোকান খুঁজুন", "Find Nearby Shops")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 transition flex items-center"
                  >
                    <FaTags className="mr-2" />{" "}
                    {translate("সর্বশেষ প্রচার", "Latest Promotions")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 transition flex items-center"
                  >
                    <FaRobot className="mr-2" />{" "}
                    {translate(" শীর্ষ রোবট স্টোর", "Top Robot Stores")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-300 pb-6">
          {/* Social Media and Contact */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a
                href="#"
                className="bg-white text-[#FD6801] p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="bg-white text-[#FD6801] p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="bg-white text-[#FD6801] p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="bg-white text-[#FD6801] p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="mt-6 text-center text-sm text-white flex flex-col md:flex-row justify-between items-center">
          <p className="mb-2 md:mb-0">{translate("স্বত্ব © ২০২২। সর্বস্বত্ব সংরক্ষিত।", "© COURTESY 2022. ALL BIGSTIE RESERVED ")}</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-blue-600 transition">
              {translate("গোপনীয়তা নীতি", "PRIVACY POLICY")}
            </a>
            <span>|</span>
            <a href="#" className="hover:text-blue-600 transition">
              {translate("লিংকসমূহ", "TERMS & CONDITIONS")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
