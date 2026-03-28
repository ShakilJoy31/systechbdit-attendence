// components/attendance/SelfAttendance.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    CheckCircle, XCircle, Calendar, MapPin, 
    Smartphone, Loader2, LogIn, LogOut,
    User, Briefcase, Award
} from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { useGetMyTodayAttendanceQuery, useSelfCheckInMutation, useSelfCheckOutMutation } from "@/redux/api/attendence/attendanceApi";

const SelfAttendance = () => {
    const { theme } = useTheme();
    const [note, setNote] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState("");

    const { data: response, isLoading, refetch } = useGetMyTodayAttendanceQuery();
    const [selfCheckIn, { isLoading: isCheckingIn }] = useSelfCheckInMutation();
    const [selfCheckOut, { isLoading: isCheckingOut }] = useSelfCheckOutMutation();

    // Extract data from response
    const attendance = response?.data?.attendance;
    const employee = response?.data?.employee;
    const hasCheckedIn = response?.data?.hasCheckedIn || false;
    const hasCheckedOut = response?.data?.hasCheckedOut || false;

    // Get device info on mount
    useEffect(() => {
        const getDeviceInfo = () => {
            const userAgent = navigator.userAgent;
            const platform = navigator.platform;
            setDeviceInfo(`${platform} | ${userAgent.substring(0, 100)}...`);
        };
        getDeviceInfo();
    }, []);

    // Get current location
    const getCurrentLocation = () => {
        setIsGettingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    // Optional: Reverse geocoding to get address
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
                        setLocation({
                            lat: latitude,
                            lng: longitude,
                            address: data.display_name,
                        });
                        toast.success("Location captured successfully");
                    } catch {
                        setLocation({
                            lat: latitude,
                            lng: longitude,
                            address: `${latitude}, ${longitude}`,
                        });
                    }
                    setIsGettingLocation(false);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    toast.error("Unable to get location. Please enable location services.");
                    setIsGettingLocation(false);
                }
            );
        } else {
            toast.error("Geolocation is not supported by your browser");
            setIsGettingLocation(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            await selfCheckIn({
                note: note || undefined,
                location: location || undefined,
                deviceInfo: deviceInfo,
                ipAddress: await getIPAddress(),
            }).unwrap();
            toast.success("Check-in successful!");
            refetch();
            setNote("");
            setLocation(null);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to check in");
        }
    };

    const handleCheckOut = async () => {
        try {
            await selfCheckOut({
                note: note || undefined,
                location: location || undefined,
                deviceInfo: deviceInfo,
                ipAddress: await getIPAddress(),
            }).unwrap();
            toast.success("Check-out successful!");
            refetch();
            setNote("");
            setLocation(null);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to check out");
        }
    };

    const getIPAddress = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return undefined;
        }
    };

    const getStatusBadge = () => {
        if (hasCheckedOut) return { color: "bg-emerald-500", text: "Completed", icon: CheckCircle };
        if (hasCheckedIn) return { color: "bg-orange-500", text: "Checked In", icon: LogIn };
        return { color: "bg-gray-500", text: "Not Started", icon: XCircle };
    };

    const status = getStatusBadge();
    const StatusIcon = status.icon;

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 p-4 md:p-6 lg:p-8 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        My Attendance
                    </h1>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Mark your daily attendance
                    </p>
                </motion.div>

                {/* Employee Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`rounded-2xl p-6 mb-6 shadow-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <User className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1">
                            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {employee?.name || "Loading..."}
                            </h2>
                            <div className="flex flex-wrap gap-4 mt-2">
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    ID: {employee?.employeeId || "---"}
                                </span>
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Briefcase className="inline w-3 h-3 mr-1" />
                                    {employee?.designation || "---"}
                                </span>
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Award className="inline w-3 h-3 mr-1" />
                                    {employee?.department || "---"}
                                </span>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${status.color} text-white`}>
                            <StatusIcon size={16} />
                            <span className="text-sm font-medium">{status.text}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Today's Date Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`rounded-2xl p-6 mb-6 shadow-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-emerald-500" />
                        <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Today&apos;s Date</p>
                            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {format(new Date(), "EEEE, MMMM d, yyyy")}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Attendance Details Card */}
                {attendance && (hasCheckedIn || hasCheckedOut) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`rounded-2xl p-6 mb-6 shadow-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Today&apos;s Attendance Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Check In Time</p>
                                <p className={`text-xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {attendance.checkIn || "—"}
                                </p>
                                {attendance.checkInNote && (
                                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Note: {attendance.checkInNote}
                                    </p>
                                )}
                            </div>
                            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Check Out Time</p>
                                <p className={`text-xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {attendance.checkOut || "—"}
                                </p>
                                {attendance.checkOutNote && (
                                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Note: {attendance.checkOutNote}
                                    </p>
                                )}
                            </div>
                            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                                <p className={`text-xl font-bold mt-1 capitalize ${
                                    attendance.status === 'present' ? 'text-emerald-500' :
                                    attendance.status === 'late' ? 'text-orange-500' :
                                    attendance.status === 'half-day' ? 'text-blue-500' :
                                    'text-red-500'
                                }`}>
                                    {attendance.status === 'half-day' ? 'Half Day' : attendance.status}
                                </p>
                                {attendance.overtime ? (
                                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Overtime: {attendance.overtime} hrs
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Location Info */}
                {location && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`rounded-2xl p-4 mb-6 shadow-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {location.address || `${location.lat}, ${location.lng}`}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`rounded-2xl p-6 shadow-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Note (Optional)
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add a note about your attendance..."
                                rows={2}
                                disabled={hasCheckedOut}
                                className={`w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                    hasCheckedOut
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                } ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                } border`}
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {!hasCheckedIn && !hasCheckedOut && (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={getCurrentLocation}
                                        disabled={isGettingLocation}
                                        className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {isGettingLocation ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <MapPin size={18} />
                                        )}
                                        Get Location
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCheckIn}
                                        disabled={isCheckingIn}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isCheckingIn ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <LogIn size={20} />
                                        )}
                                        Check In
                                    </motion.button>
                                </>
                            )}

                            {hasCheckedIn && !hasCheckedOut && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCheckOut}
                                    disabled={isCheckingOut}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCheckingOut ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <LogOut size={20} />
                                    )}
                                    Check Out
                                </motion.button>
                            )}
                        </div>

                        {hasCheckedOut && (
                            <div className={`p-4 rounded-xl text-center ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    You have successfully completed your attendance for today!
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Device Info */}
                {deviceInfo && (
                    <div className={`mt-4 text-center`}>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <Smartphone size={12} />
                            <span>{deviceInfo.substring(0, 80)}...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelfAttendance;









//! Will be read letter..............

// // app/my-attendance/page.tsx (Employee View)
// import SelfAttendance from "@/components/attendance/SelfAttendance";
// import { generateDynamicMetadata } from "@/metadata/generateMetadata";
// import { Suspense } from "react";

// export async function generateMetadata() {
//     return generateDynamicMetadata({
//         title: "My Attendance | Attendance Management System",
//         description: "Mark your daily attendance - check in and check out with location tracking.",
//         keywords: ["my attendance", "check in", "check out", "self attendance"],
//     });
// }

// const MyAttendancePage = () => {
//     return (
//         <Suspense fallback={
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
//                 <div className="text-center">
//                     <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-xl text-gray-300">Loading Attendance Portal...</p>
//                 </div>
//             </div>
//         }>
//             <div className="min-h-screen p-4 md:p-6 lg:p-8">
//                 <SelfAttendance />
//             </div>
//         </Suspense>
//     );
// };

// export default MyAttendancePage;