// components/admin/SMSHistory.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Phone,
    MessageSquare,
    AlertCircle,
    Settings,
    FileText,
    Copy,
    Smartphone,
    User,
    Hash,
    X,
    Check,
    Users,
    Mail,
    Zap,
    Crown,
    Sparkles,
    Target,
    Briefcase,
    ArrowRight,
    Loader
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useThemeContext';
import { SMSHistoryFilters, SMSHistory, Client } from '@/utils/interface/smsHistoryInterface';
import { useGetSMSHistoryQuery } from '@/redux/api/sms-configurations/smsApi';
import { useGetAllClientsQuery } from '@/redux/api/authentication/authApi';
import { getUserInfo } from '@/utils/helper/userFromToken';
import { useRouter } from 'next/navigation';

const SMSHistoryComponent: React.FC = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const [filters, setFilters] = useState<SMSHistoryFilters>({
        page: 1,
        limit: 20,
        clientId: '',
        configId: '',
        phoneNumber: '',
        messageType: undefined,
        status: undefined,
        deliveryStatus: undefined,
        startDate: '',
        endDate: '',
        search: '',
        sortBy: 'sentAt',
        sortOrder: 'DESC'
    });

    const [showFilters, setShowFilters] = useState(true);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // Client selection modal state
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [clientSearchTerm, setClientSearchTerm] = useState('');
    const [hoveredClientId, setHoveredClientId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getUserInfo();
            setUser(userInfo);
            if (userInfo.role === 'client') {
                handleFilterChange('clientId', userInfo.id);
            } else {
                handleFilterChange('clientId', '');
                setClientSearchTerm('');
            }
        };
        fetchUser();
    }, [router]);

    // Fetch clients for the select dropdown
    const {
        data: clientsData,
        isLoading: clientsLoading
    } = useGetAllClientsQuery({
        page: 1,
        limit: 100,
        search: clientSearchTerm,
        role: 'client'
    });

    // Use the query hook
    const {
        data: historyData,
        isLoading,
        isError,
        refetch,
        isFetching
    } = useGetSMSHistoryQuery(filters, {
        refetchOnMountOrArgChange: true,
    });

    const history = historyData?.data?.history || [];
    const pagination = historyData?.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPreviousPage: false
    };

    // Get all clients
    const clients = clientsData?.data || [];

    // Get selected client
    const selectedClient = clients.find((client: Client) => client.id === Number(filters.clientId));

    // Handle filter changes
    const handleFilterChange = (key: keyof SMSHistoryFilters, value: unknown) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page on filter change
        }));
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    // Toggle row expansion
    const toggleRowExpansion = (id: number) => {
        setExpandedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            page: 1,
            limit: 20,
            clientId: '',
            configId: '',
            phoneNumber: '',
            messageType: undefined,
            status: undefined,
            deliveryStatus: undefined,
            startDate: '',
            endDate: '',
            search: '',
            sortBy: 'sentAt',
            sortOrder: 'DESC'
        });
        setSelectedRows([]);
        setExpandedRows([]);
        setClientSearchTerm('');
    };

    // Select client
    const selectClient = (clientId: number) => {
        handleFilterChange('clientId', clientId);
        setIsClientModalOpen(false);
        setClientSearchTerm('');
    };

    // Clear client filter
    const clearClientFilter = () => {
        handleFilterChange('clientId', '');
        setClientSearchTerm('');
    };

    // Open client selection modal
    const openClientModal = () => {
        setIsClientModalOpen(true);
        setClientSearchTerm('');
    };

    // Copy message to clipboard
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Format time ago
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent':
                return theme === 'dark'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivered':
                return theme === 'dark'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-green-100 text-green-700 border-green-200';
            case 'failed':
                return theme === 'dark'
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-red-100 text-red-700 border-red-200';
            case 'pending':
                return theme === 'dark'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default:
                return theme === 'dark'
                    ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    : 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Get message type color
    const getMessageTypeColor = (type: string) => {
        return type === 'custom'
            ? theme === 'dark'
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                : 'bg-purple-100 text-purple-700 border-purple-200'
            : theme === 'dark'
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                : 'bg-indigo-100 text-indigo-700 border-indigo-200';
    };

    // Get random gradient for client card
    const getClientGradient = (id: number) => {
        const gradients = [
            'from-blue-500 to-cyan-500',
            'from-purple-500 to-pink-500',
            'from-green-500 to-emerald-500',
            'from-orange-500 to-red-500',
            'from-indigo-500 to-blue-500',
            'from-yellow-500 to-amber-500',
            'from-pink-500 to-rose-500',
            'from-teal-500 to-cyan-500',
        ];
        return gradients[id % gradients.length];
    };

    // Loading state
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-[600px] flex items-center justify-center"
            >
                <div className="text-center">
                    <div className="relative inline-block">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-blue-500/30 rounded-full"
                        />
                        <Settings className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className={`mt-4 text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Loading SMS History...
                    </p>
                </div>
            </motion.div>
        );
    }

    // Error state
    if (isError) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-[600px] flex items-center justify-center"
            >
                <div className={`text-center p-8 rounded-2xl max-w-md ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Failed to Load History
                    </h3>
                    <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Unable to load SMS history. Please check your connection and try again.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => refetch()}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 mx-auto ${theme === 'dark'
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        <RefreshCw size={18} />
                        Retry
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6 py-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                            <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                SMS History
                            </h1>
                            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Track and analyze all SMS messages sent through the system
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 hover:cursor-pointer py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                            }`}
                    >
                        <Filter size={18} />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                        {Object.values(filters).filter(v => v && v !== '' && v !== 1 && v !== 20 && v !== 'sentAt' && v !== 'DESC').length > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                                {Object.values(filters).filter(v => v && v !== '' && v !== 1 && v !== 20 && v !== 'sentAt' && v !== 'DESC').length}
                            </span>
                        )}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className={`px-4 py-2.5 hover:cursor-pointer rounded-xl transition-all duration-300 flex items-center gap-2 ${theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 disabled:opacity-50'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm disabled:opacity-50'
                            }`}
                    >
                        <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
                        Refresh
                    </motion.button>
                </div>
            </motion.div>

            {/* Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`overflow-hidden rounded-2xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'}`}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Filter SMS History
                                </h3>
                                <button
                                    onClick={clearFilters}
                                    className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${theme === 'dark'
                                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Phone Number */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Search Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={filters.phoneNumber || ''}
                                        onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
                                        placeholder="Enter phone number..."
                                        className={`w-full px-4 py-2.5 rounded-lg border ${theme === 'dark'
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                    />
                                </div>

                                {/* Search */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Search Message
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            value={filters.search || ''}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                            placeholder="Search messages or phone numbers..."
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${theme === 'dark'
                                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                        />
                                    </div>
                                </div>

                                {/* Client Selection - Click to Open Modal */}
                                {
                                    user?.role === 'client' ? '' : <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Select Client
                                        </label>
                                        <div
                                            onClick={openClientModal}
                                            className={`w-full px-4 py-2.5 rounded-lg border flex items-center justify-between cursor-pointer group transition-all duration-300 ${theme === 'dark'
                                                ? 'bg-gray-800 border-gray-700 text-white hover:border-blue-500 hover:bg-gray-700/50'
                                                : 'bg-white border-gray-300 text-gray-900 hover:border-blue-500 hover:bg-blue-50/50'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                {selectedClient ? (
                                                    <>
                                                        <div className={`p-1 rounded-full ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                                            <User className="w-4 h-4 flex-shrink-0 text-blue-500" />
                                                        </div>
                                                        <span className="truncate font-medium">{selectedClient.fullName}</span>
                                                        <span className="text-xs text-gray-400">({selectedClient.mobileNo})</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Users className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                                        <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                                                            Click to select client...
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {filters.clientId && selectedClient && (
                                                    <X
                                                        size={16}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearClientFilter();
                                                        }}
                                                    />
                                                )}
                                                <ChevronRight size={16} className={`text-gray-400 group-hover:text-blue-500 transition-all group-hover:translate-x-1`} />
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* Message Type */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Message Type
                                    </label>
                                    <select
                                        value={filters.messageType || ''}
                                        onChange={(e) => handleFilterChange('messageType', e.target.value || undefined)}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${theme === 'dark'
                                            ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                    >
                                        <option value="">All Types</option>
                                        <option value="custom">Custom Message</option>
                                        <option value="config">Config Message</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Status
                                    </label>
                                    <select
                                        value={filters.status || ''}
                                        onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${theme === 'dark'
                                            ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                    >
                                        <option value="">All Status</option>
                                        <option value="sent">Sent</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="failed">Failed</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>

                                {/* Date Range */}
                                <div className="md:col-span-2 lg:col-span-2">
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Date Range
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <input
                                                type="date"
                                                value={filters.startDate || ''}
                                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                                className={`w-full px-4 py-2.5 rounded-lg border ${theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="date"
                                                value={filters.endDate || ''}
                                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                                className={`w-full px-4 py-2.5 rounded-lg border ${theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-white'}`}
            >
                {/* Table Header */}
                <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                SMS Messages
                            </h3>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Showing {history.length} of {pagination.totalItems} messages
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <select
                                    value={filters.limit}
                                    onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                                    className={`px-3 py-1.5 rounded-lg border ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-300 text-gray-700'
                                        } text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                >
                                    <option value="10">10 per page</option>
                                    <option value="20">20 per page</option>
                                    <option value="50">50 per page</option>
                                    <option value="100">100 per page</option>
                                    <option value="500">500 per page</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                <th className="py-4 px-6 text-left">
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Phone Number
                                    </span>
                                </th>
                                <th className="py-4 px-6 text-left">
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Message
                                    </span>
                                </th>
                                <th className="py-4 px-6 text-left">
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Status
                                    </span>
                                </th>
                                <th className="py-4 px-6 text-left">
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Sent
                                    </span>
                                </th>
                                <th className="py-4 px-6 text-left">
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Date & Time
                                    </span>
                                </th>
                                <th className="py-4 px-6 text-left">
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Actions
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 px-6 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <MessageSquare className={`w-16 h-16 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'} mb-4`} />
                                            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                No SMS History Found
                                            </h3>
                                            <p className={`max-w-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {Object.values(filters).some(v => v && v !== '' && v !== 1 && v !== 20 && v !== 'sentAt' && v !== 'DESC')
                                                    ? 'Try adjusting your filters to see more results.'
                                                    : 'No SMS messages have been sent yet.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                history.map((item: SMSHistory, index: number) => (
                                    <React.Fragment key={item.id}>
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => toggleRowExpansion(item.id)}
                                            transition={{ delay: index * 0.05 }}
                                            className={`border-b hover:cursor-pointer ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800/30' : 'border-gray-200 hover:bg-gray-50'} ${selectedRows.includes(item.id) ? (theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50') : ''}`}
                                        >
                                            {/* Phone Number */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                        <Phone className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {item.phoneNumber}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {item.clientDetails ? (
                                                                <>Client: <span className="font-medium">{item.clientDetails.fullName}</span></>
                                                            ) : (
                                                                <>Client ID: {item.clientId}</>
                                                            )}
                                                            {' • '}
                                                            {item.configDetails ? (
                                                                <>Sender ID: <span className="font-medium">{item.configDetails.senderId}</span></>
                                                            ) : (
                                                                <>Config ID: {item.configId}</>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Message Preview */}
                                            <td className="py-4 px-6">
                                                <div className="max-w-xs">
                                                    <div className="font-medium text-gray-900 dark:text-white line-clamp-2">
                                                        {item.message.length > 100
                                                            ? `${item.message.substring(0, 100)}...`
                                                            : item.message}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${getMessageTypeColor(item.messageType)}`}>
                                                            {item.messageType === 'custom' ? 'Custom' : 'Config'}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {item.characterCount} chars
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-2">
                                                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Time Ago */}
                                            <td className="py-4 px-6">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatTimeAgo(item.sentAt)}
                                                </div>
                                            </td>

                                            {/* Date & Time */}
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {new Date(item.sentAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyToClipboard(item.message, 'Message');
                                                        }}
                                                        className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                                            ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                                                            }`}
                                                        title="Copy message"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyToClipboard(item.phoneNumber, 'Phone number');
                                                        }}
                                                        className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                                            ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                                                            }`}
                                                        title="Copy phone number"
                                                    >
                                                        <Smartphone className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>

                                        {/* Expanded Row Details */}
                                        <AnimatePresence>
                                            {expandedRows.includes(item.id) && (
                                                <motion.tr
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className={`${theme === 'dark' ? 'bg-gray-900/30' : 'bg-gray-50/50'}`}
                                                >
                                                    <td colSpan={6} className="px-6 py-4">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                            {/* Message Details */}
                                                            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                    Message Details
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                            Full Message
                                                                        </label>
                                                                        <div className={`mt-1 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                                                                                {item.message}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                Character Count
                                                                            </label>
                                                                            <p className={`mt-1 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                                {item.characterCount}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                SMS Segments
                                                                            </label>
                                                                            <p className={`mt-1 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                                {item.smsCount}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Client & Config Details */}
                                                            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                    Client & Configuration
                                                                </h4>
                                                                <div className="space-y-4">
                                                                    {/* Client Details */}
                                                                    {item.clientDetails ? (
                                                                        <div>
                                                                            <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                Client Information
                                                                            </label>
                                                                            <div className={`mt-1 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                                    {item.clientDetails.fullName}
                                                                                </p>
                                                                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                    {item.clientDetails.mobileNo} • {item.clientDetails.email}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                Client ID
                                                                            </label>
                                                                            <p className={`mt-1 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                                {item.clientId}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {/* Config Details */}
                                                                    {item.configDetails ? (
                                                                        <div>
                                                                            <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                SMS Configuration
                                                                            </label>
                                                                            <div className={`mt-1 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Hash className="w-4 h-4 text-gray-500" />
                                                                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                                        {item.configDetails.appName}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                                                                                        Sender ID: {item.configDetails.senderId}
                                                                                    </span>
                                                                                    <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                                                                                        Type: {item.configDetails.type}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                Config ID
                                                                            </label>
                                                                            <p className={`mt-1 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                                {item.configId}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Gateway Response */}
                                                            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} lg:col-span-2`}>
                                                                <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                    Gateway Response
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                            Response
                                                                        </label>
                                                                        <div className={`mt-1 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} break-all`}>
                                                                                {item.gatewayResponse || 'No response recorded'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                Message ID
                                                                            </label>
                                                                            <p className={`mt-1 font-medium text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                                {item.gatewayMessageId || 'Not available'}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                Sent At
                                                                            </label>
                                                                            <p className={`mt-1 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                                {formatDate(item.sentAt)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                                {pagination.totalItems} entries
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPreviousPage}
                                    className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-300 shadow-sm'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </motion.button>

                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (pagination.currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i;
                                    } else {
                                        pageNum = pagination.currentPage - 2 + i;
                                    }

                                    return (
                                        <motion.button
                                            key={pageNum}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 rounded-lg transition-all duration-300 ${pagination.currentPage === pageNum
                                                ? theme === 'dark'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-blue-500 text-white'
                                                : theme === 'dark'
                                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'
                                                }`}
                                        >
                                            {pageNum}
                                        </motion.button>
                                    );
                                })}

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-300 shadow-sm'
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Professional Client Selection Modal */}
            <AnimatePresence>
                {isClientModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-xl bg-black/60 flex items-center justify-center z-[100] p-4"
                        onClick={() => setIsClientModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl ${theme === 'dark'
                                ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800'
                                : 'bg-gradient-to-br from-white via-white to-gray-50'
                                } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Animated Background Effects */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
                            </div>

                            {/* Header */}
                            <div className="relative px-8 pt-8 pb-6 border-b border-gray-200/20 dark:border-gray-700/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`relative p-4 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-30"></div>
                                            <Users className="relative z-10 w-8 h-8 text-blue-500" />
                                        </div>
                                        <div>
                                            <motion.h2
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                            >
                                                Select Client
                                            </motion.h2>
                                            <motion.p
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                                            >
                                                Choose a client to filter SMS history
                                            </motion.p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* View Mode Toggle */}
                                        <div className={`flex items-center p-1 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setViewMode('grid')}
                                                className={`p-2 hover:cursor-pointer rounded-lg transition-all duration-300 ${viewMode === 'grid'
                                                    ? theme === 'dark'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-blue-500 text-white'
                                                    : theme === 'dark'
                                                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                                                    }`}
                                            >
                                                <Zap className="w-5 h-5" />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setViewMode('list')}
                                                className={`p-2 hover:cursor-pointer rounded-lg transition-all duration-300 ${viewMode === 'list'
                                                    ? theme === 'dark'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-blue-500 text-white'
                                                    : theme === 'dark'
                                                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                                                    }`}
                                            >
                                                <Briefcase className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsClientModalOpen(false)}
                                            className={`p-2 hover:cursor-pointer rounded-xl transition-all duration-300 ${theme === 'dark'
                                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                                                }`}
                                        >
                                            <X className="w-6 h-6" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-6"
                                >
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                                        <div className={`relative flex items-center rounded-2xl border-2 ${theme === 'dark'
                                            ? 'bg-gray-800/50 border-gray-700 focus-within:border-blue-500'
                                            : 'bg-white/50 border-gray-200 focus-within:border-blue-500'
                                            } backdrop-blur-sm transition-all duration-300`}>
                                            <Search className="absolute left-5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={clientSearchTerm}
                                                onChange={(e) => setClientSearchTerm(e.target.value)}
                                                placeholder="Search clients by name, phone, or email..."
                                                className={`w-full pl-12 pr-5 py-4 bg-transparent rounded-2xl ${theme === 'dark'
                                                    ? 'text-white placeholder-gray-500'
                                                    : 'text-gray-900 placeholder-gray-400'
                                                    } focus:outline-none text-lg`}
                                                autoFocus
                                            />
                                            {clientSearchTerm && (
                                                <motion.button
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setClientSearchTerm('')}
                                                    className="absolute right-5 p-1 rounded-full hover:bg-gray-200/20 transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-gray-400" />
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div className="relative px-8 py-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                                {clientsLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl animate-pulse"></div>
                                            <Loader className="w-16 h-16 text-blue-500 animate-spin" />
                                        </div>
                                        <p className={`mt-6 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Loading clients...
                                        </p>
                                    </div>
                                ) : clients.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col items-center justify-center py-20"
                                    >
                                        <div className={`relative p-6 rounded-3xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'} backdrop-blur-sm`}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20"></div>
                                            <Users className="w-20 h-20 text-gray-400" />
                                        </div>
                                        <h3 className={`mt-6 text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            No Clients Found
                                        </h3>
                                        <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {clientSearchTerm ? 'Try adjusting your search terms' : 'No clients are available at the moment'}
                                        </p>
                                        {clientSearchTerm && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setClientSearchTerm('')}
                                                className={`mt-6 px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${theme === 'dark'
                                                    ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                                                    }`}
                                            >
                                                <X className="w-5 h-5" />
                                                Clear Search
                                            </motion.button>
                                        )}
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* Results Count */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Found <span className="text-blue-500 font-bold">{clients.length}</span> clients
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-gray-400" />
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    {selectedClient ? '1 selected' : `${clients.length} available`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Grid View */}
                                        {viewMode === 'grid' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                {clients.map((client: Client, index: number) => (
                                                    <motion.div
                                                        key={client.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        whileHover={{ y: -5, scale: 1.02 }}
                                                        onHoverStart={() => setHoveredClientId(client.id)}
                                                        onHoverEnd={() => setHoveredClientId(null)}
                                                        onClick={() => selectClient(client.id)}
                                                        className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 ${Number(filters.clientId) === client.id
                                                            ? 'ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20'
                                                            : hoveredClientId === client.id
                                                                ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/20'
                                                                : 'hover:shadow-xl'
                                                            }`}
                                                    >
                                                        {/* Gradient Background */}
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${getClientGradient(client.id)} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>

                                                        {/* Selected Indicator */}
                                                        {Number(filters.clientId) === client.id && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="absolute top-4 right-4 z-20"
                                                            >
                                                                <div className="relative">
                                                                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-md"></div>
                                                                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 rounded-full">
                                                                        <Check className="w-4 h-4 text-white" />
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}

                                                        {/* Content */}
                                                        <div className="relative p-6">
                                                            {/* Avatar */}
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="relative">
                                                                    <div className={`absolute inset-0 bg-gradient-to-r ${getClientGradient(client.id)} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                                                                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${getClientGradient(client.id)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                                                        <span className="text-2xl font-bold text-white">
                                                                            {client.fullName.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col items-end">
                                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${theme === 'dark'
                                                                        ? 'bg-gray-800 text-gray-300 border border-gray-700'
                                                                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                                        }`}>
                                                                        ID: {client.id}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Info */}
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} line-clamp-1`}>
                                                                        {client.fullName}
                                                                    </h3>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <div className={`h-2 w-2 rounded-full ${client.status === 'active' ? 'bg-green-500' : client.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                                                        <span className={`text-xs capitalize ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                                                                            {client.status || 'active'}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                                            <Phone className="w-3.5 h-3.5 text-gray-500" />
                                                                        </div>
                                                                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                            {client.mobileNo}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                                            <Mail className="w-3.5 h-3.5 text-gray-500" />
                                                                        </div>
                                                                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                                                                            {client.email}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Hover Effect Button */}
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: hoveredClientId === client.id ? 1 : 0, y: hoveredClientId === client.id ? 0 : 10 }}
                                                                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent"
                                                            >
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <span className="text-sm font-medium text-white">Select Client</span>
                                                                    <ArrowRight className="w-4 h-4 text-white" />
                                                                </div>
                                                            </motion.div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            /* List View */
                                            <div className="space-y-3">
                                                {clients.map((client: Client, index: number) => (
                                                    <motion.div
                                                        key={client.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        whileHover={{ scale: 1.01, x: 5 }}
                                                        onClick={() => selectClient(client.id)}
                                                        className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${Number(filters.clientId) === client.id
                                                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 ring-2 ring-blue-500'
                                                            : theme === 'dark'
                                                                ? 'hover:bg-gray-800/50'
                                                                : 'hover:bg-gray-100/50'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-6 p-4">
                                                            {/* Avatar */}
                                                            <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${getClientGradient(client.id)} flex items-center justify-center shadow-lg`}>
                                                                <span className="text-xl font-bold text-white">
                                                                    {client.fullName.charAt(0).toUpperCase()}
                                                                </span>
                                                                {Number(filters.clientId) === client.id && (
                                                                    <div className="absolute -top-1 -right-1">
                                                                        <div className="relative">
                                                                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm"></div>
                                                                            <div className="relative bg-blue-500 p-1 rounded-full">
                                                                                <Check className="w-3 h-3 text-white" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Info */}
                                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                <div>
                                                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                        Name
                                                                    </p>
                                                                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                        {client.fullName}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                        Phone
                                                                    </p>
                                                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                        {client.mobileNo}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                        Email
                                                                    </p>
                                                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                                                                        {client.email}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                        Status
                                                                    </p>
                                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${client.status === 'active'
                                                                        ? 'bg-green-500/20 text-green-400'
                                                                        : client.status === 'pending'
                                                                            ? 'bg-yellow-500/20 text-yellow-400'
                                                                            : 'bg-red-500/20 text-red-400'
                                                                        }`}>
                                                                        {client.status || 'active'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Select Indicator */}
                                                            <div className="flex items-center gap-2">
                                                                {Number(filters.clientId) !== client.id && (
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'dark'
                                                                            ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                                                            : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                                                                            }`}
                                                                    >
                                                                        <ArrowRight className="w-5 h-5" />
                                                                    </motion.button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className={`relative px-8 py-6 border-t ${theme === 'dark' ? 'border-gray-700/50 bg-gray-900/50' : 'border-gray-200/50 bg-white/50'} backdrop-blur-sm`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <Crown className="w-4 h-4 text-yellow-500" />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {clients.length} Total Clients
                                            </span>
                                        </div>
                                        {selectedClient && (
                                            <div className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500" />
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Currently selected: <span className="font-semibold text-blue-500">{selectedClient.fullName}</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsClientModalOpen(false)}
                                        className={`px-6 hover:cursor-pointer py-2.5 rounded-xl font-medium transition-all duration-300 ${theme === 'dark'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/20'
                                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
                                            }`}
                                    >
                                        Close
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

export default SMSHistoryComponent;