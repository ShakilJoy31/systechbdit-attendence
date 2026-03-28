"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import homeLogoDark from '../../../public/The_Logo/linuxeon_logo.png';
import EnterpriseSidebar from "@/components/navigations/EnterpriseSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  return (
    <section className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:relative z-40 transition-all duration-300 ease-in-out ${isMobile
        ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
        : 'translate-x-0'
        }`}>
        <EnterpriseSidebar
          isOpen={sidebarOpen || !isMobile}  // Always open on desktop
          onToggleSidebar={() => setSidebarOpen(false)}  // Only close for mobile
          isMobile={isMobile}
        />
      </div>

      {/* Main Content */}
      <section className={`flex-1 transition-all duration-300 ${isMobile ? 'w-full' : ''
        }`}>
        {/* Mobile header */}
        {isMobile && (
          <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between md:hidden shadow-sm">
            <Image
              src={homeLogoDark}
              alt="Logo"
              width={130}
              height={40}
              className="dark:invert dark:brightness-200"
              priority
            />

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>

          </div>
        )}

        {/* Content */}
        <div className="px-2 md:px-3 lg:px-4">
          {children}
        </div>
      </section>
    </section>
  );
}