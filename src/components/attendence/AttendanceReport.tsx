// components/attendance/AttendanceReport.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Search,
    Users,
    CheckCircle,
    Clock,
    Zap,
    XCircle,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    User,
    Briefcase,
    Download,
    RefreshCw
} from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import { useGetDailyAttendanceReportQuery } from "@/redux/api/attendence/attendanceApi";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

interface TabType {
    id: 'present' | 'late' | 'half-day' | 'absent';
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

const AttendanceReport = () => {
    const { theme } = useTheme();
    const [selectedDate, setSelectedDate] = useState(getCurrentLocalDate());
    const [activeTab, setActiveTab] = useState<'present' | 'late' | 'half-day' | 'absent'>('present');
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const {
        data: attendanceReport,
        isLoading,
        isError,
        refetch
    } = useGetDailyAttendanceReportQuery({ date: selectedDate });

    const reportData = attendanceReport?.data;
    const allRecords = reportData?.records || [];

    // Filter records based on active tab
    const filteredRecords = allRecords.filter(record => record.status === activeTab);
    
    // Further filter by search term
    const searchedRecords = filteredRecords.filter(record =>
        record.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee?.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(searchedRecords.length / itemsPerPage);
    const paginatedRecords = searchedRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when tab or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm, selectedDate]);

    // Helper function to get current local date
    function getCurrentLocalDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const tabs: TabType[] = [
        {
            id: 'present',
            label: 'Present',
            icon: <CheckCircle size={18} />,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10'
        },
        {
            id: 'late',
            label: 'Late',
            icon: <Clock size={18} />,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10'
        },
        {
            id: 'half-day',
            label: 'Half Day',
            icon: <Zap size={18} />,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10'
        },
        {
            id: 'absent',
            label: 'Absent',
            icon: <XCircle size={18} />,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10'
        }
    ];

    const stats = {
        total: allRecords.length,
        present: allRecords.filter(r => r.status === 'present').length,
        late: allRecords.filter(r => r.status === 'late').length,
        halfDay: allRecords.filter(r => r.status === 'half-day').length,
        absent: allRecords.filter(r => r.status === 'absent').length,
        attendanceRate: reportData?.attendanceRate || 0
    };

    const formatTime = (time?: string) => {
        if (!time) return "—";
        return time.substring(0, 5);
    };

    const handleExport = () => {
        const data = searchedRecords.map(record => ({
            Name: record.employee?.name,
            'Employee ID': record.employee?.employeeId,
            Department: record.employee?.department,
            Designation: record.employee?.designation,
            Status: record.status === 'half-day' ? 'Half Day' : record.status.charAt(0).toUpperCase() + record.status.slice(1),
            'Check In': formatTime(record.checkIn),
            'Check Out': formatTime(record.checkOut),
            'Overtime': record.overtime ? `${record.overtime} hrs` : '—',
            Note: record.checkInNote || record.checkOutNote || '—'
        }));

        const csv = [
            Object.keys(data[0] || {}).join(','),
            ...data.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${selectedDate}_${activeTab}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Report exported successfully!');
    };

    if (isError) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`text-center p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Failed to Load Report
                    </h3>
                    <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Unable to fetch attendance data. Please try again.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => refetch()}
                        className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all"
                    >
                        Retry
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
                                Attendance Report
                            </h1>
                            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                View and manage daily attendance records
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => refetch()}
                                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                                    theme === 'dark'
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                <RefreshCw size={18} />
                                Refresh
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleExport}
                                disabled={searchedRecords.length === 0}
                                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                                    searchedRecords.length === 0
                                        ? 'opacity-50 cursor-not-allowed'
                                        : theme === 'dark'
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                            >
                                <Download size={18} />
                                Export CSV
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Date Selector & Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className={`rounded-2xl p-6 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                                        placeholder="Search by name, ID, or designation..."
                                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        } border`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Employees</p>
                                <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                            </div>
                            <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Present</p>
                                <p className={`text-2xl font-bold mt-1 text-emerald-500`}>{stats.present}</p>
                            </div>
                            <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Late</p>
                                <p className={`text-2xl font-bold mt-1 text-orange-500`}>{stats.late}</p>
                            </div>
                            <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Half Day</p>
                                <p className={`text-2xl font-bold mt-1 text-blue-500`}>{stats.halfDay}</p>
                            </div>
                            <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Attendance Rate</p>
                                <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.attendanceRate.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="flex gap-2 flex-wrap">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? `${tab.bgColor} ${tab.color} border ${tab.color.replace('text', 'border')}/30`
                                        : theme === 'dark'
                                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                {tab.icon}
                                <span className="font-medium">{tab.label}</span>
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === tab.id
                                        ? tab.bgColor
                                        : theme === 'dark'
                                        ? 'bg-gray-700'
                                        : 'bg-gray-100'
                                }`}>
                                    {tab.id === 'present' ? stats.present : 
                                     tab.id === 'late' ? stats.late : 
                                     tab.id === 'half-day' ? stats.halfDay : 
                                     stats.absent}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Results Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`rounded-2xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                >
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="animate-spin h-10 w-10 text-emerald-500 mx-auto" />
                            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Loading attendance data...
                            </p>
                        </div>
                    ) : paginatedRecords.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                No {activeTab === 'half-day' ? 'Half Day' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Employees
                            </h3>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {searchTerm 
                                    ? `No employees match your search criteria for ${format(new Date(selectedDate), 'MMMM d, yyyy')}`
                                    : `No employees marked as ${activeTab === 'half-day' ? 'half day' : activeTab} on ${format(new Date(selectedDate), 'MMMM d, yyyy')}`}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Check In</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Check Out</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Overtime</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRecords.map((record, index) => (
                                            <motion.tr
                                                key={record.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`border-t ${
                                                    theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'
                                                } transition-colors duration-300`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                            <User className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                                                        </div>
                                                        <div>
                                                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                {record.employee?.name}
                                                            </p>
                                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                ID: {record.employee?.employeeId}
                                                            </p>
                                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {record.employee?.designation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase size={14} className="text-emerald-500" />
                                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {record.employee?.department}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={12} className="text-emerald-500" />
                                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                {formatTime(record.checkIn)}
                                                            </span>
                                                        </div>
                                                        {record.checkInNote && (
                                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {record.checkInNote}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={12} className="text-orange-500" />
                                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                {formatTime(record.checkOut)}
                                                            </span>
                                                        </div>
                                                        {record.checkOutNote && (
                                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {record.checkOutNote}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm font-medium ${record.overtime ? 'text-emerald-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {record.overtime ? `${record.overtime} hrs` : "—"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {record.checkInNote || record.checkOutNote || "—"}
                                                    </p>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchedRecords.length)} of {searchedRecords.length} employees
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={`p-2 rounded-lg transition-all duration-300 ${
                                                    theme === 'dark'
                                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30'
                                                } disabled:cursor-not-allowed`}
                                            >
                                                <ChevronLeft size={20} />
                                            </motion.button>
                                            <span className={`px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                                {currentPage} / {totalPages}
                                            </span>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className={`p-2 rounded-lg transition-all duration-300 ${
                                                    theme === 'dark'
                                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30'
                                                } disabled:cursor-not-allowed`}
                                            >
                                                <ChevronRight size={20} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AttendanceReport;