"use client";

import { Bell, MessageSquare, Search, } from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import avatar from "@/assets/About-Us/shakil.png";

const SellerNavber = () => {
  return (
    <header className="w-full bg-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-20">
      {/* Left side: Welcome Text */}
      <h1 className="text-lg md:text-xl font-semibold text-gray-900">
        Welcome To The Dashboard
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search bar - hidden on mobile */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search"
            className="pl-4 pr-10 py-2 rounded-full bg-[#F8F8F8] text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-200"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
        </div>

        {/* Search icon for mobile */}
        <button className="md:hidden p-2 text-gray-700">
          <Search size={20} />
        </button>

        {/* Add Category Button - hidden on mobile */}
        <button className="hidden md:flex bg-[#F4552F] hover:bg-[#e34724] text-white px-4 py-2 text-sm rounded-full font-semibold transition">
          + Add Category
        </button>

        {/* Notification Icon */}
        <div className="relative">
          <Bell className="text-gray-700" size={20} />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
        </div>

        {/* Message Icon - hidden on mobile */}
        <MessageSquare className="text-gray-700 hidden md:block" size={20} />

        {/* Avatar */}
        <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden border">
          <Avatar.Image
            src={avatar.src}
            alt="User"
            className="object-cover w-full h-full"
          />
          <Avatar.Fallback delayMs={600}>AD</Avatar.Fallback>
        </Avatar.Root>
      </div>
    </header>
  );
};

export default SellerNavber;