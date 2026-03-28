"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    X,
    Plus,
    Loader,
    MessageSquare,
    TrendingUp,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Trash2,
    Send,
    Hash,
    ToggleLeft,
    ToggleRight,
    RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { SMS } from '@/utils/interface/smsConfiguration';
import { useDeleteSMSMutation, useGetClientSMSQuery, useGetSMSStatsQuery, useTestSMSMutation, useToggleSMSStatusMutation } from '@/redux/api/sms-configurations/smsApi';
import SMSDetailsModal from './SMSDetailsModal';
import AddEditSMSModal from './AddEditSMSModal';
import { useTheme } from '@/hooks/useThemeContext';

interface UserSMSConfigurationProps {
    clientId: string | number;
    client: {
        id: number;
        fullName: string;
        email: string;
        mobileNo: string;
        photo?: string;
    };
}

const UserSMSConfiguration: React.FC<UserSMSConfigurationProps> = ({ clientId, client }) => {
    const { theme } = useTheme();
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        type: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [viewModal, setViewModal] = useState<{ isOpen: boolean; sms: SMS | null }>({
        isOpen: false,
        sms: null,
    });

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; sms: SMS | null }>({
        isOpen: false,
        sms: null,
    });

    const [isAddSMSModalOpen, setIsAddSMSModalOpen] = useState(false);
    const [smsToEdit, setSmsToEdit] = useState<SMS | null>(null);

    // RTK Query hooks
    const {
        data: smsData,
        isLoading,
        isError,
        refetch
    } = useGetClientSMSQuery({
        clientId,
        page: currentPage,
        limit: itemsPerPage,
        ...filters
    });

    const { data: statsData } = useGetSMSStatsQuery(clientId);
    const [deleteSMS] = useDeleteSMSMutation();
    const [testSMS] = useTestSMSMutation();
    const [toggleSMSStatus] = useToggleSMSStatusMutation();

    const smsConfigs = smsData?.data || [];
    const pagination = smsData?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    };
    const stats = statsData?.data;

    // Handle filter changes
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            search: "",
            status: "",
            type: "",
        });
        setCurrentPage(1);
    };

    // Handle view action
    const handleView = (sms: SMS) => {
        setViewModal({ isOpen: true, sms });
    };

    // Handle edit action
    const handleEdit = (sms: SMS) => {
        setSmsToEdit(sms);
        setIsAddSMSModalOpen(true);
    };

    // Handle delete confirmation
    const handleDeleteClick = (sms: SMS) => {
        setDeleteModal({ isOpen: true, sms });
    };

    // Handle delete action
    const handleDelete = async () => {
        if (!deleteModal.sms) return;

        try {
            await deleteSMS({
                clientId,
                id: deleteModal.sms.id
            }).unwrap();

            toast.success('SMS configuration deleted successfully');
            setDeleteModal({ isOpen: false, sms: null });
            refetch();
        } catch (error) {
            console.log(error)
            toast.error('Failed to delete SMS configuration');
        }
    };

    // Test SMS configuration
    const handleTestSMS = async (sms: SMS) => {
        try {
            const testData = {
                phoneNumber: client.mobileNo || "+8801234567890",
                customMessage: sms.message || "This is a test message from SMS configuration system."
            };

            await testSMS({
                clientId,
                id: sms.id,
                ...testData
            }).unwrap();

            toast.success('Test SMS sent successfully');
        } catch (error) {
            console.log(error);
            toast.error('Failed to send test SMS');
        }
    };

    // Toggle SMS status
    const handleToggleStatus = async (sms: SMS) => {
        try {
            await toggleSMSStatus({
                clientId,
                id: sms.id
            }).unwrap();

            toast.success(`SMS configuration ${!sms.status ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.log(error);
            toast.error('Failed to update status');
        }
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Get status badge
    const getStatusBadge = (status: boolean) => {
        if (status) {
            return (
                <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 transition-colors duration-300 ${
                    theme === 'dark' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-green-100 text-green-700'
                }`}>
                    <CheckCircle size={10} />
                    Active
                </span>
            );
        } else {
            return (
                <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 transition-colors duration-300 ${
                    theme === 'dark' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-red-100 text-red-700'
                }`}>
                    <XCircle size={10} />
                    Inactive
                </span>
            );
        }
    };

    // Get type badge
    const getTypeBadge = (type: string) => {
        const badgeColors: { [key: string]: { light: string, dark: string } } = {
            unicode: {
                light: "bg-blue-100 text-blue-700",
                dark: "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            },
            text: {
                light: "bg-purple-100 text-purple-700",
                dark: "bg-purple-500/20 text-purple-400 border border-purple-500/30"
            },
            flash: {
                light: "bg-yellow-100 text-yellow-700",
                dark: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
            },
        };

        const badgeIcons: { [key: string]: string } = {
            unicode: "🌐",
            text: "📝",
            flash: "⚡",
        };

        const colors = badgeColors[type] || {
            light: 'bg-gray-100 text-gray-700',
            dark: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        };

        return (
            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 transition-colors duration-300 ${
                theme === 'dark' ? colors.dark : colors.light
            }`}>
                {badgeIcons[type] || '❓'}
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
        );
    };

    
    // Mask API key for display
    // const maskAPIKey = (apiKey: string) => {
    //     if (!apiKey) return '';
    //     if (apiKey.length <= 8) {
    //         return '•'.repeat(apiKey.length);
    //     }
    //     const firstFour = apiKey.substring(0, 4);
    //     const lastFour = apiKey.substring(apiKey.length - 4);
    //     return `${firstFour}${'•'.repeat(6)}${lastFour}`;
    // };

    // Truncate text
    const truncateText = (text: string, maxLength: number = 30) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Add serial numbers to data
    const addSerialNumbers = (data: SMS[]) => {
        return data.map((item, index) => ({
            ...item,
            slNo: ((currentPage - 1) * itemsPerPage) + index + 1,
        }));
    };

    if (isError) {
        return (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Failed to load SMS configurations</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => refetch()}
                    className={`mt-4 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto ${
                        theme === 'dark' 
                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    <RefreshCw size={16} />
                    Retry
                </motion.button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl p-6 shadow-lg transition-colors duration-300 ${
                        theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    } border`}
                >
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        <TrendingUp size={20} />
                        SMS Configuration Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { icon: MessageSquare, color: "blue", label: "Total SMS", value: stats.totalSMS },
                            { icon: CheckCircle, color: "green", label: "Active", value: stats.activeSMS },
                            { icon: XCircle, color: "red", label: "Inactive", value: stats.inactiveSMS },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-4 rounded-lg text-center border transition-colors duration-300 ${
                                    theme === 'dark' 
                                    ? 'bg-gray-900/50 border-gray-700' 
                                    : 'bg-gray-50 border-gray-100'
                                }`}
                            >
                                <stat.icon className={`h-8 w-8 text-${stat.color}-500 mx-auto mb-2`} />
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</p>
                                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {stat.value}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className={`rounded-xl p-6 shadow-lg transition-colors duration-300 ${
                    theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } border`}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        <Filter size={20} />
                        Filters
                    </h3>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setSmsToEdit(null);
                            setIsAddSMSModalOpen(true);
                        }}
                        className={`px-4 py-2 hover:cursor-pointer rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                            theme === 'dark' 
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        <Plus size={18} />
                        Add SMS Configuration
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                placeholder="Search configurations..."
                                className={`w-full pl-10 pr-3 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                    theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                } border`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                            } border`}
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Message Type
                        </label>
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange("type", e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                            } border`}
                        >
                            <option value="">All Types</option>
                            <option value="unicode">Unicode</option>
                            <option value="text">Text</option>
                            <option value="flash">Flash</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearFilters}
                            className={`w-full px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                                theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <X size={16} />
                            Clear Filters
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* SMS Configurations Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${
                    theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } border`}
            >
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader className="h-8 w-8 text-blue-500 animate-spin" />
                        <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading SMS configurations...
                        </span>
                    </div>
                ) : smsConfigs.length === 0 ? (
                    <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>No SMS configurations found</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setSmsToEdit(null);
                                setIsAddSMSModalOpen(true);
                            }}
                            className={`mt-4 px-4 py-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${
                                theme === 'dark' 
                                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            Create First Configuration
                        </motion.button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y transition-colors duration-300">
                                <thead className={theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}>
                                    <tr>
                                        {['#', 'App Name', 'Sender ID', 'Type', 'Status', 'Created', 'Actions'].map((header, index) => (
                                            <th
                                                key={index}
                                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                                }`}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className={`divide-y transition-colors duration-300 ${
                                    theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
                                }`}>
                                    {addSerialNumbers(smsConfigs).map((sms, index) => (
                                        <motion.tr
                                            key={sms.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`transition-colors duration-300 ${
                                                theme === 'dark' 
                                                ? 'hover:bg-gray-700/50' 
                                                : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                                            }`}>
                                                {sms.slNo}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className={`text-sm font-medium transition-colors duration-300 ${
                                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                        {sms.appName}
                                                    </div>
                                                    <div className={`text-xs mt-1 transition-colors duration-300 ${
                                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                        {truncateText(sms.message, 40)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <Hash size={12} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                    <span className={`text-sm transition-colors duration-300 ${
                                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                        {sms.senderId}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {getTypeBadge(sms.type)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(sms.status)}
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleToggleStatus(sms)}
                                                        className={theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
                                                        title={sms.status ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {sms.status ? (
                                                            <ToggleRight size={20} className={theme === 'dark' ? 'text-green-400' : 'text-green-500'} />
                                                        ) : (
                                                            <ToggleLeft size={20} />
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                {formatDate(sms.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    {[
                                                        { icon: Eye, color: 'blue', action: () => handleView(sms), title: 'View Details' },
                                                        { icon: Edit, color: 'green', action: () => handleEdit(sms), title: 'Edit' },
                                                        { icon: Send, color: 'purple', action: () => handleTestSMS(sms), title: 'Test SMS' },
                                                        { icon: Trash2, color: 'red', action: () => handleDeleteClick(sms), title: 'Delete' },
                                                    ].map((btn, idx) => (
                                                        <motion.button
                                                            key={idx}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={btn.action}
                                                            className={`p-1.5 rounded transition-colors duration-300 ${
                                                                theme === 'dark'
                                                                ? `text-${btn.color}-400 hover:text-${btn.color}-300 hover:bg-${btn.color}-500/10`
                                                                : `text-${btn.color}-600 hover:text-${btn.color}-800 hover:bg-${btn.color}-50`
                                                            }`}
                                                            title={btn.title}
                                                        >
                                                            <btn.icon size={16} />
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className={`px-6 py-4 border-t transition-colors duration-300 ${
                                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className={`text-sm transition-colors duration-300 ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                                    }`}>
                                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                                        <span className="font-medium">
                                            {Math.min(currentPage * itemsPerPage, pagination.totalItems)}
                                        </span>{" "}
                                        of <span className="font-medium">{pagination.totalItems}</span> results
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1.5 text-sm rounded transition-colors duration-300 ${
                                                theme === 'dark'
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                                            } disabled:cursor-not-allowed`}
                                        >
                                            Previous
                                        </motion.button>
                                        <span className={`text-sm transition-colors duration-300 ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Page {currentPage} of {pagination.totalPages}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                            disabled={currentPage === pagination.totalPages}
                                            className={`px-3 py-1.5 text-sm rounded transition-colors duration-300 ${
                                                theme === 'dark'
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                                            } disabled:cursor-not-allowed`}
                                        >
                                            Next
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Add/Edit SMS Modal */}
            <AnimatePresence>
                {isAddSMSModalOpen && (
                    <AddEditSMSModal
                        clientId={clientId}
                        smsData={smsToEdit}
                        isOpen={isAddSMSModalOpen}
                        onClose={(refreshData) => {
                            setIsAddSMSModalOpen(false);
                            setSmsToEdit(null);
                            if (refreshData) {
                                refetch();
                            }
                        }}
                    />
                )}
            </AnimatePresence>

            {/* SMS Details Modal */}
            <AnimatePresence>
                {viewModal.isOpen && (
                    <SMSDetailsModal
                        isOpen={viewModal.isOpen}
                        sms={viewModal.sms}
                        client={client}
                        onClose={() => setViewModal({ isOpen: false, sms: null })}
                        onEdit={handleEdit}
                        onTestSMS={handleTestSMS}
                        onToggleStatus={handleToggleStatus}
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
                        className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`rounded-xl p-6 w-full max-w-md shadow-2xl ${
                                theme === 'dark' 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-200'
                            } border`}
                        >
                            <div className="text-center">
                                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                                    theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
                                }`}>
                                    <Trash2 className="h-8 w-8 text-red-500" />
                                </div>

                                <h3 className={`text-xl font-semibold mb-2 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    Confirm Delete
                                </h3>

                                <p className={`mb-6 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    Are you sure you want to delete the SMS configuration for{" "}
                                    <span className={`font-semibold ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {deleteModal.sms?.appName}
                                    </span>? This action cannot be undone.
                                </p>

                                <div className="flex gap-3 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setDeleteModal({ isOpen: false, sms: null })}
                                        className={`flex-1 py-3 px-4 rounded-lg transition-colors duration-300 ${
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
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors duration-300"
                                    >
                                        Yes, Delete
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

export default UserSMSConfiguration;