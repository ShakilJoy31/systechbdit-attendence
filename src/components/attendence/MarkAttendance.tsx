// components/attendance/MarkAttendance.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    CheckCircle, XCircle, Clock, Calendar, User, Search, 
    Loader2, AlertCircle, RefreshCw, Zap
} from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import { useGetAllEmployeesQuery } from "@/redux/api/employee/employeeApi";
import { useMarkAttendanceMutation, useGetDailyAttendanceReportQuery } from "@/redux/api/attendence/attendanceApi";
import { toast } from "react-hot-toast";

interface AttendanceRecord {
    employeeId: number;
    name: string;
    status: 'present' | 'absent' | 'late' | 'half-day';
    checkIn?: string;
    checkOut?: string;
    note?: string;
}

// Helper function to get current date in YYYY-MM-DD format in local timezone
const getCurrentLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const MarkAttendance = () => {
    const { theme } = useTheme();
    const [selectedDate, setSelectedDate] = useState(getCurrentLocalDate());
    const [searchTerm, setSearchTerm] = useState("");
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch all active employees
    const { data: employeesData, isLoading: isLoadingEmployees } = useGetAllEmployeesQuery({
        page: 1,
        limit: 1000,
        status: "active"
    });
    
    // Fetch existing attendance for the selected date
    const { 
        data: attendanceReport, 
        isLoading: isLoadingAttendance,
        refetch: refetchAttendance 
    } = useGetDailyAttendanceReportQuery({ date: selectedDate });
    
    const [markAttendance] = useMarkAttendanceMutation();

    const employees = employeesData?.data || [];
    const existingAttendance = attendanceReport?.data?.records || [];

    // Initialize or update attendance data when employees or existing attendance changes
    useEffect(() => {
        if (employees.length > 0) {
            // Create a map of existing attendance by employeeId
            const attendanceMap = new Map();
            existingAttendance.forEach(record => {
                attendanceMap.set(record.employeeId, {
                    status: record.status,
                    checkIn: record.checkIn,
                    checkOut: record.checkOut,
                    note: record.checkInNote || record.checkOutNote,
                });
            });

            // Initialize attendance data for all employees
            const initialAttendance = employees.map(emp => {
                const existing = attendanceMap.get(emp.id);
                return {
                    employeeId: emp.id!,
                    name: emp.name,
                    status: existing?.status || 'absent',
                    checkIn: existing?.checkIn || undefined,
                    checkOut: existing?.checkOut || undefined,
                    note: existing?.note || undefined,
                };
            });
            
            setAttendanceData(initialAttendance);
        }
    }, [employees, existingAttendance]);

    // Refetch attendance when date changes
    useEffect(() => {
        refetchAttendance();
    }, [selectedDate, refetchAttendance]);

    const handleStatusChange = (employeeId: number, status: 'present' | 'absent' | 'late' | 'half-day') => {
        setAttendanceData(prev =>
            prev.map(record =>
                record.employeeId === employeeId
                    ? { 
                        ...record, 
                        status, 
                        ...(status === 'absent' ? { checkIn: undefined, checkOut: undefined } : {}) 
                    }
                    : record
            )
        );
    };

    const handleTimeChange = (employeeId: number, field: 'checkIn' | 'checkOut', value: string) => {
        setAttendanceData(prev =>
            prev.map(record =>
                record.employeeId === employeeId
                    ? { ...record, [field]: value }
                    : record
            )
        );
    };

    const handleNoteChange = (employeeId: number, note: string) => {
        setAttendanceData(prev =>
            prev.map(record =>
                record.employeeId === employeeId
                    ? { ...record, note }
                    : record
            )
        );
    };

    const applyQuickAction = (status: 'present' | 'absent' | 'late' | 'half-day', time?: string) => {
        const updatedData = attendanceData.map(record => ({
            ...record,
            status,
            ...(status !== 'absent' && time ? { checkIn: time, checkOut: time } : {}),
            ...(status === 'absent' ? { checkIn: undefined, checkOut: undefined } : {}),
        }));
        setAttendanceData(updatedData);
        toast.success(`All employees marked as ${status}`);
    };

    const handleSubmit = async () => {
        // Prepare attendance data for submission (only non-absent employees)
        const attendanceToSubmit = attendanceData
            .filter(record => record.status !== 'absent')
            .map(record => ({
                employeeId: record.employeeId,
                status: record.status,
                checkIn: record.checkIn,
                checkOut: record.checkOut,
                note: record.note,
            }));

        if (attendanceToSubmit.length === 0 && attendanceData.length > 0) {
            toast("All employees marked as absent. No attendance records to submit.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await markAttendance({
                date: selectedDate,
                attendance: attendanceToSubmit,
            }).unwrap();

            if (response.success) {
                toast.success(response.message);
                // Refetch attendance to show updated data
                await refetchAttendance();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to mark attendance");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredEmployees = attendanceData.filter(record =>
        record.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: filteredEmployees.length,
        present: filteredEmployees.filter(r => r.status === 'present').length,
        absent: filteredEmployees.filter(r => r.status === 'absent').length,
        late: filteredEmployees.filter(r => r.status === 'late').length,
        halfDay: filteredEmployees.filter(r => r.status === 'half-day').length,
    };

    const isLoading = isLoadingEmployees || isLoadingAttendance;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Mark Attendance
                        </h1>
                        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Record daily attendance for employees
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

            {/* Date Selector & Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl p-6 mb-6 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Select Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-200 text-gray-900'
                                } border`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Search Employee
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name..."
                                className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                } border`}
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Quick Actions:
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => applyQuickAction('present', '09:00')}
                            className="px-3 py-1.5 rounded-lg text-sm bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all"
                        >
                            All Present (9:00)
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => applyQuickAction('late', '10:30')}
                            className="px-3 py-1.5 rounded-lg text-sm bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all"
                        >
                            All Late (10:30)
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => applyQuickAction('half-day', '09:00')}
                            className="px-3 py-1.5 rounded-lg text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
                        >
                            All Half Day
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => applyQuickAction('absent')}
                            className="px-3 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                        >
                            All Absent
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
            >
                <div className={`rounded-2xl p-4 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
                            <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                        </div>
                        <User className="w-8 h-8 text-emerald-500 opacity-50" />
                    </div>
                </div>

                <div className={`rounded-2xl p-4 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Present</p>
                            <p className={`text-2xl font-bold mt-1 text-emerald-500`}>{stats.present}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-emerald-500 opacity-50" />
                    </div>
                </div>

                <div className={`rounded-2xl p-4 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Late</p>
                            <p className={`text-2xl font-bold mt-1 text-orange-500`}>{stats.late}</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500 opacity-50" />
                    </div>
                </div>

                <div className={`rounded-2xl p-4 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Half Day</p>
                            <p className={`text-2xl font-bold mt-1 text-blue-500`}>{stats.halfDay}</p>
                        </div>
                        <Zap className="w-8 h-8 text-blue-500 opacity-50" />
                    </div>
                </div>

                <div className={`rounded-2xl p-4 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Absent</p>
                            <p className={`text-2xl font-bold mt-1 text-red-500`}>{stats.absent}</p>
                        </div>
                        <XCircle className="w-8 h-8 text-red-500 opacity-50" />
                    </div>
                </div>
            </motion.div>

            {/* Attendance Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-2xl overflow-hidden shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
            >
                {isLoading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="animate-spin h-8 w-8 text-emerald-500 mx-auto" />
                        <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading employees...</p>
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No employees found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Check In</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Check Out</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((record, index) => (
                                        <motion.tr
                                            key={record.employeeId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`border-t ${
                                                theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'
                                            } transition-colors duration-300`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-xl ${
                                                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                                    }`}>
                                                        <User className={`w-5 h-5 ${
                                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                        }`} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                            {record.name}
                                                        </p>
                                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            ID: {employees.find(e => e.id === record.employeeId)?.employeeId}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {(['present', 'late', 'half-day', 'absent'] as const).map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleStatusChange(record.employeeId, status)}
                                                            className={`px-3 cursor-pointer py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                                                                record.status === status
                                                                    ? status === 'present'
                                                                        ? 'bg-emerald-500 text-white'
                                                                        : status === 'late'
                                                                        ? 'bg-orange-500 text-white'
                                                                        : status === 'half-day'
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-red-500 text-white'
                                                                    : theme === 'dark'
                                                                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {status === 'half-day' ? 'Half Day' : status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="time"
                                                    value={record.checkIn || ''}
                                                    onChange={(e) => handleTimeChange(record.employeeId, 'checkIn', e.target.value)}
                                                    disabled={record.status === 'absent'}
                                                    className={`px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                        record.status === 'absent'
                                                            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                                                            : ''
                                                    } ${
                                                        theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white'
                                                            : 'bg-gray-50 border-gray-200 text-gray-900'
                                                    } border w-28`}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="time"
                                                    value={record.checkOut || ''}
                                                    onChange={(e) => handleTimeChange(record.employeeId, 'checkOut', e.target.value)}
                                                    disabled={record.status === 'absent'}
                                                    className={`px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                        record.status === 'absent'
                                                            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                                                            : ''
                                                    } ${
                                                        theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white'
                                                            : 'bg-gray-50 border-gray-200 text-gray-900'
                                                    } border w-28`}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    value={record.note || ''}
                                                    onChange={(e) => handleNoteChange(record.employeeId, e.target.value)}
                                                    placeholder="Optional note..."
                                                    disabled={record.status === 'absent'}
                                                    className={`px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                        record.status === 'absent'
                                                            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                                                            : ''
                                                    } ${
                                                        theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                                    } border w-40`}
                                                />
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Submit Button */}
                        <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-8 py-3 cursor-pointer bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={20} />
                                            Submit Attendance
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default MarkAttendance;