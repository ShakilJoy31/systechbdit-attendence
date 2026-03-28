// components/employee/EmployeeList.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    User,
    Mail,
    Phone,
    Briefcase,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Calendar,
    XCircle,
    Users,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useThemeContext';
import { 
    useGetAllEmployeesQuery, 
    useDeleteEmployeeMutation,
    useUpdateEmployeeStatusMutation 
} from '@/redux/api/employee/employeeApi';
import AddEditEmployeeModal from './AddEditEmployeeModal';
import { Employee } from '@/utils/interface/employeeInterface';

interface EmployeeListProps {
    userId?: string | null;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ userId }) => {
    const { theme } = useTheme();
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        department: "",
        shift: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [, setSelectedEmployee] = useState<Employee | null>(null);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; employee: Employee | null }>({ isOpen: false, employee: null });

    const {
        data: employeesData,
        isLoading,
        isError,
        refetch
    } = useGetAllEmployeesQuery({
        page: currentPage,
        limit: itemsPerPage,
        ...filters
    });

    const [deleteEmployee] = useDeleteEmployeeMutation();
    const [updateEmployeeStatus] = useUpdateEmployeeStatusMutation();

    const employees = employeesData?.data || [];
    const pagination = employeesData?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    // const handleView = (employee: Employee) => {
    //     setSelectedEmployee(employee);
    // };

    const handleEdit = (employee: Employee) => {
        setEmployeeToEdit(employee);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (employee: Employee) => {
        setDeleteModal({ isOpen: true, employee });
    };

    const handleDelete = async () => {
        if (!deleteModal.employee) return;

        try {
            await deleteEmployee(deleteModal.employee.id!).unwrap();
            toast.success('Employee deleted successfully');
            setDeleteModal({ isOpen: false, employee: null });
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to delete employee');
        }
    };

    const handleStatusToggle = async (employee: Employee) => {
        const newStatus = employee.status === 'active' ? 'inactive' : 'active';
        try {
            await updateEmployeeStatus({
                id: employee.id!,
                status: newStatus
            }).unwrap();
            toast.success(`Employee status updated to ${newStatus}`);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getShiftBadge = (shift: string) => {
        switch (shift) {
            case 'morning': return 'bg-blue-500/20 text-blue-400';
            case 'evening': return 'bg-orange-500/20 text-orange-400';
            case 'night': return 'bg-purple-500/20 text-purple-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isError) {
        return (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p>Failed to load employees</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => refetch()}
                    className={`mt-4 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto ${
                        theme === 'dark'
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                >
                    Retry
                </motion.button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            >
                <div>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        All Employees
                    </h2>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Manage your workforce and their information
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setEmployeeToEdit(null);
                        setIsAddModalOpen(true);
                    }}
                    className={`px-5 py-2.5 cursor-pointer rounded-xl transition-all duration-300 flex items-center gap-2 group ${
                        theme === 'dark'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    } shadow-lg shadow-emerald-500/20`}
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Add New Employee
                </motion.button>
            </motion.div>

            {/* Filters Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl p-6 shadow-lg transition-colors duration-300 ${
                    theme === 'dark'
                        ? 'bg-gray-800/50 border border-gray-700'
                        : 'bg-white border border-gray-200'
                }`}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <Search size={20} className="text-emerald-500" />
                        Filter Employees
                    </h3>
                    {(filters.search || filters.status || filters.department || filters.shift) && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilters({ search: "", status: "", department: "", shift: "" })}
                            className={`text-sm px-3 py-1 rounded-lg flex items-center gap-1 ${
                                theme === 'dark'
                                    ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                    : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                            }`}
                        >
                            <XCircle size={14} />
                            Clear Filters
                        </motion.button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            placeholder="Search by name, email, ID..."
                            className={`w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                theme === 'dark'
                                    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                            } border`}
                        />
                    </div>

                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                            theme === 'dark'
                                ? 'bg-gray-900 border-gray-700 text-white'
                                : 'bg-gray-50 border-gray-200 text-gray-900'
                        } border`}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <select
                        value={filters.department}
                        onChange={(e) => handleFilterChange("department", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                            theme === 'dark'
                                ? 'bg-gray-900 border-gray-700 text-white'
                                : 'bg-gray-50 border-gray-200 text-gray-900'
                        } border`}
                    >
                        <option value="">All Departments</option>
                        <option value="HR">HR</option>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Operations">Operations</option>
                    </select>

                    <select
                        value={filters.shift}
                        onChange={(e) => handleFilterChange("shift", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                            theme === 'dark'
                                ? 'bg-gray-900 border-gray-700 text-white'
                                : 'bg-gray-50 border-gray-200 text-gray-900'
                        } border`}
                    >
                        <option value="">All Shifts</option>
                        <option value="morning">Morning</option>
                        <option value="evening">Evening</option>
                        <option value="night">Night</option>
                    </select>
                </div>
            </motion.div>

            {/* Employees Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`rounded-2xl overflow-hidden shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
            >
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
                        <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading employees...</p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="text-center py-16">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            No Employees Found
                        </h3>
                        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Add your first employee to get started with attendance tracking.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-6 py-3 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-300 inline-flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add Your First Employee
                        </motion.button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Shift</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee: Employee, index: number) => (
                                        <motion.tr
                                            key={employee.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
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
                                                            {employee.name}
                                                        </p>
                                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            ID: {employee.employeeId}
                                                        </p>
                                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {employee.designation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase size={14} className="text-emerald-500" />
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {employee.department}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={12} className="text-gray-400" />
                                                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {employee.email}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={12} className="text-gray-400" />
                                                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {employee.phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getShiftBadge(employee.shift)}`}>
                                                    {employee.shift.charAt(0).toUpperCase() + employee.shift.slice(1)}
                                                </span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Calendar size={10} className="text-gray-400" />
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        Joined: {formatDate(employee.joiningDate)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleStatusToggle(employee)}
                                                    className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(employee.status)} transition-all duration-300 hover:scale-105`}
                                                >
                                                    {employee.status}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEdit(employee)}
                                                        className={`p-1.5 cursor-pointer rounded-lg transition-colors duration-300 ${
                                                            theme === 'dark'
                                                                ? 'hover:bg-gray-700 text-blue-400'
                                                                : 'hover:bg-gray-100 text-blue-600'
                                                        }`}
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteClick(employee)}
                                                        className={`p-1.5 cursor-pointer rounded-lg transition-colors duration-300 ${
                                                            theme === 'dark'
                                                                ? 'hover:bg-gray-700 text-red-400'
                                                                : 'hover:bg-gray-100 text-red-600'
                                                        }`}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} employees
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
                                            {currentPage} / {pagination.totalPages}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                            disabled={currentPage === pagination.totalPages}
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

            {/* Add/Edit Employee Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddEditEmployeeModal
                        employeeData={employeeToEdit}
                        isOpen={isAddModalOpen}
                        onClose={(refreshData: boolean) => {
                            setIsAddModalOpen(false);
                            setEmployeeToEdit(null);
                            if (refreshData) {
                                refetch();
                            }
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`rounded-2xl p-8 w-full max-w-md shadow-2xl ${
                                theme === 'dark'
                                    ? 'bg-gray-800 border border-gray-700'
                                    : 'bg-white border border-gray-200'
                            }`}
                        >
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/10 mb-6">
                                    <Trash2 className="h-10 w-10 text-red-500" />
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Delete Employee?
                                </h3>
                                <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    This will permanently delete{' '}
                                    <span className="font-semibold">{deleteModal.employee?.name}</span> from the system.
                                    This action cannot be undone.
                                </p>
                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setDeleteModal({ isOpen: false, employee: null })}
                                        className={`flex-1 py-3 cursor-pointer px-4 rounded-xl transition-all duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDelete}
                                        className="flex-1 cursor-pointer bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-all duration-300"
                                    >
                                        Delete
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmployeeList;