// src/app/admin/clients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    motion,
    AnimatePresence,
    LayoutGroup
} from 'framer-motion';
import {
    Search,
    Filter,
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    AlertCircle,
    CheckCircle,
    XCircle,
    RefreshCw,
    Trash2,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Users,
    Key,
    Crown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDeleteClientMutation, useGetAllClientsQuery, useUpdateClientStatusMutation } from '@/redux/api/authentication/authApi';
import { useTheme } from '@/hooks/useThemeContext';
import ClientCard, { Client } from './ClientCard';

// Role options for filtering
const ROLE_OPTIONS = [
    { value: '', label: 'All Roles', icon: Users },
    { value: 'client', label: 'Client', icon: Users },
    { value: 'admin', label: 'Admin', icon: Key },
];

// Status options for filtering
const STATUS_OPTIONS = [
    { value: '', label: 'All Status', icon: Users },
    { value: 'active', label: 'Active', icon: CheckCircle },
    { value: 'pending', label: 'Pending', icon: AlertCircle },
    { value: 'inactive', label: 'Inactive', icon: XCircle }
];

//! Main Content Component
export default function ClientsContent() {
    const { theme } = useTheme();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<string>(''); // Default to 'client'
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Use Redux RTK Query hooks
    const {
        data: clientsData,
        isLoading,
        isError,
        refetch
    } = useGetAllClientsQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
        role: roleFilter // Use the role filter here
    });

    const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
    const [updateClientStatus] = useUpdateClientStatusMutation();

    // Extract data from API response
    const clients = clientsData?.data || [];
    const pagination = clientsData?.pagination || {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10
    };

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1); // Reset to first page on search
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, roleFilter]);

    // Handle actions
    const handleViewClient = (client: Client) => {
        setSelectedClient(client);
        setShowClientModal(true);
    };

    const handleEditClient = (client: Client) => {
        toast.success(`Editing ${client.fullName}`);
        // Implement edit functionality
    };

    const handleDeleteClient = (client: Client) => {
        setClientToDelete(client);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!clientToDelete) return;

        try {
            await deleteClient(clientToDelete.id).unwrap();
            toast.success(`${clientToDelete.fullName} deleted successfully`);
            await refetch()
            setShowDeleteModal(false);
            setClientToDelete(null);
        } catch (err) {
            console.error('Error deleting client:', err);
            toast.error(err?.data?.message || 'Failed to delete client');
        }
    };

    const handleStatusChange = async (client: Client, status: 'active' | 'pending' | 'inactive') => {
        try {
            await updateClientStatus({ id: client.id, status }).unwrap();
            toast.success(`Client status updated to ${status}`);
            await refetch();
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error(err?.data?.message || 'Failed to update status');
        }
    };

    // Calculate stats based on current filters
    const calculateStats = () => {
        const filteredClients = clientsData?.data || [];
        const allClients = clientsData?.allClients || filteredClients;
        
        return {
            total: allClients.length,
            active: allClients.filter((c: Client) => c.status === 'active').length,
            pending: allClients.filter((c: Client) => c.status === 'pending').length,
            inactive: allClients.filter((c: Client) => c.status === 'inactive').length,
            client: allClients.filter((c: Client) => c.role === 'client').length,
            admin: allClients.filter((c: Client) => c.role === 'admin').length,
            manager: allClients.filter((c: Client) => c.role === 'manager').length,
            staff: allClients.filter((c: Client) => c.role === 'staff').length,
            super_admin: allClients.filter((c: Client) => c.role === 'super_admin').length,
        };
    };

    const stats = calculateStats();

    const statsColors = [
        { label: 'Total Users', value: stats.total, color: 'from-blue-500 to-cyan-500', icon: Users },
        { label: 'Active', value: stats.active, color: 'from-emerald-500 to-green-500', icon: CheckCircle },
        { label: 'Pending', value: stats.pending, color: 'from-amber-500 to-yellow-500', icon: AlertCircle },
        { label: 'Inactive', value: stats.inactive, color: 'from-rose-500 to-pink-500', icon: XCircle }
    ];

    const roleStats = [
        { label: 'Clients', value: stats.client, color: 'from-blue-500 to-blue-600', icon: Users },
        { label: 'Admins', value: stats.admin, color: 'from-purple-500 to-purple-600', icon: Key },
        { label: 'Super Admin', value: stats.super_admin, color: 'from-red-500 to-red-600', icon: Crown }
    ];

    // Pagination controls
    const PaginationControls = () => (
        <div className="flex items-center justify-between mt-6">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} users
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setCurrentPage(1)}
                    disabled={pagination.currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                        } disabled:opacity-30`}
                >
                    <ChevronsLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setCurrentPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                        } disabled:opacity-30`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-1">
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
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-1 rounded-lg transition-colors ${pagination.currentPage === pageNum
                                    ? 'bg-blue-500 text-white'
                                    : theme === 'dark'
                                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setCurrentPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                        } disabled:opacity-30`}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setCurrentPage(pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                        } disabled:opacity-30`}
                >
                    <ChevronsRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen ${theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
            } p-6`}>

            {/* Header */}
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            User Management
                        </h1>
                        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage and monitor all user accounts in your system
                        </p>
                    </div>
                </motion.div>

                {/* Main Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8"
                >
                    {statsColors.map((stat, index) => (
                        <div
                            key={index}
                            className={`${theme === 'dark'
                                ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800 hover:border-gray-700'
                                : 'bg-white/50 border-gray-200 hover:border-gray-300'
                                } backdrop-blur-sm border rounded-2xl p-6 transition-all`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {stat.label}
                                    </p>
                                    <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Role-based Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6"
                >
                    {roleStats.map((stat, index) => (
                        <div
                            key={index}
                            className={`${theme === 'dark'
                                ? 'bg-gradient-to-br from-gray-900/30 to-gray-800/20 border-gray-800 hover:border-gray-700'
                                : 'bg-white/30 border-gray-200 hover:border-gray-300'
                                } backdrop-blur-sm border rounded-xl p-4 transition-all cursor-pointer hover:scale-[1.02]`}
                            onClick={() => setRoleFilter(stat.label.toLowerCase().replace(' ', '_'))}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {stat.label}
                                    </p>
                                    <p className={`text-xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
            >
                <div className={`flex flex-col md:flex-row gap-4 items-center justify-between ${theme === 'dark'
                    ? 'bg-gray-900/30 border-gray-800'
                    : 'bg-white/50 border-gray-200'
                    } backdrop-blur-sm border rounded-2xl p-6`}>
                    <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type="text"
                                placeholder="Search users by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 ${theme === 'dark'
                                    ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20'
                                    } border rounded-xl focus:outline-none focus:ring-1`}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {/* Role Filter */}
                            <div className="relative">
                                <Users className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className={`pl-10 pr-4 py-3 ${theme === 'dark'
                                        ? 'bg-gray-900 border-gray-800 text-white focus:border-blue-500 focus:ring-blue-500/20'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400 focus:ring-blue-400/20'
                                        } border rounded-xl appearance-none focus:outline-none focus:ring-1 min-w-[180px]`}
                                >
                                    {ROLE_OPTIONS.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className={`pl-10 pr-4 py-3 ${theme === 'dark'
                                        ? 'bg-gray-900 border-gray-800 text-white focus:border-blue-500 focus:ring-blue-500/20'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400 focus:ring-blue-400/20'
                                        } border rounded-xl appearance-none focus:outline-none focus:ring-1 min-w-[180px]`}
                                >
                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => refetch()}
                            disabled={isLoading}
                            className={`p-4 hover:cursor-pointer rounded-xl transition-colors ${theme === 'dark'
                                ? 'bg-gray-800 hover:bg-gray-700'
                                : 'bg-gray-100 hover:bg-gray-200'
                                } disabled:opacity-50`}
                            title="Refresh"
                        >
                            <RefreshCw className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading users...</p>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            Failed to load users. Please try again.
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <User className="w-16 h-16 text-gray-400 mb-4" />
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            No users found {searchTerm && `for "${searchTerm}"`}
                            {roleFilter && roleFilter !== '' && ` with role "${ROLE_OPTIONS.find(r => r.value === roleFilter)?.label}"`}
                            {statusFilter && statusFilter !== '' && ` and status "${STATUS_OPTIONS.find(s => s.value === statusFilter)?.label}"`}
                        </p>
                        {(searchTerm || statusFilter || roleFilter !== 'client') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('');
                                    setRoleFilter('client');
                                }}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : <LayoutGroup>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {clients.map((client: Client, index: number) => (
                                <ClientCard
                                    key={index}
                                    client={client}
                                    onView={handleViewClient}
                                    onEdit={handleEditClient}
                                    onDelete={handleDeleteClient}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </LayoutGroup>}

                {clients.length > 0 && <PaginationControls />}
            </motion.div>

            {/* Client Detail Modal */}
            <AnimatePresence>
                {showClientModal && selectedClient && (
                    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`${theme === 'dark'
                                ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800'
                                : 'bg-white border-gray-200'
                                } border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        User Details
                                    </h2>
                                    <button
                                        onClick={() => setShowClientModal(false)}
                                        className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                            ? 'hover:bg-gray-800'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <XCircle className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {/* Profile Header */}
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <div className={`w-24 h-24 rounded-full ${theme === 'dark'
                                                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                                                : 'bg-gradient-to-br from-blue-400 to-blue-600'
                                                } flex items-center justify-center`}>
                                                {selectedClient.photo ? (
                                                    <img
                                                        src={selectedClient.photo}
                                                        alt={selectedClient.fullName}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-12 h-12 text-white" />
                                                )}
                                            </div>
                                            <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 ${theme === 'dark' ? 'border-gray-900' : 'border-white'} ${selectedClient.status === 'active' ? 'bg-emerald-500' :
                                                selectedClient.status === 'pending' ? 'bg-amber-500' :
                                                    'bg-rose-500'
                                                }`} />
                                        </div>
                                        <div>
                                            <h3 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedClient.fullName}
                                            </h3>
                                            <div className="flex items-center space-x-3 mt-2">
                                                <span className={`px-4 py-1 rounded-full text-sm font-medium ${selectedClient.status === 'active' ? theme === 'dark'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-emerald-100 text-emerald-700' :
                                                    selectedClient.status === 'pending' ? theme === 'dark'
                                                        ? 'bg-amber-500/10 text-amber-400'
                                                        : 'bg-amber-100 text-amber-700' :
                                                        theme === 'dark'
                                                            ? 'bg-rose-500/10 text-rose-400'
                                                            : 'bg-rose-100 text-rose-700'
                                                    }`}>
                                                    {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                                                </span>
                                                <span className={`px-4 py-1 rounded-full text-sm font-medium ${theme === 'dark'
                                                    ? 'bg-gray-800 text-gray-300'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {selectedClient.role.charAt(0).toUpperCase() + selectedClient.role.slice(1)}
                                                </span>
                                                <span className={`px-4 py-1 rounded-full text-sm font-medium ${theme === 'dark'
                                                    ? 'bg-gray-800 text-gray-300'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    ID: #{selectedClient.id.toString().padStart(4, '0')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { label: 'Email', value: selectedClient.email, icon: Mail },
                                            { label: 'Phone', value: selectedClient.mobileNo, icon: Phone },
                                            { label: 'Age', value: selectedClient.age.toString(), icon: Calendar },
                                            { label: 'Gender', value: selectedClient.sex, icon: User },
                                            { label: 'NID/Passport', value: selectedClient.nidOrPassportNo, icon: Shield },
                                            { label: 'Role', value: selectedClient.role, icon: UserCheck }
                                        ].map((item) => (
                                            <div key={item.label} className={`${theme === 'dark'
                                                ? 'bg-gray-900/50'
                                                : 'bg-gray-50'
                                                } rounded-xl p-4`}>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <item.icon className="w-5 h-5 text-blue-500" />
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* NID Photos */}
                                    {selectedClient.nidPhoto.frontSide && (
                                        <div>
                                            <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                                                NID Photos
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedClient.nidPhoto.frontSide && (
                                                    <div>
                                                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Front Side
                                                        </p>
                                                        <img
                                                            src={selectedClient.nidPhoto.frontSide}
                                                            alt="NID Front"
                                                            className="w-full h-48 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                                {selectedClient.nidPhoto.backSide && (
                                                    <div>
                                                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Back Side
                                                        </p>
                                                        <img
                                                            src={selectedClient.nidPhoto.backSide}
                                                            alt="NID Back"
                                                            className="w-full h-48 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dates */}
                                    <div className={`grid grid-cols-2 gap-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                        <div>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Created</p>
                                            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                                                {new Date(selectedClient.createdAt).toLocaleDateString()} at{' '}
                                                {new Date(selectedClient.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last Updated</p>
                                            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                                                {new Date(selectedClient.updatedAt).toLocaleDateString()} at{' '}
                                                {new Date(selectedClient.updatedAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex items-center justify-end space-x-4 mt-8 pt-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                    <button
                                        onClick={() => setShowClientModal(false)}
                                        className={`px-6 py-2 border ${theme === 'dark'
                                            ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                                            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                            } rounded-lg transition-colors`}
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleEditClient(selectedClient);
                                            setShowClientModal(false);
                                        }}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Edit User
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && clientToDelete && (
                    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`${theme === 'dark'
                                ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800'
                                : 'bg-white border-gray-200'
                                } border rounded-2xl max-w-md w-full p-8`}
                        >
                            <div className="text-center">
                                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trash2 className="w-10 h-10 text-rose-500" />
                                </div>

                                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                                    Delete User
                                </h3>
                                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Are you sure you want to delete <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {clientToDelete.fullName}
                                    </span>? This action cannot be undone.
                                </p>

                                <div className="flex items-center justify-center space-x-4">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={isDeleting}
                                        className={`px-6 py-2 border ${theme === 'dark'
                                            ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                                            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                            } rounded-lg transition-colors disabled:opacity-50`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete User'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}