"use client";

import * as Avatar from "@radix-ui/react-avatar";
import {
  Home,
  Users,
  UserCheck,
  ChevronDown,
  History,
  Lock,
  X,
  BarChart3,
  Settings,
  Building2,
  UserCog,
} from "lucide-react";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import { useEffect, useState } from "react";
import homeLogo from '../../../public/The_Logo/systech-bd-1761568143.png';
import homeLogoDark from '../../../public/The_Logo/systech-bd-1761568143.png';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { shareWithCookies } from "@/utils/helper/shareWithCookies";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import { useTheme } from "next-themes";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { getUserInfo } from "@/utils/helper/userFromToken";
import { useGetEnterpriseByIdQuery } from "@/redux/api/authentication/authApi";
import { useGetEmployeeByIdQuery } from "@/redux/api/employee/employeeApi";

import {
  UserPlus,
  Briefcase,
  Clock,
  CalendarCheck,
  ListChecks,
  Fingerprint,
  FileText,
  RefreshCw,
  CalendarDays,
  AlertCircle,
  Award,
  Clock3,
  Bell,
  Mail,
  Shield,
  Download,
} from 'lucide-react';

interface EnterpriseSidebarProps {
  isOpen?: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  isOpen = true,
  onToggleSidebar,
  isMobile = false,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await getUserInfo();
      if (!userInfo) {
        router.push("/");
      } else {
        setUser(userInfo);
      }
    };
    fetchUser();
  }, [router]);

  // Fetch enterprise data for brother-enterprise role
  const { data: enterpriseData, isLoading: isEnterpriseLoading } = useGetEnterpriseByIdQuery(
    user?.id || "",
    {
      skip: !user?.id || user?.role !== "brother-enterprise",
    }
  );

  // Fetch employee data for employee role
  const { data: employeeData, isLoading: isEmployeeLoading } = useGetEmployeeByIdQuery(
    user?.id || "",
    {
      skip: !user?.id || user?.role !== "employee",
    }
  );

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync internal state with prop
  useEffect(() => {
    setInternalIsOpen(isOpen);
  }, [isOpen]);

  const currentTheme = theme === "system" ? systemTheme : theme;

  // Get menu items based on user role
  const getMenuByRole = () => {
    // Brother Enterprise menu items
    const attendanceMenuItems = [
      {
        key: "dashboard",
        icon: <Home size={20} />,
        label: "Dashboard",
        href: "/admin/dashboard",
      },
      {
        key: "employees",
        icon: <Users size={20} />,
        label: "Employee Management",
        subItems: [
          {
            key: "all-employees",
            icon: <Users size={16} />,
            label: "All Employees",
            href: "/admin/employees",
          },
          {
            key: "departments",
            icon: <Building2 size={16} />,
            label: "Departments",
            href: "/admin/employees/departments",
          },
          {
            key: "designations",
            icon: <Briefcase size={16} />,
            label: "Designations",
            href: "/admin/employees/designations",
          },
          {
            key: "shifts",
            icon: <Clock size={16} />,
            label: "Work Shifts",
            href: "/admin/employees/shifts",
          },
        ],
      },
      {
        key: "attendance",
        icon: <CalendarCheck size={20} />,
        label: "Attendance",
        subItems: [
          {
            key: "mark-attendance",
            icon: <UserCheck size={16} />,
            label: "Mark Attendance",
            href: "/admin/mark-attendance",
          },
          {
            key: "attendance-list",
            icon: <ListChecks size={16} />,
            label: "Attendance List",
            href: "/admin/attendance-list",
          },
        ],
      },
      {
        key: "devices",
        icon: <Fingerprint size={20} />,
        label: "Device Management",
        subItems: [
          {
            key: "all-devices",
            icon: <Fingerprint size={16} />,
            label: "All Devices",
            href: "/admin/devices",
          },
          {
            key: "register-device",
            icon: <UserPlus size={16} />,
            label: "Register Device",
            href: "/admin/devices/register",
          },
          {
            key: "device-logs",
            icon: <FileText size={16} />,
            label: "Device Logs",
            href: "/admin/devices/logs",
          },
          {
            key: "sync-data",
            icon: <RefreshCw size={16} />,
            label: "Sync Data",
            href: "/admin/devices/sync",
          },
        ],
      },
      {
        key: "leave",
        icon: <CalendarDays size={20} />,
        label: "Leave Management",
        subItems: [
          {
            key: "leave-requests",
            icon: <AlertCircle size={16} />,
            label: "Leave Requests",
            href: "/admin/leave/requests",
          },
          {
            key: "leave-balance",
            icon: <Award size={16} />,
            label: "Leave Balance",
            href: "/admin/leave/balance",
          },
          {
            key: "leave-policies",
            icon: <FileText size={16} />,
            label: "Leave Policies",
            href: "/admin/leave/policies",
          },
          {
            key: "leave-history",
            icon: <History size={16} />,
            label: "Leave History",
            href: "/admin/leave/history",
          },
        ],
      },
      {
        key: "reports",
        icon: <BarChart3 size={20} />,
        label: "Reports",
        subItems: [
          {
            key: "daily-report",
            icon: <CalendarCheck size={16} />,
            label: "Daily Report",
            href: "/admin/reports/daily",
          },
          {
            key: "monthly-report",
            icon: <CalendarDays size={16} />,
            label: "Monthly Report",
            href: "/admin/reports/monthly",
          },
          {
            key: "employee-report",
            icon: <Users size={16} />,
            label: "Employee-wise Report",
            href: "/admin/reports/employee",
          },
          {
            key: "department-report",
            icon: <Building2 size={16} />,
            label: "Department-wise Report",
            href: "/admin/reports/department",
          },
          {
            key: "late-report",
            icon: <Clock size={16} />,
            label: "Late Arrival Report",
            href: "/admin/reports/late",
          },
          {
            key: "overtime-report",
            icon: <Clock3 size={16} />,
            label: "Overtime Report",
            href: "/admin/reports/overtime",
          },
          {
            key: "leave-report",
            icon: <CalendarDays size={16} />,
            label: "Leave Report",
            href: "/admin/reports/leave",
          },
        ],
      },
      {
        key: "notifications",
        icon: <Bell size={20} />,
        label: "Notifications",
        subItems: [
          {
            key: "all-notifications",
            icon: <Bell size={16} />,
            label: "All Notifications",
            href: "/admin/notifications",
          },
          {
            key: "send-notification",
            icon: <Mail size={16} />,
            label: "Send Notification",
            href: "/admin/notifications/send",
          },
          {
            key: "alerts",
            icon: <AlertCircle size={16} />,
            label: "Alerts",
            href: "/admin/notifications/alerts",
          },
        ],
      },
      {
        key: "settings",
        icon: <Settings size={20} />,
        label: "Settings",
        subItems: [
          {
            key: "general",
            icon: <Settings size={16} />,
            label: "General Settings",
            href: "/admin/settings/general",
          },
          {
            key: "company",
            icon: <Building2 size={16} />,
            label: "IP Configuration",
            href: "/admin/settings/ip-config",
          },
          {
            key: "holidays",
            icon: <CalendarDays size={16} />,
            label: "Holiday Calendar",
            href: "/admin/settings/holidays",
          },
          {
            key: "work-hours",
            icon: <Clock size={16} />,
            label: "Work Hours",
            href: "/admin/settings/work-hours",
          },
          {
            key: "roles",
            icon: <Shield size={16} />,
            label: "Roles & Permissions",
            href: "/admin/settings/roles",
          },
          {
            key: "users",
            icon: <UserCog size={16} />,
            label: "User Management",
            href: "/admin/settings/users",
          },
          {
            key: "backup",
            icon: <Download size={16} />,
            label: "Backup & Restore",
            href: "/admin/settings/backup",
          },
        ],
      },
    ];

    // Employee menu items (for employee users)
    const employeeMenuItems = [
      {
        key: "dashboard",
        icon: <Home size={20} />,
        label: "Dashboard",
        href: "/employee/dashboard",
      },
      {
        key: "my-attendance",
        icon: <CalendarCheck size={20} />,
        label: "My Attendance",
        subItems: [
          {
            key: "mark-attendance",
            icon: <UserCheck size={16} />,
            label: "Mark Attendance",
            href: "/admin/employee/mark-attendance",
          },
          {
            key: "attendance-history",
            icon: <History size={16} />,
            label: "Attendance History",
            href: "/employee/attendance-history",
          },
        ],
      },
      {
        key: "leave",
        icon: <CalendarDays size={20} />,
        label: "Leave Management",
        subItems: [
          {
            key: "apply-leave",
            icon: <AlertCircle size={16} />,
            label: "Apply Leave",
            href: "/employee/leave/apply",
          },
          {
            key: "leave-history",
            icon: <History size={16} />,
            label: "Leave History",
            href: "/employee/leave/history",
          },
          {
            key: "leave-balance",
            icon: <Award size={16} />,
            label: "Leave Balance",
            href: "/employee/leave/balance",
          },
        ],
      },
      {
        key: "my-profile",
        icon: <UserCog size={20} />,
        label: "My Profile",
        href: "/employee/profile",
      },
    ];

    // Admin menu items (for admin and super_admin users)
    const adminMenuItems = [
      {
        key: "dashboard",
        icon: <Home size={20} />,
        label: "Dashboard",
        href: "/admin/dashboard",
      },
      {
        key: "enterprises",
        icon: <Building2 size={20} />,
        label: "Enterprises",
        subItems: [
          {
            key: "all-enterprises",
            icon: <Building2 size={16} />,
            label: "All Enterprises",
            href: "/admin/enterprises",
          },
          {
            key: "pending-enterprises",
            icon: <UserCog size={16} />,
            label: "Pending Approvals",
            href: "/admin/enterprises/pending",
          },
        ],
      },
      {
        key: "users",
        icon: <Users size={20} />,
        label: "User Management",
        subItems: [
          {
            key: "all-users",
            icon: <Users size={16} />,
            label: "All Users",
            href: "/admin/all-users",
          },
        ],
      },
    ];

    if (user && user?.role === "employee") {
      return employeeMenuItems;
    } else if (user && (user?.role === "admin" || user?.role === "super_admin")) {
      return adminMenuItems;
    } else if (user && user?.role === "brother-enterprise") {
      return attendanceMenuItems;
    } else {
      return [];
    }
  };

  // Get display name based on user role
  const getDisplayName = () => {
    if (user?.role === "brother-enterprise") {
      if (isEnterpriseLoading) return "Loading...";
      return enterpriseData?.data?.companyName || user?.companyName || "Brother Enterprise";
    } else if (user?.role === "employee") {
      if (isEmployeeLoading) return "Loading...";
      return employeeData?.data?.name || user?.name || "Employee";
    } else if (user?.role === "admin" || user?.role === "super_admin") {
      return user?.fullName || "Admin";
    }
    return "User";
  };

  console.log(employeeData)
  console.log(user)
  // Get display email based on user role
  const getDisplayEmail = () => {
    if (user?.role === "brother-enterprise") {
      if (isEnterpriseLoading) return "Loading...";
      return enterpriseData?.data?.email || user?.email || "info@brother-enterprise.com";
    } else if (user?.role === "employee") {
      if (isEmployeeLoading) return "Loading...";
      return employeeData?.data?.email || user?.email || "employee@company.com";
    } else if (user?.role === "admin" || user?.role === "super_admin") {
      return user?.email || "admin@example.com";
    }
    return "user@example.com";
  };

  // Get profile image based on user role
  const getProfileImage = () => {
    if (user?.role === "brother-enterprise") {
      return enterpriseData?.data?.ownerPhoto || "";
    } else if (user?.role === "employee") {
      return employeeData?.data?.profileImage || "";
    }
    return "";
  };

  // Get profile initial based on user role
  const getProfileInitial = () => {
    if (user?.role === "brother-enterprise") {
      const companyName = enterpriseData?.data?.companyName || user?.companyName || "B";
      return companyName.charAt(0).toUpperCase();
    } else if (user?.role === "employee") {
      const employeeName = employeeData?.data?.name || user?.name || "E";
      return employeeName.charAt(0).toUpperCase();
    } else if (user?.role === "admin" || user?.role === "super_admin") {
      return user?.fullName?.charAt(0) || "A";
    }
    return "U";
  };

  // Get department and designation for employee (for tooltip or additional info)
  const getEmployeeDetails = () => {
    if (user?.role === "employee" && employeeData?.data) {
      return {
        department: employeeData.data.department,
        designation: employeeData.data.designation,
        employeeId: employeeData.data.employeeId,
      };
    }
    return null;
  };

  // Improved isActive function
  const isActive = (href: string) => {
    if (!pathname || !href) return false;

    // For dashboard, exact match
    if (href === "/admin/dashboard" || href === "/employee/dashboard") {
      return pathname === href;
    }

    // For other routes, check if current path starts with href
    const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const normalizedHref = href.endsWith('/') ? href.slice(0, -1) : href;

    return normalizedPathname === normalizedHref || normalizedPathname.startsWith(normalizedHref + '/');
  };

  const handleLogout = () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    shareWithCookies("remove", `${appConfiguration.appCode}refreshToken`);
    router.push("/");
    router.refresh();
  };

  // Auto-open submenu based on current route
  useEffect(() => {
    if (!pathname) return;

    // Check each menu item for subitems that match current path
    for (const item of getMenuByRole()) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (isActive(subItem.href)) {
            setActiveSubmenu(item.key);
            return;
          }
        }
      }
    }

    // If no subitem matches, close all submenus
    setActiveSubmenu(null);
  }, [pathname, user]);

  // Helper function to check if any subitem is active
  const isActiveSubmenu = (item: any): boolean => {
    if (!item.subItems) return false;
    return item.subItems.some((subItem: { href: string }) => isActive(subItem.href));
  };

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  // Mobile close handler
  const handleMobileClose = () => {
    if (isMobile && onToggleSidebar) {
      onToggleSidebar();
    }
  };

  const displayIsOpen = isMobile ? isOpen : internalIsOpen;
  const employeeDetails = getEmployeeDetails();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: displayIsOpen ? (isMobile ? "100%" : 260) : 70,
        x: isMobile ? (isOpen ? 0 : -100) : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden shadow-xl ${isMobile ? "max-w-xl" : "sticky top-0"
        }`}
    >
      {/* Logo and Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <Link href={user?.role === "employee" ? "/employee/dashboard" : "/admin/dashboard"} onClick={handleMobileClose}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: displayIsOpen ? 1 : 0, x: displayIsOpen ? 0 : -20 }}
            transition={{ duration: 0.2 }}
            className={`${!displayIsOpen && "hidden"}`}
          >
            {mounted && (
              <Image
                src={currentTheme === "dark" ? homeLogoDark : homeLogo}
                alt="Logo"
                width={500}
                height={50}
                className="h-16 invert brightness-200 dark:invert-0 dark:brightness-100"
                priority
              />
            )}
          </motion.div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => onToggleSidebar && onToggleSidebar()}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
              aria-label="Close menu"
            >
              <X size={22} className="text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {getMenuByRole().map((item) => (
            <li key={item.key} className="px-1">
              {!item.subItems ? (
                <Link
                  href={item.href}
                  onClick={handleMobileClose}
                  className={cn(
                    "flex items-center px-3 py-3 gap-3 rounded-lg transition-all group",
                    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    isActive(item.href) &&
                    "bg-blue-600 text-white dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  )}
                >
                  <span
                    className={cn(
                      "text-[20px] transition-colors flex-shrink-0",
                      isActive(item.href)
                        ? "text-white dark:text-white"
                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
                    )}
                  >
                    {item.icon}
                  </span>
                  {displayIsOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() =>
                      setActiveSubmenu(
                        activeSubmenu === item.key ? null : item.key
                      )
                    }
                    className={cn(
                      "flex items-center px-3 py-3 gap-3 w-full rounded-lg transition-all group",
                      "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                      (activeSubmenu === item.key || isActiveSubmenu(item)) &&
                      "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[20px] transition-colors flex-shrink-0",
                        (activeSubmenu === item.key || isActiveSubmenu(item))
                          ? "text-gray-900 dark:text-gray-200"
                          : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
                      )}
                    >
                      {item.icon}
                    </span>
                    {displayIsOpen && (
                      <>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm font-medium flex-1 text-left truncate"
                        >
                          {item.label}
                        </motion.span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform text-gray-500 dark:text-gray-400 flex-shrink-0",
                            activeSubmenu === item.key ? "rotate-180" : ""
                          )}
                        />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {(activeSubmenu === item.key || isActiveSubmenu(item)) &&
                      item.subItems &&
                      displayIsOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-8 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.subItems.map((subItem) => (
                            <motion.li
                              key={subItem.key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.1 }}
                            >
                              <Link
                                href={subItem.href}
                                onClick={handleMobileClose}
                                className={cn(
                                  "flex items-center px-3 py-2.5 gap-2 text-sm rounded-lg transition-all group",
                                  "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                                  isActive(subItem.href) &&
                                  "bg-blue-600 text-white dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-[16px] transition-colors flex-shrink-0",
                                    isActive(subItem.href)
                                      ? "text-white dark:text-white"
                                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                                  )}
                                >
                                  {subItem.icon}
                                </span>
                                <span className="font-medium truncate">
                                  {subItem.label}
                                </span>
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                  </AnimatePresence>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section and Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 flex-shrink-0">
            <Avatar.Image
              src={getProfileImage()}
              alt={getDisplayName()}
              className="object-cover w-full h-full"
            />
            <Avatar.Fallback
              delayMs={600}
              className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center w-full h-full font-medium"
            >
              {getProfileInitial()}
            </Avatar.Fallback>
          </Avatar.Root>

          {displayIsOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: displayIsOpen ? 1 : 0, x: displayIsOpen ? 0 : -20 }}
              transition={{ duration: 0.2 }}
              className="text-sm flex-1 min-w-0"
            >
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {getDisplayName()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {getDisplayEmail()}
              </p>
              {user?.role === "employee" && employeeDetails && (
                <div className="mt-1 flex flex-col gap-0.5">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                    {employeeDetails.designation} • {employeeDetails.department}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                    ID: {employeeDetails.employeeId}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {displayIsOpen && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="p-1.5 rounded-md hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0">
                  <MdLogout
                    size={18}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 max-w-[95vw] md:max-w-md mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                    Are you sure you want to logout?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                    Logging out will end your current session.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 order-2 sm:order-1">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 order-1 sm:order-2"
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {displayIsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: displayIsOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Theme Toggle */}
            <div
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleTheme();
                  e.preventDefault();
                }
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  Toggle Theme
                </span>
              </div>
              <ThemeSwitcher />
            </div>

            <Link
              href={user?.role === "employee" ? "/employee/change-password" : "/admin/change-password"}
              onClick={handleMobileClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-gray-700 dark:text-gray-300 transition-colors group ${
                pathname === '/admin/change-password' || pathname === '/employee/change-password'
                  ? 'bg-blue-600 text-white dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600'
                  : 'border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors flex-shrink-0">
                  <RiLockPasswordFill size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium truncate">Change Password</span>
              </div>
              <Lock size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 flex-shrink-0" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default EnterpriseSidebar;