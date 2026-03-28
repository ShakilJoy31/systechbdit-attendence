'use client';

import { FaHome, FaSearch, FaBuilding, FaUser } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation"; 

const SmallDevicePublicNav = () => {
  const pathname = usePathname();
  
  // Determine active tab based on current path
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center py-3">
        {/* Home */}
        <Link href="/" className="flex flex-col items-center text-xs">
          <FaHome
            className={`text-lg ${isActive("/") ? "text-[#FD6801]" : "text-gray-600"}`}
          />
          <span className={isActive("/") ? "text-[#FD6801]" : "text-gray-600"}>
            Home
          </span>
        </Link>

        {/* Companies */}
        <Link href="/companies" className="flex flex-col items-center text-xs">
          <FaBuilding
            className={`text-lg ${isActive("/companies") ? "text-[#FD6801]" : "text-gray-600"}`}
          />
          <span className={isActive("/companies") ? "text-[#FD6801]" : "text-gray-600"}>
            Companies
          </span>
        </Link>

        {/* Search */}
        <Link href="/search" className="flex flex-col items-center text-xs">
          <FaSearch
            className={`text-lg ${isActive("/search") ? "text-[#FD6801]" : "text-gray-600"}`}
          />
          <span className={isActive("/search") ? "text-[#FD6801]" : "text-gray-600"}>
            Search
          </span>
        </Link>

        {/* Account */}
        <Link href="/account" className="flex flex-col items-center text-xs">
          <FaUser
            className={`text-lg ${isActive("/account") ? "text-[#FD6801]" : "text-gray-600"}`}
          />
          <span className={isActive("/account") ? "text-[#FD6801]" : "text-gray-600"}>
            Account
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SmallDevicePublicNav;