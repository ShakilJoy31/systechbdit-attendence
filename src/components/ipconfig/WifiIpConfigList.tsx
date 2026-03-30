"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Wifi,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    XCircle,
    Network,
    CheckCircle,
    XCircle as XCircleIcon,
    Loader2,
    RefreshCw,
    Shield,
    Activity,
    AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useThemeContext';
import { useDeleteIpConfigMutation, useGetAllIpConfigsQuery, useGetIpConfigStatsQuery, useToggleIpConfigStatusMutation, WifiIpConfig } from '@/redux/api/employee/wifiIpConfigApi';
import AddEditIpConfigModal from './AddEditIpConfigModal';

const WifiIpConfigList: React.FC = () => {
    const { theme } = useTheme();
    const [filters, setFilters] = useState({
        search: "",
        isActive: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [configToEdit, setConfigToEdit] = useState<WifiIpConfig | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; config: WifiIpConfig | null }>({ isOpen: false, config: null });

    const {
        data: configsData,
        isLoading,
        isError,
        refetch
    } = useGetAllIpConfigsQuery({
        page: currentPage,
        limit: itemsPerPage,
        ...filters
    });

    const { data: statsData } = useGetIpConfigStatsQuery();
    const [deleteIpConfig] = useDeleteIpConfigMutation();
    const [toggleIpConfigStatus] = useToggleIpConfigStatusMutation();

    const configs = configsData?.data || [];
    const pagination = configsData?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    };
    const stats = statsData?.data;

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleEdit = (config: WifiIpConfig) => {
        setConfigToEdit(config);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (config: WifiIpConfig) => {
        setDeleteModal({ isOpen: true, config });
    };

    const handleDelete = async () => {
        if (!deleteModal.config) return;

        try {
            await deleteIpConfig(deleteModal.config.id).unwrap();
            toast.success('IP configuration deleted successfully');
            setDeleteModal({ isOpen: false, config: null });
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete IP configuration');
        }
    };

    const handleStatusToggle = async (config: WifiIpConfig) => {
        const newStatus = !config.isActive;
        try {
            await toggleIpConfigStatus({
                id: config.id,
                isActive: newStatus
            }).unwrap();
            toast.success(`IP configuration ${newStatus ? 'activated' : 'deactivated'} successfully`);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update status');
        }
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive 
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isError) {
        return (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p>Failed to load IP configurations</p>
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
                    <RefreshCw size={18} />
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
                        WiFi IP Configuration
                    </h2>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Manage trusted office networks for attendance verification
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setConfigToEdit(null);
                        setIsAddModalOpen(true);
                    }}
                    className={`px-5 py-2.5 cursor-pointer rounded-xl transition-all duration-300 flex items-center gap-2 group ${
                        theme === 'dark'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    } shadow-lg shadow-emerald-500/20`}
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Add New IP
                </motion.button>
            </motion.div>

            {/* Statistics Cards */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                    <div className={`rounded-2xl p-5 shadow-lg transition-colors duration-300 ${
                        theme === 'dark'
                            ? 'bg-gray-800/50 border border-gray-700'
                            : 'bg-white border border-gray-200'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Total IPs
                                </p>
                                <p className={`text-3xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-500/20">
                                <Network className="w-6 h-6 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-2xl p-5 shadow-lg transition-colors duration-300 ${
                        theme === 'dark'
                            ? 'bg-gray-800/50 border border-gray-700'
                            : 'bg-white border border-gray-200'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Active IPs
                                </p>
                                <p className={`text-3xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.active}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-500/20">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-2xl p-5 shadow-lg transition-colors duration-300 ${
                        theme === 'dark'
                            ? 'bg-gray-800/50 border border-gray-700'
                            : 'bg-white border border-gray-200'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Inactive IPs
                                </p>
                                <p className={`text-3xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.inactive}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-500/20">
                                <XCircleIcon className="w-6 h-6 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-2xl p-5 shadow-lg transition-colors duration-300 ${
                        theme === 'dark'
                            ? 'bg-gray-800/50 border border-gray-700'
                            : 'bg-white border border-gray-200'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Recently Added
                                </p>
                                <p className={`text-3xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.recentlyAdded}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/20">
                                <Activity className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

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
                        Filter IP Configurations
                    </h3>
                    {(filters.search || filters.isActive) && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilters({ search: "", isActive: "" })}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            placeholder="Search by IP address or name..."
                            className={`w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                theme === 'dark'
                                    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                            } border`}
                        />
                    </div>

                    <select
                        value={filters.isActive}
                        onChange={(e) => handleFilterChange("isActive", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                            theme === 'dark'
                                ? 'bg-gray-900 border-gray-700 text-white'
                                : 'bg-gray-50 border-gray-200 text-gray-900'
                        } border`}
                    >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
            </motion.div>

            {/* IP Configs Table */}
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
                        <Loader2 className="animate-spin h-8 w-8 text-emerald-500 mx-auto mb-4" />
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Loading IP configurations...
                        </p>
                    </div>
                ) : configs.length === 0 ? (
                    <div className="text-center py-16">
                        <Wifi className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            No IP Configurations Found
                        </h3>
                        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Add your first office IP address to secure attendance marking.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-6 py-3 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-300 inline-flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add Your First IP
                        </motion.button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">IP Address</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {configs.map((config: WifiIpConfig, index: number) => (
                                        <motion.tr
                                            key={config.id}
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
                                                        <Shield className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-mono font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                            {config.ipAddress}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Wifi size={14} className="text-emerald-500" />
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {config.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleStatusToggle(config)}
                                                    className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(config.isActive)} transition-all duration-300 hover:scale-105`}
                                                >
                                                    {config.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {formatDate(config.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEdit(config)}
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
                                                        onClick={() => handleDeleteClick(config)}
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
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} IPs
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

            {/* Add/Edit IP Config Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddEditIpConfigModal
                        configData={configToEdit}
                        isOpen={isAddModalOpen}
                        onClose={(refreshData: boolean) => {
                            setIsAddModalOpen(false);
                            setConfigToEdit(null);
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
                                    <AlertTriangle className="h-10 w-10 text-red-500" />
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Delete IP Configuration?
                                </h3>
                                <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    This will permanently delete{' '}
                                    <span className="font-semibold">{deleteModal.config?.ipAddress}</span> from the system.
                                    Employees on this network will not be able to mark attendance.
                                </p>
                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setDeleteModal({ isOpen: false, config: null })}
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

export default WifiIpConfigList;