"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import navbarLogo from "../../../public/The_Logo/systech-bd-1761568143.png";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { Menu, MessageSquare, Users, X } from "lucide-react";
import LanguageSwitcher from "../reusable-components/LanguageSwitcher";
import { getUserInfo } from "@/utils/helper/userFromToken";
import { useGetClientByIdQuery } from "@/redux/api/authentication/authApi";

const navLinks = [
  {
    name: "Contact Us",
    path: "/contact",
    icon: <Users className="w-4 h-4" />
  },
  { 
    name: "About", 
    path: "/about_us",
    icon: <Users className="w-4 h-4" />
  },
  {
    name: "Services",
    path: "/service",
    icon: <MessageSquare className="w-4 h-4" />
  },
];

export default function PublicNav() {

  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userId, setUserId] = useState(null);

  const { data: userData } = useGetClientByIdQuery(userId ? userId : "", {
    skip: !userId,
  });

  console.log(userData);


  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setUserId(userInfo.id);
      }
    };
    fetchUser();
  }, [router]);

  if (userData) {
    router.push("/redirect?to=/admin/dashboard");
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if current path matches a nav link or is a subpath
  const isActiveLink = (linkPath: string) => {
    if (linkPath === "/") {
      return pathname === "/";
    }

    // For Projects - match /projects and /projects/project-details/*
    if (linkPath === "/projects") {
      return pathname === "/projects" || pathname.startsWith("/projects/project-details/");
    }

    // For Services - match /service and /service/service-details/*
    if (linkPath === "/service") {
      return pathname === "/service" || pathname.startsWith("/service/service-details/");
    }

    // For other links
    return pathname.startsWith(linkPath);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#050117] text-white transition-all duration-300 ${isScrolled
        ? "border-b dark:border-[#262626] bg-[#050117]/90 backdrop-blur-sm"
        : "border-b dark:border-[#262626] bg-[#050117]"
        }`}
    >
      <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between h-16 px-4">
        {/* Logo - Adjusted for tablet */}
        <div
          onClick={() => router.push("/")}
          className="cursor-pointer flex-shrink-0 w-[120px] md:w-[150px] lg:w-[180px]">
          <Image
            src={navbarLogo}
            alt="Logo"
            width={180}
            height={70}
            className="invert brightness-200 dark:invert-0 dark:brightness-100"
          />
        </div>

        {/* Desktop Navigation - Adjusted for tablet */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-3 py-1 xl:px-4 rounded-full text-sm font-medium transition-all ${isActiveLink(link.path)
                ? "bg-[#1D9BF0] text-white"
                : "text-gray-300 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-800 "
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side - Adjusted for tablet */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher></LanguageSwitcher>
          <Button
            onClick={() => router.push("/login")}
            className={`${pathname === '/login' ? 'bg-[#1D9BF0] dark:bg-[#1D9BF0] px-4 py-1 lg:px-6 rounded-full ' : 'bg-transparent'} text-white text-sm font-medium whitespace-nowrap`}>
            Login
          </Button>
        </div>

        {/* Mobile Menu Button - Shows on tablet too */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher></LanguageSwitcher>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 dark:text-gray-300 rounded-md focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Shows on tablet too */}
      {isOpen && (
        <div className="lg:hidden bg-gray-300 dark:bg-[#050117] border-t dark:border-[#262626]">
          <div className="p-2 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-3 rounded-md text-sm font-medium ${isActiveLink(link.path)
                  ? "bg-[#1D9BF0] text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={'/login'}
              className={`px-4 py-3 rounded-md text-sm font-medium ${pathname === '/login'
                ? "bg-[#1D9BF0] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
            >
              Login
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}