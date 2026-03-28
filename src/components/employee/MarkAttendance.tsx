// components/attendance/MarkAttendance.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Calendar, User, Search } from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import { useGetAllEmployeesQuery } from "@/redux/api/employee/employeeApi";
import { toast } from "react-hot-toast";

interface AttendanceRecord {
    employeeId: number;
    name: string;
    status: 'present' | 'absent' | 'late';
    checkIn?: string;
    checkOut?: string;
    date: string;
}

const MarkAttendance = () => {
    const { theme } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: employeesData, isLoading } = useGetAllEmployeesQuery({
        page: 1,
        limit: 100,
        status: "active"
    });

    const employees = employeesData?.data || [];

    // Initialize attendance data when employees load
    React.useEffect(() => {
        if (employees.length > 0 && attendanceData.length === 0) {
            const initialAttendance = employees.map(emp => ({
                employeeId: emp.id!,
                name: emp.name,
                status: 'absent' as const,
                date: selectedDate
            }));
            setAttendanceData(initialAttendance);
        }
    }, [employees]);

    const handleStatusChange = (employeeId: number, status: 'present' | 'absent' | 'late') => {
        setAttendanceData(prev =>
            prev.map(record =>
                record.employeeId === employeeId
                    ? { ...record, status }
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

    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        // Filter only present/late employees for attendance submission
        const attendanceToSubmit = attendanceData.filter(
            record => record.status !== 'absent'
        );

        try {
            // Here you'll call your attendance API
            // await createAttendance(attendanceToSubmit);
            
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            toast.success(`Attendance marked for ${attendanceToSubmit.length} employees`);
        } catch (error) {
            console.log(error)
            toast.error("Failed to mark attendance");
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
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 p-4 md:p-6 lg:p-8 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Mark Attendance
                </h1>
                <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Record daily attendance for employees
                </p>
            </motion.div>

            {/* Date Selector & Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl p-6 mb-6 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
                <div className={`rounded-2xl p-6 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Employees</p>
                            <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                        </div>
                        <User className="w-12 h-12 text-emerald-500 opacity-50" />
                    </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Present</p>
                            <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.present}</p>
                        </div>
                        <CheckCircle className="w-12 h-12 text-emerald-500 opacity-50" />
                    </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Absent</p>
                            <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.absent}</p>
                        </div>
                        <XCircle className="w-12 h-12 text-red-500 opacity-50" />
                    </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Late</p>
                            <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.late}</p>
                        </div>
                        <Clock className="w-12 h-12 text-orange-500 opacity-50" />
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
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
                        <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading employees...</p>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((record) => (
                                        <tr
                                            key={record.employeeId}
                                            className={`border-t ${
                                                theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                                            }`}
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
                                                        <p className={`font-medium ${
                                                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                            {record.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(record.employeeId, 'present')}
                                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                                                            record.status === 'present'
                                                                ? 'bg-emerald-500 text-white'
                                                                : theme === 'dark'
                                                                ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        Present
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(record.employeeId, 'late')}
                                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                                                            record.status === 'late'
                                                                ? 'bg-orange-500 text-white'
                                                                : theme === 'dark'
                                                                ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        Late
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(record.employeeId, 'absent')}
                                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                                                            record.status === 'absent'
                                                                ? 'bg-red-500 text-white'
                                                                : theme === 'dark'
                                                                ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        Absent
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="time"
                                                    value={record.checkIn || ''}
                                                    onChange={(e) => handleTimeChange(record.employeeId, 'checkIn', e.target.value)}
                                                    disabled={record.status === 'absent'}
                                                    className={`px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                        record.status === 'absent'
                                                            ? 'opacity-50 cursor-not-allowed'
                                                            : ''
                                                    } ${
                                                        theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white'
                                                            : 'bg-gray-50 border-gray-200 text-gray-900'
                                                    } border`}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="time"
                                                    value={record.checkOut || ''}
                                                    onChange={(e) => handleTimeChange(record.employeeId, 'checkOut', e.target.value)}
                                                    disabled={record.status === 'absent'}
                                                    className={`px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                        record.status === 'absent'
                                                            ? 'opacity-50 cursor-not-allowed'
                                                            : ''
                                                    } ${
                                                        theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white'
                                                            : 'bg-gray-50 border-gray-200 text-gray-900'
                                                    } border`}
                                                />
                                            </td>
                                        </tr>
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
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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