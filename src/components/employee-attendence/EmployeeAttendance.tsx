// components/employee/EmployeeAttendance.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    Clock,
    Calendar,
    User,
    Wifi,
    Smartphone,
    Loader2,
    RefreshCw,
    LogIn,
    LogOut,
    Award,
    TrendingUp,
    Briefcase,
    Shield,
    WifiOff,
    AlertTriangle
} from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import { useGetEmployeeByIdQuery } from "@/redux/api/employee/employeeApi";
import {
    useSelfCheckInMutation,
    useSelfCheckOutMutation,
    useGetMyTodayAttendanceQuery
} from "@/redux/api/attendence/attendanceApi";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

// Office WiFi IP configuration
// IMPORTANT: Update these with your actual office IP addresses
const OFFICE_IPS = [
    "103.253.46.196",
    "103.253.46.39",
    // Add more office IPs as needed
];

// Optional: If you have IP ranges, uncomment and configure
// const OFFICE_IP_RANGES = [
//     { start: "103.253.46.0", end: "103.253.46.255" }, // Office IP range
// ];

const EmployeeAttendance = () => {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
    const [deviceInfo, setDeviceInfo] = useState<string>("");
    const [ipAddress, setIpAddress] = useState<string>("");
    const [isOnOfficeNetwork, setIsOnOfficeNetwork] = useState<boolean | null>(null);
    const [networkCheckLoading, setNetworkCheckLoading] = useState(true);

    // Get employee data from token
    const [employeeId, setEmployeeId] = useState<number | null>(null);

    // Get current local date in Bangladesh timezone (YYYY-MM-DD)
    const getCurrentLocalDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get current local time in Bangladesh timezone (HH:MM:SS)
    const getCurrentLocalTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    // Get detailed device information
    const getDetailedDeviceInfo = () => {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;
        const screenSize = `${window.screen.width}x${window.screen.height}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        return {
            platform,
            userAgent: userAgent.substring(0, 150),
            language,
            screenSize,
            timezone,
            timestamp: getCurrentLocalTime(),
            date: getCurrentLocalDate()
        };
    };

    // Fetch employee data
    const { data: employeeData, isLoading: isLoadingEmployee } = useGetEmployeeByIdQuery(
        employeeId || "",
        {
            skip: !employeeId,
        }
    );

    // Fetch today's attendance
    const {
        data: todayAttendance,
        isLoading: isLoadingAttendance,
        refetch: refetchAttendance
    } = useGetMyTodayAttendanceQuery(undefined, {
        skip: !employeeId,
    });

    // Mutations
    const [selfCheckIn, { isLoading: isCheckingIn }] = useSelfCheckInMutation();
    const [selfCheckOut, { isLoading: isCheckingOut }] = useSelfCheckOutMutation();

    const employee = employeeData?.data;
    const attendance = todayAttendance?.data?.attendance;
    const hasCheckedIn = todayAttendance?.data?.hasCheckedIn || false;
    const hasCheckedOut = todayAttendance?.data?.hasCheckedOut || false;

    // Check if IP is in office network
    const isOfficeNetwork = (ip: string): boolean => {
        if (OFFICE_IPS.includes(ip)) {
            return true;
        }
        
        // If you have IP ranges configured, uncomment this section
        // for (const range of OFFICE_IP_RANGES) {
        //     if (isIpInRange(ip, range.start, range.end)) {
        //         return true;
        //     }
        // }
        
        return false;
    };

    // Helper function to convert IP to number for range comparison (if needed)
    const ipToNumber = (ip: string): number => {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
    };

    // Check if IP is within a range (if needed)
    const isIpInRange = (ip: string, start: string, end: string): boolean => {
        const ipNum = ipToNumber(ip);
        const startNum = ipToNumber(start);
        const endNum = ipToNumber(end);
        return ipNum >= startNum && ipNum <= endNum;
    };

    // Get employee ID from localStorage on mount
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
                if (userInfo?.id) {
                    setEmployeeId(userInfo.id);
                }
            } catch (error) {
                console.error("Error getting user info:", error);
            }
        };
        getUserInfo();
    }, []);

    // Update check-in/out times when attendance data changes
    useEffect(() => {
        if (attendance) {
            if (attendance.checkIn) {
                setCheckInTime(attendance.checkIn);
            }
            if (attendance.checkOut) {
                setCheckOutTime(attendance.checkOut);
            }
        }
    }, [attendance]);

    // Get detailed device info on mount
    useEffect(() => {
        const deviceDetails = getDetailedDeviceInfo();
        setDeviceInfo(
            `Platform: ${deviceDetails.platform} | ` +
            `Language: ${deviceDetails.language} | ` +
            `Screen: ${deviceDetails.screenSize} | ` +
            `Timezone: ${deviceDetails.timezone} | ` +
            `UA: ${deviceDetails.userAgent}`
        );
    }, []);

    // Get IP address and check office network
    useEffect(() => {
        const getIpAddress = async () => {
            setNetworkCheckLoading(true);
            try {
                const ipApis = [
                    'https://api.ipify.org?format=json',
                    'https://api.my-ip.io/ip.json',
                    'https://ipapi.co/json/'
                ];
                
                let ip = '';
                for (const api of ipApis) {
                    try {
                        const response = await fetch(api);
                        const data = await response.json();
                        ip = data.ip || data.ip_address || '';
                        if (ip) break;
                    } catch (e) {
                        continue;
                    }
                }
                
                if (ip) {
                    setIpAddress(ip);
                    const isOffice = isOfficeNetwork(ip);
                    setIsOnOfficeNetwork(isOffice);
                    
                    if (!isOffice) {
                        toast.error("You are not connected to the office network. Please connect to office WiFi to mark attendance.");
                    }
                } else {
                    setIsOnOfficeNetwork(false);
                    toast.error("Unable to detect network. Please ensure you're connected to the office WiFi.");
                }
            } catch (error) {
                console.error("Error getting IP address:", error);
                setIsOnOfficeNetwork(false);
                toast.error("Failed to verify network connection. Please check your internet connection.");
            } finally {
                setNetworkCheckLoading(false);
            }
        };
        
        getIpAddress();
        
        const interval = setInterval(getIpAddress, 300000);
        return () => clearInterval(interval);
    }, []);

    const handleCheckIn = async () => {
        if (!isOnOfficeNetwork) {
            toast.error("You must be connected to the office WiFi network to check in!");
            return;
        }

        if (networkCheckLoading) {
            toast.error("Please wait, verifying network connection...");
            return;
        }

        setIsLoading(true);

        try {
            const deviceDetails = getDetailedDeviceInfo();
            const currentDate = getCurrentLocalDate();
            const currentTime = getCurrentLocalTime();
            
            // Create detailed note with device information and local date/time
            const detailedNote = `✅ Check-in | ${currentDate} | ${currentTime} | IP: ${ipAddress} | Device: ${deviceDetails.platform} | Browser: ${deviceDetails.userAgent.substring(0, 80)} | Location: Office Network`;

            const response = await selfCheckIn({
                note: detailedNote,
                location: null,
                deviceInfo: deviceInfo,
                ipAddress,
            }).unwrap();

            if (response.success) {
                setCheckInTime(currentTime);
                toast.success(`Check-in successful! (${currentDate} ${currentTime})`);
                refetchAttendance();
            } else {
                toast.error(response.message || "Check-in failed");
            }
        } catch (error: any) {
            console.error("Check-in error:", error);
            
            if (error?.data?.message === "You have already checked in today!") {
                toast.error("You have already checked in today!");
                refetchAttendance();
            } else if (error?.data?.message?.includes("network")) {
                toast.error("Network verification failed. Please ensure you're on office WiFi.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckOut = async () => {
        if (!isOnOfficeNetwork) {
            toast.error("You must be connected to the office WiFi network to check out!");
            return;
        }

        if (networkCheckLoading) {
            toast.error("Please wait, verifying network connection...");
            return;
        }

        setIsLoading(true);

        try {
            const deviceDetails = getDetailedDeviceInfo();
            const currentDate = getCurrentLocalDate();
            const currentTime = getCurrentLocalTime();
            
            // Create detailed note with device information and local date/time
            const detailedNote = `✅ Check-out | ${currentDate} | ${currentTime} | IP: ${ipAddress} | Device: ${deviceDetails.platform} | Browser: ${deviceDetails.userAgent.substring(0, 80)} | Location: Office Network`;

            const response = await selfCheckOut({
                note: detailedNote,
                location: null,
                deviceInfo: deviceInfo,
                ipAddress,
            }).unwrap();

            if (response.success) {
                setCheckOutTime(currentTime);
                toast.success(`Check-out successful! (${currentDate} ${currentTime})`);
                refetchAttendance();
            } else {
                toast.error(response.message || "Check-out failed");
            }
        } catch (error: any) {
            console.error("Check-out error:", error);
            
            if (error?.data?.message === "You have already checked out today!") {
                toast.error("You have already checked out today!");
                refetchAttendance();
            } else if (error?.data?.message === "No check-in record found for today. Please check-in first!") {
                toast.error("Please check-in first before checking out!");
            } else if (error?.data?.message?.includes("network")) {
                toast.error("Network verification failed. Please ensure you're on office WiFi.");
            } else {
                toast.error(error?.data?.message || "Failed to check out. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const formatTimeDisplay = (time?: string) => {
        if (!time) return "--:--";
        return time.substring(0, 5);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const getShiftInfo = () => {
        const shift = employee?.shift || "morning";
        switch (shift) {
            case "morning":
                return { start: "09:00", end: "18:00", color: "text-emerald-500" };
            case "evening":
                return { start: "15:00", end: "00:00", color: "text-orange-500" };
            case "night":
                return { start: "22:00", end: "07:00", color: "text-blue-500" };
            default:
                return { start: "09:00", end: "18:00", color: "text-emerald-500" };
        }
    };

    const shiftInfo = getShiftInfo();

    if (isLoadingEmployee || isLoadingAttendance || networkCheckLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-emerald-500 mx-auto mb-4" />
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {networkCheckLoading ? "Verifying network connection..." : "Loading attendance data..."}
                    </p>
                </div>
            </div>
        );
    }

    const today = new Date();
    const formattedDate = format(today, "EEEE, MMMM d, yyyy");
    const currentLocalDate = getCurrentLocalDate();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <div className="p-4 md:p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                My Attendance
                            </h1>
                            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {getGreeting()}, {employee?.name || "Employee"}!
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => refetchAttendance()}
                                className={`px-4 py-2 cursor-pointer rounded-xl flex items-center gap-2 transition-all duration-300 ${
                                    theme === 'dark'
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                <RefreshCw size={18} />
                                Refresh
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Network Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className={`rounded-2xl p-4 mb-6 shadow-lg ${
                        isOnOfficeNetwork
                            ? theme === 'dark'
                                ? 'bg-emerald-900/30 border border-emerald-800'
                                : 'bg-emerald-50 border border-emerald-200'
                            : theme === 'dark'
                                ? 'bg-red-900/30 border border-red-800'
                                : 'bg-red-50 border border-red-200'
                    }`}
                >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            {isOnOfficeNetwork ? (
                                <Wifi className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            ) : (
                                <WifiOff className={`w-5 h-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                            )}
                            <div>
                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {isOnOfficeNetwork ? "✓ Connected to Office Network" : "✗ Not Connected to Office Network"}
                                </p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    IP: {ipAddress || "Detecting..."} | Date: {currentLocalDate}
                                </p>
                            </div>
                        </div>
                        {!isOnOfficeNetwork && (
                            <div className="flex items-center gap-2 text-yellow-500">
                                <AlertTriangle size={16} />
                                <span className="text-xs">Connect to office WiFi to mark attendance</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Employee Info Card */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`rounded-2xl p-6 mb-6 shadow-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className={`p-4 rounded-2xl ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                            <User className={`w-12 h-12 ${
                                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                            }`} />
                        </div>
                        <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Employee ID
                                    </p>
                                    <p className={`text-lg font-semibold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {employee?.employeeId}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Department
                                    </p>
                                    <p className={`text-lg font-semibold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {employee?.department}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Designation
                                    </p>
                                    <p className={`text-lg font-semibold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {employee?.designation}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Shift
                                    </p>
                                    <p className={`text-lg font-semibold mt-1 ${shiftInfo.color}`}>
                                        {employee?.shift?.charAt(0).toUpperCase() + employee?.shift?.slice(1)} Shift
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div> */}

                {/* Date and Shift Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`rounded-2xl p-6 mb-6 shadow-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className={`w-5 h-5 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {formattedDate}
                            </span>
                            <span className={`text-sm px-2 py-1 rounded-lg ${
                                theme === 'dark' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                                {currentLocalDate}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className={`w-5 h-5 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Expected: {shiftInfo.start} - {shiftInfo.end}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Attendance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`rounded-2xl overflow-hidden shadow-xl ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <div className="p-8 text-center border-b border-gray-200 dark:border-gray-700">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-4">
                            {hasCheckedOut ? (
                                <CheckCircle className="w-10 h-10 text-white" />
                            ) : hasCheckedIn ? (
                                <Clock className="w-10 h-10 text-white" />
                            ) : (
                                <LogIn className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {hasCheckedOut
                                ? "Day Completed!"
                                : hasCheckedIn
                                ? "Working Hours"
                                : "Ready to Start?"}
                        </h2>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {hasCheckedOut
                                ? `You have successfully completed your work day on ${currentLocalDate}.`
                                : hasCheckedIn
                                ? `You are currently checked in for ${currentLocalDate}. Don't forget to check out when you leave.`
                                : `Click the button below to mark your attendance for ${currentLocalDate}.`}
                        </p>
                    </div>

                    {/* Time Display */}
                    <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50">
                        <div className="text-center">
                            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Check In Time
                            </p>
                            <div className={`text-3xl font-bold ${
                                checkInTime
                                    ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                                    : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                                {formatTimeDisplay(checkInTime)}
                            </div>
                            {checkInTime && (
                                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {hasCheckedIn ? `Checked in on ${currentLocalDate}` : "Not checked in"}
                                </p>
                            )}
                        </div>
                        <div className="text-center">
                            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Check Out Time
                            </p>
                            <div className={`text-3xl font-bold ${
                                checkOutTime
                                    ? theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                                    : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                                {formatTimeDisplay(checkOutTime)}
                            </div>
                            {checkOutTime && (
                                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {hasCheckedOut ? `Checked out on ${currentLocalDate}` : "Not checked out"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 flex flex-col sm:flex-row justify-center gap-4">
                        {!hasCheckedIn ? (
                            <motion.button
                                whileHover={isOnOfficeNetwork ? { scale: 1.02 } : {}}
                                whileTap={isOnOfficeNetwork ? { scale: 0.98 } : {}}
                                onClick={handleCheckIn}
                                disabled={isLoading || isCheckingIn || !isOnOfficeNetwork}
                                className={`px-8 py-4 cursor-pointer rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                                    !isOnOfficeNetwork
                                        ? 'bg-gray-400 cursor-not-allowed opacity-60'
                                        : theme === 'dark'
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                } text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isLoading || isCheckingIn ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={20} />
                                        Check In for {currentLocalDate}
                                    </>
                                )}
                            </motion.button>
                        ) : !hasCheckedOut ? (
                            <motion.button
                                whileHover={isOnOfficeNetwork ? { scale: 1.02 } : {}}
                                whileTap={isOnOfficeNetwork ? { scale: 0.98 } : {}}
                                onClick={handleCheckOut}
                                disabled={isLoading || isCheckingOut || !isOnOfficeNetwork}
                                className={`px-8 py-4 cursor-pointer rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                                    !isOnOfficeNetwork
                                        ? 'bg-gray-400 cursor-not-allowed opacity-60'
                                        : theme === 'dark'
                                        ? 'bg-orange-600 hover:bg-orange-700'
                                        : 'bg-orange-600 hover:bg-orange-700'
                                } text-white shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isLoading || isCheckingOut ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <LogOut size={20} />
                                        Check Out for {currentLocalDate}
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            <div className={`px-8 py-4 rounded-xl flex items-center justify-center gap-3 ${
                                theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                            }`}>
                                <CheckCircle size={20} />
                                Attendance Completed for {currentLocalDate}
                            </div>
                        )}
                    </div>

                    {/* Device and Network Info */}
                    {(hasCheckedIn || hasCheckedOut) && (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-6 border-t ${
                                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Shield className={`w-4 h-4 mt-0.5 ${
                                            theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'
                                        }`} />
                                        <div className="flex-1">
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                                Verification Method
                                            </p>
                                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Office Network IP: {ipAddress} | Date: {currentLocalDate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Wifi className={`w-4 h-4 mt-0.5 ${
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                        }`} />
                                        <div className="flex-1">
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                                Network Status
                                            </p>
                                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {isOnOfficeNetwork ? "Connected to Office Network ✓" : "Not Connected ✗"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Smartphone className={`w-4 h-4 mt-0.5 ${
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                        }`} />
                                        <div className="flex-1">
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                                Device Info
                                            </p>
                                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {deviceInfo.substring(0, 200)}...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </motion.div>

                {/* Tips Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`mt-6 rounded-2xl p-6 shadow-lg ${
                        theme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                    }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                            theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                        }`}>
                            <Award className={`w-6 h-6 ${
                                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-semibold mb-2 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                                Attendance Guidelines
                            </h3>
                            <ul className={`space-y-2 text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                <li className="flex items-center gap-2">
                                    <Wifi size={14} className="text-emerald-500" />
                                    You must be connected to the office WiFi network to mark attendance
                                </li>
                                <li className="flex items-center gap-2">
                                    <Shield size={14} className="text-emerald-500" />
                                    Your IP address ({ipAddress}) and device info are recorded for verification
                                </li>
                                <li className="flex items-center gap-2">
                                    <Calendar size={14} className="text-emerald-500" />
                                    Attendance is recorded for today: {currentLocalDate}
                                </li>
                                <li className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-emerald-500" />
                                    Check in within 15 minutes of your shift start time
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmployeeAttendance;



//! THe one with location and IP tracking (older version)
// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//     CheckCircle,
//     XCircle,
//     Clock,
//     Calendar,
//     User,
//     MapPin,
//     Wifi,
//     Smartphone,
//     Loader2,
//     AlertCircle,
//     RefreshCw,
//     LogIn,
//     LogOut,
//     Award,
//     TrendingUp,
//     Briefcase
// } from "lucide-react";
// import { useTheme } from "@/hooks/useThemeContext";
// import { useGetEmployeeByIdQuery } from "@/redux/api/employee/employeeApi";
// import {
//     useSelfCheckInMutation,
//     useSelfCheckOutMutation,
//     useGetMyTodayAttendanceQuery
// } from "@/redux/api/attendence/attendanceApi";
// import { toast } from "react-hot-toast";
// import { format } from "date-fns";

// interface LocationData {
//     lat: number;
//     lng: number;
//     address?: string;
// }

// const EmployeeAttendance = () => {
//     const { theme } = useTheme();
//     const [isLoading, setIsLoading] = useState(false);
//     const [checkInTime, setCheckInTime] = useState<string | null>(null);
//     const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
//     const [location, setLocation] = useState<LocationData | null>(null);
//     const [isGettingLocation, setIsGettingLocation] = useState(false);
//     const [deviceInfo, setDeviceInfo] = useState<string>("");
//     const [ipAddress, setIpAddress] = useState<string>("");

//     // Get employee data from token (you'll need to get this from your auth context)
//     // For now, we'll assume we have user info from localStorage/session
//     const [employeeId, setEmployeeId] = useState<number | null>(null);

//     // Fetch employee data
//     const { data: employeeData, isLoading: isLoadingEmployee } = useGetEmployeeByIdQuery(
//         employeeId || "",
//         {
//             skip: !employeeId,
//         }
//     );

//     // Fetch today's attendance
//     const {
//         data: todayAttendance,
//         isLoading: isLoadingAttendance,
//         refetch: refetchAttendance
//     } = useGetMyTodayAttendanceQuery(undefined, {
//         skip: !employeeId,
//     });

//     // Mutations
//     const [selfCheckIn, { isLoading: isCheckingIn }] = useSelfCheckInMutation();
//     const [selfCheckOut, { isLoading: isCheckingOut }] = useSelfCheckOutMutation();

//     const employee = employeeData?.data;
//     const attendance = todayAttendance?.data?.attendance;
//     const hasCheckedIn = todayAttendance?.data?.hasCheckedIn || false;
//     const hasCheckedOut = todayAttendance?.data?.hasCheckedOut || false;

//     // Get employee ID from localStorage on mount
//     useEffect(() => {
//         const getUserInfo = async () => {
//             try {
//                 const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
//                 if (userInfo?.id) {
//                     setEmployeeId(userInfo.id);
//                 }
//             } catch (error) {
//                 console.error("Error getting user info:", error);
//             }
//         };
//         getUserInfo();
//     }, []);

//     // Update check-in/out times when attendance data changes
//     useEffect(() => {
//         if (attendance) {
//             if (attendance.checkIn) {
//                 setCheckInTime(attendance.checkIn);
//             }
//             if (attendance.checkOut) {
//                 setCheckOutTime(attendance.checkOut);
//             }
//         }
//     }, [attendance]);

//     // Get device info on mount
//     useEffect(() => {
//         const getDeviceInfo = () => {
//             const userAgent = navigator.userAgent;
//             const platform = navigator.platform;
//             const language = navigator.language;
//             setDeviceInfo(`${platform} - ${userAgent.substring(0, 100)}...`);
//         };
//         getDeviceInfo();
//     }, []);

//     // Get IP address
//     useEffect(() => {
//         const getIpAddress = async () => {
//             try {
//                 const response = await fetch('https://api.ipify.org?format=json');
//                 const data = await response.json();
//                 setIpAddress(data.ip);
//             } catch (error) {
//                 console.error("Error getting IP address:", error);
//             }
//         };
//         getIpAddress();
//     }, []);

//     // Get current location
//     const getCurrentLocation = (): Promise<LocationData> => {
//         return new Promise((resolve, reject) => {
//             if (!navigator.geolocation) {
//                 reject(new Error("Geolocation is not supported by your browser"));
//                 return;
//             }

//             navigator.geolocation.getCurrentPosition(
//                 async (position) => {
//                     const { latitude, longitude } = position.coords;
                    
//                     // Get address from coordinates using reverse geocoding
//                     let address = "";
//                     try {
//                         const response = await fetch(
//                             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//                         );
//                         const data = await response.json();
//                         address = data.display_name || "";
//                     } catch (error) {
//                         console.error("Error getting address:", error);
//                     }

//                     resolve({
//                         lat: latitude,
//                         lng: longitude,
//                         address: address,
//                     });
//                 },
//                 (error) => {
//                     reject(error);
//                 },
//                 {
//                     enableHighAccuracy: true,
//                     timeout: 10000,
//                     maximumAge: 0,
//                 }
//             );
//         });
//     };

//     const handleCheckIn = async () => {
//         setIsLoading(true);
//         setIsGettingLocation(true);

//         try {
//             // Get current location
//             const currentLocation = await getCurrentLocation();
//             setLocation(currentLocation);

//             // Submit check-in
//             const response = await selfCheckIn({
//                 note: `Checked in from ${currentLocation.address || "mobile device"}`,
//                 location: currentLocation,
//                 deviceInfo,
//                 ipAddress,
//             }).unwrap();

//             if (response.success) {
//                 setCheckInTime(response.data.checkIn);
//                 toast.success("Check-in successful!");
//                 refetchAttendance();
//             } else {
//                 toast.error(response.message || "Check-in failed");
//             }
//         } catch (error: any) {
//             console.error("Check-in error:", error);
            
//             if (error?.data?.message === "You have already checked in today!") {
//                 toast.error("You have already checked in today!");
//                 refetchAttendance();
//             } else if (error.code === 1) {
//                 toast.error("Please enable location services to check in");
//             } else {
//                 toast.error(error?.data?.message || "Failed to check in. Please try again.");
//             }
//         } finally {
//             setIsGettingLocation(false);
//             setIsLoading(false);
//         }
//     };

//     const handleCheckOut = async () => {
//         setIsLoading(true);
//         setIsGettingLocation(true);

//         try {
//             // Get current location for check-out
//             const currentLocation = await getCurrentLocation();
//             setLocation(currentLocation);

//             // Submit check-out
//             const response = await selfCheckOut({
//                 note: `Checked out from ${currentLocation.address || "mobile device"}`,
//                 location: currentLocation,
//                 deviceInfo,
//                 ipAddress,
//             }).unwrap();

//             if (response.success) {
//                 setCheckOutTime(response.data.checkOut);
//                 toast.success("Check-out successful!");
//                 refetchAttendance();
//             } else {
//                 toast.error(response.message || "Check-out failed");
//             }
//         } catch (error: any) {
//             console.error("Check-out error:", error);
            
//             if (error?.data?.message === "You have already checked out today!") {
//                 toast.error("You have already checked out today!");
//                 refetchAttendance();
//             } else if (error?.data?.message === "No check-in record found for today. Please check-in first!") {
//                 toast.error("Please check-in first before checking out!");
//             } else if (error.code === 1) {
//                 toast.error("Please enable location services to check out");
//             } else {
//                 toast.error(error?.data?.message || "Failed to check out. Please try again.");
//             }
//         } finally {
//             setIsGettingLocation(false);
//             setIsLoading(false);
//         }
//     };

//     const formatTimeDisplay = (time?: string) => {
//         if (!time) return "--:--";
//         return time.substring(0, 5);
//     };

//     const getGreeting = () => {
//         const hour = new Date().getHours();
//         if (hour < 12) return "Good Morning";
//         if (hour < 17) return "Good Afternoon";
//         return "Good Evening";
//     };

//     const getShiftInfo = () => {
//         const shift = employee?.shift || "morning";
//         switch (shift) {
//             case "morning":
//                 return { start: "09:00", end: "18:00", color: "text-emerald-500" };
//             case "evening":
//                 return { start: "15:00", end: "00:00", color: "text-orange-500" };
//             case "night":
//                 return { start: "22:00", end: "07:00", color: "text-blue-500" };
//             default:
//                 return { start: "09:00", end: "18:00", color: "text-emerald-500" };
//         }
//     };

//     const shiftInfo = getShiftInfo();

//     if (isLoadingEmployee || isLoadingAttendance) {
//         return (
//             <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
//                 theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
//             }`}>
//                 <div className="text-center">
//                     <Loader2 className="animate-spin h-12 w-12 text-emerald-500 mx-auto mb-4" />
//                     <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                         Loading attendance data...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     const today = new Date();
//     const formattedDate = format(today, "EEEE, MMMM d, yyyy");

//     return (
//         <div className={`min-h-screen transition-colors duration-300 ${
//             theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
//         }`}>
//             <div className="p-4 md:p-6 lg:p-8">
//                 {/* Header */}
//                 <motion.div
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-8"
//                 >
//                     <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//                         <div>
//                             <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                                 My Attendance
//                             </h1>
//                             <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                                 {getGreeting()}, {employee?.name || "Employee"}!
//                             </p>
//                         </div>
//                         <div className="flex gap-3">
//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 onClick={() => refetchAttendance()}
//                                 className={`px-4 py-2 cursor-pointer rounded-xl flex items-center gap-2 transition-all duration-300 ${
//                                     theme === 'dark'
//                                         ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//                                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
//                                 }`}
//                             >
//                                 <RefreshCw size={18} />
//                                 Refresh
//                             </motion.button>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Employee Info Card */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.1 }}
//                     className={`rounded-2xl p-6 mb-6 shadow-lg ${
//                         theme === 'dark' ? 'bg-gray-800' : 'bg-white'
//                     }`}
//                 >
//                     <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//                         <div className={`p-4 rounded-2xl ${
//                             theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
//                         }`}>
//                             <User className={`w-12 h-12 ${
//                                 theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
//                             }`} />
//                         </div>
//                         <div className="flex-1">
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                                 <div>
//                                     <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                         Employee ID
//                                     </p>
//                                     <p className={`text-lg font-semibold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                                         {employee?.employeeId}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                         Department
//                                     </p>
//                                     <p className={`text-lg font-semibold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                                         {employee?.department}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                         Designation
//                                     </p>
//                                     <p className={`text-lg font-semibold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                                         {employee?.designation}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                         Shift
//                                     </p>
//                                     <p className={`text-lg font-semibold mt-1 ${shiftInfo.color}`}>
//                                         {employee?.shift?.charAt(0).toUpperCase() + employee?.shift?.slice(1)} Shift
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Date and Shift Info */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                     className={`rounded-2xl p-6 mb-6 shadow-lg ${
//                         theme === 'dark' ? 'bg-gray-800' : 'bg-white'
//                     }`}
//                 >
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                         <div className="flex items-center gap-3">
//                             <Calendar className={`w-5 h-5 ${
//                                 theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                             }`} />
//                             <span className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                                 {formattedDate}
//                             </span>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <Clock className={`w-5 h-5 ${
//                                 theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                             }`} />
//                             <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                                 Expected: {shiftInfo.start} - {shiftInfo.end}
//                             </span>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Main Attendance Card */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.3 }}
//                     className={`rounded-2xl overflow-hidden shadow-xl ${
//                         theme === 'dark' ? 'bg-gray-800' : 'bg-white'
//                     }`}
//                 >
//                     <div className="p-8 text-center border-b border-gray-200 dark:border-gray-700">
//                         <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-4">
//                             {hasCheckedOut ? (
//                                 <CheckCircle className="w-10 h-10 text-white" />
//                             ) : hasCheckedIn ? (
//                                 <Clock className="w-10 h-10 text-white" />
//                             ) : (
//                                 <LogIn className="w-10 h-10 text-white" />
//                             )}
//                         </div>
//                         <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                             {hasCheckedOut
//                                 ? "Day Completed!"
//                                 : hasCheckedIn
//                                 ? "Working Hours"
//                                 : "Ready to Start?"}
//                         </h2>
//                         <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                             {hasCheckedOut
//                                 ? "You have successfully completed your work day."
//                                 : hasCheckedIn
//                                 ? "You are currently checked in. Don't forget to check out when you leave."
//                                 : "Click the button below to mark your attendance for today."}
//                         </p>
//                     </div>

//                     {/* Time Display */}
//                     <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50">
//                         <div className="text-center">
//                             <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                 Check In Time
//                             </p>
//                             <div className={`text-3xl font-bold ${
//                                 checkInTime
//                                     ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
//                                     : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
//                             }`}>
//                                 {formatTimeDisplay(checkInTime)}
//                             </div>
//                             {checkInTime && (
//                                 <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
//                                     {hasCheckedIn ? "Checked in" : "Not checked in"}
//                                 </p>
//                             )}
//                         </div>
//                         <div className="text-center">
//                             <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                 Check Out Time
//                             </p>
//                             <div className={`text-3xl font-bold ${
//                                 checkOutTime
//                                     ? theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
//                                     : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
//                             }`}>
//                                 {formatTimeDisplay(checkOutTime)}
//                             </div>
//                             {checkOutTime && (
//                                 <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
//                                     {hasCheckedOut ? "Checked out" : "Not checked out"}
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="p-6 flex flex-col sm:flex-row justify-center gap-4">
//                         {!hasCheckedIn ? (
//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 onClick={handleCheckIn}
//                                 disabled={isLoading || isCheckingIn}
//                                 className={`px-8 py-4 cursor-pointer rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
//                                     theme === 'dark'
//                                         ? 'bg-emerald-600 hover:bg-emerald-700'
//                                         : 'bg-emerald-600 hover:bg-emerald-700'
//                                 } text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
//                             >
//                                 {isLoading && isCheckingIn ? (
//                                     <>
//                                         <Loader2 size={20} className="animate-spin" />
//                                         Getting location...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <LogIn size={20} />
//                                         Check In
//                                     </>
//                                 )}
//                             </motion.button>
//                         ) : !hasCheckedOut ? (
//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 onClick={handleCheckOut}
//                                 disabled={isLoading || isCheckingOut}
//                                 className={`px-8 py-4 cursor-pointer rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
//                                     theme === 'dark'
//                                         ? 'bg-orange-600 hover:bg-orange-700'
//                                         : 'bg-orange-600 hover:bg-orange-700'
//                                 } text-white shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
//                             >
//                                 {isLoading && isCheckingOut ? (
//                                     <>
//                                         <Loader2 size={20} className="animate-spin" />
//                                         Getting location...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <LogOut size={20} />
//                                         Check Out
//                                     </>
//                                 )}
//                             </motion.button>
//                         ) : (
//                             <div className={`px-8 py-4 rounded-xl flex items-center justify-center gap-3 ${
//                                 theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
//                             }`}>
//                                 <CheckCircle size={20} />
//                                 Attendance Completed
//                             </div>
//                         )}
//                     </div>

//                     {/* Location and Device Info */}
//                     {location && (hasCheckedIn || hasCheckedOut) && (
//                         <AnimatePresence>
//                             <motion.div
//                                 initial={{ opacity: 0, height: 0 }}
//                                 animate={{ opacity: 1, height: "auto" }}
//                                 exit={{ opacity: 0, height: 0 }}
//                                 className={`p-6 border-t ${
//                                     theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
//                                 }`}
//                             >
//                                 <div className="space-y-3">
//                                     <div className="flex items-start gap-3">
//                                         <MapPin className={`w-4 h-4 mt-0.5 ${
//                                             theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
//                                         }`} />
//                                         <div className="flex-1">
//                                             <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
//                                                 Check {hasCheckedOut ? "Out" : "In"} Location
//                                             </p>
//                                             <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
//                                                 {location.address || `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-start gap-3">
//                                         <Wifi className={`w-4 h-4 mt-0.5 ${
//                                             theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
//                                         }`} />
//                                         <div className="flex-1">
//                                             <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
//                                                 IP Address
//                                             </p>
//                                             <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
//                                                 {ipAddress || "Not available"}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-start gap-3">
//                                         <Smartphone className={`w-4 h-4 mt-0.5 ${
//                                             theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
//                                         }`} />
//                                         <div className="flex-1">
//                                             <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
//                                                 Device Info
//                                             </p>
//                                             <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                                                 {deviceInfo}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         </AnimatePresence>
//                     )}
//                 </motion.div>

//                 {/* Tips Card */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.4 }}
//                     className={`mt-6 rounded-2xl p-6 shadow-lg ${
//                         theme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
//                     }`}
//                 >
//                     <div className="flex items-start gap-4">
//                         <div className={`p-3 rounded-xl ${
//                             theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
//                         }`}>
//                             <Award className={`w-6 h-6 ${
//                                 theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
//                             }`} />
//                         </div>
//                         <div className="flex-1">
//                             <h3 className={`font-semibold mb-2 ${
//                                 theme === 'dark' ? 'text-white' : 'text-gray-900'
//                             }`}>
//                                 Attendance Tips
//                             </h3>
//                             <ul className={`space-y-2 text-sm ${
//                                 theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
//                             }`}>
//                                 <li className="flex items-center gap-2">
//                                     <TrendingUp size={14} className="text-emerald-500" />
//                                     Make sure to check in within 15 minutes of your shift start time
//                                 </li>
//                                 <li className="flex items-center gap-2">
//                                     <MapPin size={14} className="text-emerald-500" />
//                                     Location services must be enabled for accurate attendance marking
//                                 </li>
//                                 <li className="flex items-center gap-2">
//                                     <Briefcase size={14} className="text-emerald-500" />
//                                     Don't forget to check out at the end of your shift
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeAttendance;