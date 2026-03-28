"use client";


import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import avatar from '@/assets/Home/Square.png';
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import { Button } from "@/components/ui/button";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);


  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else if (systemPrefersDark) {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  // };





  return (
    <header className="w-screen md:w-full bg-white dark:bg-background dark:shadow-2xl overflow-hidden py-1 sticky left-0 top-0 z-50 transition-all duration-500 backdrop-blur-sm border-b">
      <div className="w-full mx-auto">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button */}
            <Button
              className="md:hidden p-2 rounded-md text-white hover:bg-orange-600 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {/* Logo */}
            <div className="text-lg font-semibold md:ml-0 mx-auto md:mx-0">
              <p className="font-bold">Welcome To Proyojon Dashboard</p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
            

              {/* Desktop Icons */}
              <div className="flex items-center gap-4">
                <ThemeSwitcher></ThemeSwitcher>
                <LocaleSwitcher></LocaleSwitcher>

               

                {/* Avatar Dropdown */}
                <div className="relative inline-block mt-1">
                  <button
                    className="rounded-full border-2 border-white cursor-pointer overflow-hidden w-10 h-10 focus:outline-none"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Image
                      width={100}
                      height={100}
                      src={avatar}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white text-black shadow-md p-4 rounded-lg z-50 dark:bg-gray-800 dark:text-white">
                      <div className="absolute -top-2 right-3 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45"></div>
                      <div className="flex items-center gap-3 mb-3">
                        <Image
                          src={avatar}
                          alt="User Avatar"
                          width={40}
                          height={40}
                          className="rounded-full border w-10 h-10 object-cover"
                        />
                        <div>
                          <p className="font-semibold">Niko Flamini</p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            nfilamini@yahoo.com
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between items-center">
                          <Link
                            href="/my-profile"
                            className="flex items-center gap-2 py-1 transition-colors hover:text-orange-500 dark:hover:text-orange-300"
                          >
                            My Account
                          </Link>
                          <div className="border text-xs p-1 rounded-full dark:border-gray-600">
                            <FaUser />
                          </div>
                        </div>
                        <hr className="my-2 border-gray-200 dark:border-gray-600" />
                        <div className="flex justify-between items-center">
                          <Button className="flex items-center gap-2 transition-colors hover:text-orange-500 dark:hover:text-orange-300">
                            Logout
                          </Button>
                          <MdLogout className="text-lg" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </nav>


          </div>

        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;