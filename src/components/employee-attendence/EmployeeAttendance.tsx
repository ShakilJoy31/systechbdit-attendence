// components/employee/EmployeeAttendance.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
    AlertTriangle,
    Timer,
    Play,
    Pause,
    Zap,
    Hourglass,
    ChevronLeft,
    ChevronRight,
    X,
    Filter,
    History
} from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import { useGetEmployeeByIdQuery } from "@/redux/api/employee/employeeApi";
import {
    useSelfCheckInMutation,
    useSelfCheckOutMutation,
    useGetMyTodayAttendanceQuery,
    useGetAttendanceByDateRangeQuery
} from "@/redux/api/attendence/attendanceApi";
import { toast } from "react-hot-toast";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from "date-fns";
import { useGetActiveIpConfigsQuery } from "@/redux/api/employee/wifiIpConfigApi";
import { getUserInfo } from "@/utils/helper/userFromToken";

interface TimeRemaining {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
}

interface WorkDuration {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
}

interface AttendanceRecord {
    id: number;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    status: string;
    checkInNote: string | null;
    checkOutNote: string | null;
    overtime: number;
    employee?: {
        id: number;
        name: string;
        employeeId: string;
        designation: string;
        department: string;
        shift: string;
    };
}

const EmployeeAttendance = () => {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
    const [deviceInfo, setDeviceInfo] = useState<string>("");
    const [ipAddress, setIpAddress] = useState<string>("");
    const [isOnOfficeNetwork, setIsOnOfficeNetwork] = useState<boolean | null>(null);
    const [networkCheckLoading, setNetworkCheckLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Timer states
    const [workDuration, setWorkDuration] = useState<WorkDuration>({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
    const [remainingTime, setRemainingTime] = useState<TimeRemaining>({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Get employee data from token
    const [employeeId, setEmployeeId] = useState<number | null>(null);

    // Fetch active IP configurations from database
    const { data: activeIpConfigsData, isLoading: isLoadingIpConfigs } = useGetActiveIpConfigsQuery(undefined, {
        skip: !employeeId,
    });

    // Extract IP addresses from the response
    const officeIps = useMemo(() => {
        if (activeIpConfigsData?.data) {
            return activeIpConfigsData.data.map(config => config.ipAddress);
        }
        return [];
    }, [activeIpConfigsData]);

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

    // Format time to 12-hour format with AM/PM
    const formatTo12Hour = (time24: string) => {
        if (!time24) return "--:--";

        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
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

    // Calculate work duration and remaining time
    const calculateTimes = (checkInTimeStr: string) => {
        if (!checkInTimeStr) return;

        const now = new Date();
        const checkInDate = new Date();
        const [checkInHours, checkInMinutes, checkInSeconds = '00'] = checkInTimeStr.split(':');
        checkInDate.setHours(parseInt(checkInHours), parseInt(checkInMinutes), parseInt(checkInSeconds));

        // Office end time is 7:00 PM (19:00)
        const endTime = new Date();
        endTime.setHours(19, 0, 0, 0);

        // Calculate work duration
        const workMs = now.getTime() - checkInDate.getTime();
        const workTotalSeconds = Math.max(0, Math.floor(workMs / 1000));
        const workHours = Math.floor(workTotalSeconds / 3600);
        const workMinutes = Math.floor((workTotalSeconds % 3600) / 60);
        const workSeconds = workTotalSeconds % 60;

        setWorkDuration({
            hours: workHours,
            minutes: workMinutes,
            seconds: workSeconds,
            totalSeconds: workTotalSeconds
        });

        // Calculate remaining time until 7:00 PM
        if (now < endTime) {
            const remainingMs = endTime.getTime() - now.getTime();
            const remainingTotalSeconds = Math.floor(remainingMs / 1000);
            const remainingHours = Math.floor(remainingTotalSeconds / 3600);
            const remainingMinutes = Math.floor((remainingTotalSeconds % 3600) / 60);
            const remainingSeconds = remainingTotalSeconds % 60;

            setRemainingTime({
                hours: remainingHours,
                minutes: remainingMinutes,
                seconds: remainingSeconds,
                totalSeconds: remainingTotalSeconds
            });
            setIsCountdownActive(true);
        } else {
            setRemainingTime({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
            setIsCountdownActive(false);
        }
    };

    // Start timer for countdown and work duration
    const startTimer = (checkInTimeStr: string) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        calculateTimes(checkInTimeStr);

        timerRef.current = setInterval(() => {
            calculateTimes(checkInTimeStr);
        }, 1000);
    };

    // Stop timer
    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // Update current time display
    const updateCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        setCurrentTime(`${hour12}:${minutes} ${ampm}`);
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

    // Fetch attendance history by date range
    const { data: attendanceHistoryData, refetch: refetchHistory } = useGetAttendanceByDateRangeQuery(
        {
            startDate: format(startOfMonth(selectedDate), 'yyyy-MM-dd'),
            endDate: format(endOfMonth(selectedDate), 'yyyy-MM-dd'),
            employeeId: employeeId || undefined,
            page: 1,
            limit: 100
        },
        {
            skip: !employeeId,
        }
    );

    // Mutations
    const [selfCheckIn, { isLoading: isCheckingIn }] = useSelfCheckInMutation();
    const [selfCheckOut, { isLoading: isCheckingOut }] = useSelfCheckOutMutation();

    const employee = employeeData?.data;
    const attendance = todayAttendance?.data?.attendance;
    const hasCheckedIn = todayAttendance?.data?.hasCheckedIn || false;
    const hasCheckedOut = todayAttendance?.data?.hasCheckedOut || false;

    // Check if IP is in office network
    const isOfficeNetwork = (ip: string): boolean => {
        return officeIps.includes(ip);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getUserInfo();
            setEmployeeId(Number(userInfo.id));
        };
        fetchUser();
    }, []);

    // Update check-in/out times when attendance data changes
    useEffect(() => {
        if (attendance) {
            if (attendance.checkIn) {
                let checkInValue = attendance.checkIn;
                if (checkInValue.includes('T') || checkInValue.includes(':')) {
                    const timeMatch = checkInValue.match(/(\d{2}:\d{2}:\d{2})/);
                    if (timeMatch) {
                        checkInValue = timeMatch[1];
                    }
                }
                setCheckInTime(checkInValue);

                if (!hasCheckedOut) {
                    startTimer(checkInValue);
                }
            } else {
                setCheckInTime(null);
                stopTimer();
            }

            if (attendance.checkOut) {
                let checkOutValue = attendance.checkOut;
                if (checkOutValue.includes('T') || checkOutValue.includes(':')) {
                    const timeMatch = checkOutValue.match(/(\d{2}:\d{2}:\d{2})/);
                    if (timeMatch) {
                        checkOutValue = timeMatch[1];
                    }
                }
                setCheckOutTime(checkOutValue);
                stopTimer();
            } else {
                setCheckOutTime(null);
            }
        } else {
            setCheckInTime(null);
            setCheckOutTime(null);
            stopTimer();
        }
    }, [attendance, hasCheckedOut]);

    // Fetch attendance history when selected date changes
    useEffect(() => {
        if (employeeId && selectedDate) {
            setHistoryLoading(true);
            refetchHistory().then((result) => {
                if (result.data?.data) {
                    const mappedData: AttendanceRecord[] = result.data.data.map((item: any) => ({
                        id: item.id || 0,
                        date: item.date,
                        checkIn: item.checkIn,
                        checkOut: item.checkOut,
                        status: item.status,
                        checkInNote: item.checkInNote,
                        checkOutNote: item.checkOutNote,
                        overtime: item.overtime,
                        employee: item.employee
                    }));
                    setAttendanceHistory(mappedData);
                }
                setHistoryLoading(false);
            });
        }
    }, [selectedDate, employeeId, refetchHistory]);

    // Update current time every second
    useEffect(() => {
        updateCurrentTime();
        const interval = setInterval(updateCurrentTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

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

                    if (!isOffice && officeIps.length > 0) {
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

        if (officeIps.length > 0 || !isLoadingIpConfigs) {
            getIpAddress();
        }

        const interval = setInterval(getIpAddress, 300000);
        return () => clearInterval(interval);
    }, [officeIps, isLoadingIpConfigs]);

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
            const currentTime24 = getCurrentLocalTime();

            const detailedNote = `✅ Check-in | ${currentDate} | ${currentTime24} | IP: ${ipAddress} | Device: ${deviceDetails.platform} | Browser: ${deviceDetails.userAgent.substring(0, 80)} | Location: Office Network`;

            const response = await selfCheckIn({
                note: detailedNote,
                location: null,
                deviceInfo: deviceInfo,
                ipAddress,
            }).unwrap();

            if (response.success) {
                if (response.data?.checkIn) {
                    let checkInValue = response.data.checkIn;
                    if (checkInValue.includes('T') || checkInValue.includes(':')) {
                        const timeMatch = checkInValue.match(/(\d{2}:\d{2}:\d{2})/);
                        if (timeMatch) {
                            checkInValue = timeMatch[1];
                        }
                    }
                    setCheckInTime(checkInValue);
                    startTimer(checkInValue);
                } else {
                    setCheckInTime(currentTime24);
                    startTimer(currentTime24);
                }
                toast.success(`Check-in successful! (${currentDate} ${formatTo12Hour(currentTime24)})`);
                await refetchAttendance();
            } else {
                toast.error(response.message || "Check-in failed");
            }
        } catch (error: any) {
            console.error("Check-in error:", error);

            if (error?.data?.message === "You have already checked in today!") {
                toast.error("You have already checked in today!");
                await refetchAttendance();
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
            const currentTime24 = getCurrentLocalTime();

            const detailedNote = `✅ Check-out | ${currentDate} | ${currentTime24} | IP: ${ipAddress} | Device: ${deviceDetails.platform} | Browser: ${deviceDetails.userAgent.substring(0, 80)} | Location: Office Network`;

            const response = await selfCheckOut({
                note: detailedNote,
                location: null,
                deviceInfo: deviceInfo,
                ipAddress,
            }).unwrap();

            if (response.success) {
                if (response.data?.checkOut) {
                    let checkOutValue = response.data.checkOut;
                    if (checkOutValue.includes('T') || checkOutValue.includes(':')) {
                        const timeMatch = checkOutValue.match(/(\d{2}:\d{2}:\d{2})/);
                        if (timeMatch) {
                            checkOutValue = timeMatch[1];
                        }
                    }
                    setCheckOutTime(checkOutValue);
                } else {
                    setCheckOutTime(currentTime24);
                }
                stopTimer();
                toast.success(`Check-out successful! (${currentDate} ${formatTo12Hour(currentTime24)})`);
                await refetchAttendance();
            } else {
                toast.error(response.message || "Check-out failed");
            }
        } catch (error: any) {
            console.error("Check-out error:", error);

            if (error?.data?.message === "You have already checked out today!") {
                toast.error("You have already checked out today!");
                await refetchAttendance();
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
        return formatTo12Hour(time);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const formatDuration = (hours: number, minutes: number, seconds: number) => {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Calendar functions
    const getCalendarDays = () => {
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);
        return eachDayOfInterval({ start, end });
    };

    const handlePrevMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setShowCalendar(false);
    };

    const getAttendanceForDate = (date: Date): AttendanceRecord | undefined => {
        return attendanceHistory.find(record => record.date === format(date, 'yyyy-MM-dd'));
    };

    const getAttendanceStatusColor = (status: string) => {
        switch (status) {
            case 'present':
                return 'bg-emerald-500';
            case 'absent':
                return 'bg-red-500';
            case 'late':
                return 'bg-yellow-500';
            case 'half-day':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Show loading states
    if (isLoadingEmployee || isLoadingAttendance || isLoadingIpConfigs || networkCheckLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-emerald-500 mx-auto mb-4" />
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isLoadingIpConfigs ? "Loading office network configuration..." :
                            networkCheckLoading ? "Verifying network connection..." :
                                "Loading attendance data..."}
                    </p>
                </div>
            </div>
        );
    }

    const today = new Date();
    const formattedDate = format(today, "EEEE, MMMM d, yyyy");
    const currentLocalDate = getCurrentLocalDate();
    const selectedAttendance = getAttendanceForDate(selectedDate);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
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
                                className={`px-4 py-2 cursor-pointer rounded-xl flex items-center gap-2 transition-all duration-300 ${theme === 'dark'
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

                {/* Current Time Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.02 }}
                    className={`rounded-2xl p-4 mb-6 shadow-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}
                >
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Current Time
                    </p>
                    <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {currentTime}
                    </p>
                </motion.div>

                {/* Network Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className={`rounded-2xl p-4 mb-6 shadow-lg ${isOnOfficeNetwork
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

                {/* Date and Shift Info with Calendar Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`rounded-2xl p-6 mb-6 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                            <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {formattedDate}
                            </span>
                            <span className={`text-sm px-2 py-1 rounded-lg ${theme === 'dark' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                {currentLocalDate}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${theme === 'dark'
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <History size={18} />
                                View History
                                <ChevronRight size={16} className={showCalendar ? 'rotate-90' : ''} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Calendar View for Attendance History */}
                <AnimatePresence>
                    {showCalendar && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`rounded-2xl overflow-hidden mb-6 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                }`}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Attendance History
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handlePrevMonth}
                                            className={`p-2 rounded-lg transition-all ${theme === 'dark'
                                                ? 'hover:bg-gray-700 text-gray-400'
                                                : 'hover:bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <span className={`text-lg font-medium px-4 py-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {format(selectedDate, 'MMMM yyyy')}
                                        </span>
                                        <button
                                            onClick={handleNextMonth}
                                            className={`p-2 rounded-lg transition-all ${theme === 'dark'
                                                ? 'hover:bg-gray-700 text-gray-400'
                                                : 'hover:bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>

                                {historyLoading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
                                    </div>
                                ) : (
                                    <>
                                        {/* Calendar Grid */}
                                        <div className="grid grid-cols-7 gap-2 mb-4">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                <div key={day} className={`text-center text-sm font-medium py-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-2">
                                            {getCalendarDays().map((date, idx) => {
                                                const attendance = getAttendanceForDate(date);
                                                const isCurrentMonth = isSameMonth(date, selectedDate);
                                                const isTodayDate = isToday(date);

                                                return (
                                                    <motion.button
                                                        key={idx}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDateSelect(date)}
                                                        className={`
                                                            relative p-3 rounded-xl text-center transition-all duration-200
                                                            ${!isCurrentMonth ? 'opacity-40' : ''}
                                                            ${isTodayDate ? 'ring-2 ring-emerald-500' : ''}
                                                            ${attendance ? getAttendanceStatusColor(attendance.status) + ' text-white' :
                                                                theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }
                                                        `}
                                                    >
                                                        <span className="text-sm font-medium">
                                                            {format(date, 'd')}
                                                        </span>
                                                        {attendance && (
                                                            <div className="absolute -top-1 -right-1">
                                                                <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>
                                                            </div>
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>

                                        {/* Selected Date Details */}
                                        {selectedAttendance && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`mt-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Calendar size={20} className="text-emerald-500" />
                                                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                                                    </h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            Check In
                                                        </p>
                                                        <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                            {selectedAttendance.checkIn ? formatTo12Hour(selectedAttendance.checkIn) : '--:--'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            Check Out
                                                        </p>
                                                        <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                                                            {selectedAttendance.checkOut ? formatTo12Hour(selectedAttendance.checkOut) : '--:--'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getAttendanceStatusColor(selectedAttendance.status)} text-white`}>
                                                        {selectedAttendance.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Legend */}
                                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex flex-wrap gap-4 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Present</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Late</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Half Day</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Absent</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No Record</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Attendance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`rounded-2xl overflow-hidden shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
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

                    {/* Time Display with Countdowns */}
                    {hasCheckedIn && !hasCheckedOut && (
                        <div className="grid grid-cols-1 p-6 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                            <div className={`rounded-2xl p-6 text-center ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300 hover:scale-105`}>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Zap className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Work Duration
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-4xl md:text-5xl font-bold font-mono tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                        {formatDuration(workDuration.hours, workDuration.minutes, workDuration.seconds)}
                                    </div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Total time worked today
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Time Display for Checked In/Out */}
                    <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50">
                        <div className="text-center">
                            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Check In Time
                            </p>
                            <div className={`text-3xl font-bold ${checkInTime
                                ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                                : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                {formatTimeDisplay(checkInTime)}
                            </div>
                            {checkInTime && (
                                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Checked in on {currentLocalDate}
                                </p>
                            )}
                        </div>
                        <div className="text-center">
                            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Check Out Time
                            </p>
                            <div className={`text-3xl font-bold ${checkOutTime
                                ? theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                                : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                {formatTimeDisplay(checkOutTime)}
                            </div>
                            {checkOutTime && (
                                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Checked out on {currentLocalDate}
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
                                className={`px-8 py-4 cursor-pointer rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${!isOnOfficeNetwork
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
                                className={`px-8 py-4 cursor-pointer rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${!isOnOfficeNetwork
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
                            <div className={`px-8 py-4 rounded-xl flex items-center justify-center gap-3 ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
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
                                className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                    }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Shield className={`w-4 h-4 mt-0.5 ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'
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
                                        <Wifi className={`w-4 h-4 mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
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
                                        <Smartphone className={`w-4 h-4 mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
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
                    className={`mt-6 rounded-2xl p-6 shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                        }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                            }`}>
                            <Award className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                }`} />
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                Attendance Guidelines
                            </h3>
                            <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
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
                                    Office hours: 10:00 AM - 7:00 PM
                                </li>
                                <li className="flex items-center gap-2">
                                    <History size={14} className="text-emerald-500" />
                                    Click "View History" to see your attendance for any date
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