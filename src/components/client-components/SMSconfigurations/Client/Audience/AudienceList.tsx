"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    MessageSquare,
    Users,
    Phone,
    Eye,
    Edit,
    Trash2,
    Send,
    Calendar,
    Clock,
    ChevronRight,
    ChevronLeft,
    MoreVertical,
    Smartphone,
    CheckCircle,
    ArrowRight,
    Loader,
    AlertCircle,
    XCircle,
    ClipboardCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useThemeContext';
import { useDeleteAudienceMutation, useGetClientAudiencesQuery } from '@/redux/api/sms-configurations/audienceApi';
import AddEditAudienceModal from './AddEditAudienceModal';
import PhoneNumberModal from './PhoneNumberModal';
import AudienceDetailsModal from './AudienceDetailsModal';
import { useSendSMSMutation } from '@/redux/api/sms-configurations/smsApi';

interface AudienceListProps {
    clientId: string | number;
    client: {
        id: number;
        fullName: string;
        email: string;
        mobileNo: string;
        photo?: string;
    };
}

interface PhoneNumberModalData {
    audienceId: number;
    phoneNumber: string;
    message: string;
    configId: string | number;
}

interface SmsConfig {
    id: string | number;
    appName: string;
}

interface PhoneNumber {
    id?: number;
    phoneNumber: string;
    message: string;
    status?: string;
}

interface Audience {
    id: number;
    configName: string;
    configId?: string | number;
    totalNumbers: number;
    phoneNumbers: PhoneNumber[];
    createdAt: string;
    updatedAt: string;
    status?: string;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

interface AudienceApiResponse {
    data: Audience[];
    smsConfigs: SmsConfig[];
    pagination: PaginationData;
}

interface SMSSendResponse {
    success: boolean;
    message: string;
    data: {
        total: number;
        successful: number;
        failed: number;
        results: Array<{
            phoneNumber: string;
            success: boolean;
            messageUsed: string;
            response: string;
        }>;
        errors: Array<{
            phoneNumber: string;
            error: string;
        }>;
    };
}

const AudienceList: React.FC<AudienceListProps> = ({ clientId, client }) => {
    const { theme } = useTheme();
    const [filters, setFilters] = useState({
        search: "",
        configId: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<PhoneNumberModalData | null>(null);
    const [audienceToSendSMS, setAudienceToSendSMS] = useState<Audience | null>(null);
    const [sendResults, setSendResults] = useState<SMSSendResponse | null>(null);
    const [isSending, setIsSending] = useState(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [audienceToEdit, setAudienceToEdit] = useState<Audience | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; audience: Audience | null }>({ isOpen: false, audience: null });
    const [expandedAudience, setExpandedAudience] = useState<number | null>(null);

    const {
        data: audienceData,
        isLoading,
        isError,
        refetch
    } = useGetClientAudiencesQuery({
        clientId,
        page: currentPage,
        limit: itemsPerPage,
        ...filters
    }) as { data: AudienceApiResponse | undefined; isLoading: boolean; isError: boolean; refetch: () => void; };

    const [deleteAudience] = useDeleteAudienceMutation();
    const [sendSMS] = useSendSMSMutation();

    const audiences = audienceData?.data || [];
    const smsConfigs = audienceData?.smsConfigs || [];
    const pagination = audienceData?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 9
    };

    // Helper function to get configId from configName
    const getConfigIdByName = (configName: string): string | number | null => {
        const config = smsConfigs.find(config => config.appName === configName);
        return config ? config.id : null;
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleView = (audience: Audience) => {
        setSelectedAudience(audience);
    };

    const handleEdit = (audience: Audience) => {
        setAudienceToEdit(audience);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (audience: Audience) => {
        setDeleteModal({ isOpen: true, audience });
    };

    const handleDelete = async () => {
        if (!deleteModal.audience) return;

        try {
            await deleteAudience({
                clientId,
                id: deleteModal.audience.id
            }).unwrap();

            toast.success('Audience deleted successfully');
            setDeleteModal({ isOpen: false, audience: null });
            refetch();
        } catch (error) {
            console.log(error)
            toast.error('Failed to delete audience');
        }
    };

    // Function to handle phone number click
    const handlePhoneNumberClick = (audience: Audience, phone: PhoneNumber) => {
        // Try to get configId from audience object first
        let configId = audience.configId;

        // If configId is not in audience, try to find it from configName
        if (!configId) {
            configId = getConfigIdByName(audience.configName);
        }

        if (!configId) {
            toast.error("Could not find SMS configuration");
            return;
        }

        setSelectedPhoneNumber({
            audienceId: audience.id,
            phoneNumber: phone.phoneNumber,
            message: phone.message,
            configId: configId
        });
    };

    // Function to handle Send SMS button click
    const handleSendSMSClick = (audience: Audience) => {
        // Try to get configId from audience object first
        let configId = audience.configId;

        // If configId is not in audience, try to find it from configName
        if (!configId) {
            configId = getConfigIdByName(audience.configName);
        }

        if (!configId) {
            toast.error("Could not find SMS configuration");
            return;
        }

        // Update the audience with configId
        const audienceWithConfig = {
            ...audience,
            configId: configId
        };

        setAudienceToSendSMS(audienceWithConfig);
    };

    // Function to send SMS to all numbers in audience
    const handleSendSMSToAudience = async () => {
        if (!audienceToSendSMS) return;

        if (!audienceToSendSMS.phoneNumbers || audienceToSendSMS.phoneNumbers.length === 0) {
            toast.error('No phone numbers to send messages to');
            return;
        }

        if (!audienceToSendSMS.configId) {
            toast.error('SMS configuration not found');
            return;
        }

        setIsSending(true);
        setSendResults(null);

        try {
            // Prepare payload
            const payload: {
                clientId: string | number;
                configId: string | number;
                phoneNumbers: string[];
                messages?: string[];
            } = {
                clientId: client.id,
                configId: audienceToSendSMS.configId,
                phoneNumbers: audienceToSendSMS.phoneNumbers.map(p => p.phoneNumber)
            };

            // Use individual messages from each phone number
            payload.messages = audienceToSendSMS.phoneNumbers.map(p => p.message);

            const result = await sendSMS(payload).unwrap() as SMSSendResponse;
            setSendResults(result);

            if (result.success) {
                toast.success(`SMS sent successfully to ${result.data.successful} recipients`);
                
                if (result.data.failed === 0) {
                    setAudienceToSendSMS(null);
                }
            } else {
                toast.error(result.message || 'Failed to send SMS');
            }
        } catch (error) {
            console.error('Send SMS error:', error);
            toast.error(error?.data?.message || 'Failed to send SMS. Please try again.');
            setSendResults({
                success: false,
                message: error?.data?.message || 'Failed to send SMS',
                data: {
                    total: audienceToSendSMS.phoneNumbers.length,
                    successful: 0,
                    failed: audienceToSendSMS.phoneNumbers.length,
                    results: [],
                    errors: audienceToSendSMS.phoneNumbers.map(phone => ({
                        phoneNumber: phone.phoneNumber,
                        error: error?.data?.message || 'Failed to send SMS'
                    }))
                }
            } as SMSSendResponse);
        } finally {
            setIsSending(false);
        }
    };

    const copyResultsToClipboard = () => {
        if (!sendResults) return;

        const text = `
SMS Send Results:
Total: ${sendResults.data.total}
Successful: ${sendResults.data.successful}
Failed: ${sendResults.data.failed}

${sendResults.data.results.map(r =>
            `${r.phoneNumber}: ${r.success ? '✓ Success' : '✗ Failed'} (${r.messageUsed} message)`
        ).join('\n')}

${sendResults.data.errors?.length ? '\nErrors:\n' + sendResults.data.errors.map(e =>
            `${e.phoneNumber}: ${e.error}`
        ).join('\n') : ''}
        `.trim();

        navigator.clipboard.writeText(text);
        toast.success('Results copied to clipboard');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400';
            case 'inactive': return 'bg-yellow-500/20 text-yellow-400';
            case 'pending': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (isError) {
        return (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Failed to load audiences</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => refetch()}
                    className={`mt-4 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto ${theme === 'dark'
                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
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
                transition={{ duration: 0.3 }}
                className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            >
                <div>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        SMS Audiences
                    </h2>
                    <p className={`mt-1 text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage your SMS audiences and phone numbers
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setAudienceToEdit(null);
                        setIsAddModalOpen(true);
                    }}
                    className={`px-5 py-2.5 w-full md:w-auto flex justify-center hover:cursor-pointer rounded-xl transition-all duration-300 items-center gap-2 group ${theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/20'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
                        }`}
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Create New Audience
                </motion.button>
            </motion.div>

            {/* Filters Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className={`rounded-2xl py-6 px-2 md:px-4 lg:px-6 shadow-xl transition-colors duration-300 ${theme === 'dark'
                    ? 'bg-linear-to-br from-gray-800 to-gray-900 border-gray-700'
                    : 'bg-linear-to-br from-white to-gray-50 border-gray-200'
                    } border`}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        <Filter size={20} className="text-blue-500" />
                        Filter Audiences
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Search Audiences
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    placeholder="Search by name, phone, or config..."
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            SMS Configuration
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <select
                                    value={filters.configId}
                                    onChange={(e) => handleFilterChange("configId", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 appearance-none ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                >
                                    <option value="">All Configurations</option>
                                    {smsConfigs.map((config: SmsConfig) => (
                                        <option key={config.id} value={config.id}>
                                            {config.appName}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Sort By
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <select
                                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 appearance-none ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                >
                                    <option>Newest First</option>
                                    <option>Oldest First</option>
                                    <option>Most Numbers</option>
                                    <option>Least Numbers</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Audiences Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="space-y-6"
            >
                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl p-6 animate-pulse ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}`}
                            >
                                <div className={`h-6 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 rounded-lg mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 rounded-lg w-2/3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            </div>
                        ))}
                    </div>
                ) : audiences.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl ${theme === 'dark' ? 'bg-linear-to-br from-gray-800 to-gray-900' : 'bg-linear-to-br from-gray-50 to-white'
                        }`}>
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className={`absolute inset-0 rounded-full ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100'}`}></div>
                            <Users className="absolute inset-0 m-auto w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            No Audiences Found
                        </h3>
                        <p className={`mb-6 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Create your first audience to start sending SMS messages to multiple phone numbers at once.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAddModalOpen(true)}
                            className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto group ${theme === 'dark'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/20'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
                                }`}
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            Create First Audience
                        </motion.button>
                    </div>
                ) : (
                    <>
                        {/* Grid Layout */}
                        <div className={`grid grid-cols-1 ${audiences.length < 2 ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-6`}>
                            {audiences.map((audience: Audience, index: number) => (
                                <motion.div
                                    key={audience.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${theme === 'dark'
                                        ? 'bg-gray-900/50'
                                        : 'bg-white'
                                        } border shadow-lg hover:shadow-xl ${expandedAudience === audience.id
                                            ? theme === 'dark' ? 'border-blue-500' : 'border-blue-500'
                                            : theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                                        }`}
                                >

                                    {/* Card Header */}
                                    <div className="py-6 px-2 md:px-4 lg:px-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                                                    <MessageSquare className="w-6 h-6 text-blue-500" />
                                                </div>
                                                <div className='flex items-center gap-x-4'>
                                                    <h3 className={`font-semibold text-lg truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {audience.configName}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor('active')}`}>
                                                            Active
                                                        </span>

                                                    </div>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setExpandedAudience(expandedAudience === audience.id ? null : audience.id)}
                                                className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                                                    }`}
                                            >
                                                <MoreVertical size={20} />
                                            </motion.button>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                            <div className={`text-center p-3 rounded-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                                                }`}>
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <Phone size={14} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />
                                                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {audience.totalNumbers}
                                                    </span>
                                                </div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Numbers
                                                </span>
                                            </div>
                                            <div className={`text-center p-3 rounded-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                                                }`}>
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <Send size={14} className={theme === 'dark' ? 'text-green-400' : 'text-green-500'} />
                                                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        0
                                                    </span>
                                                </div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Sent
                                                </span>
                                            </div>
                                            <div className={`text-center p-3 rounded-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                                                }`}>
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <CheckCircle size={14} className={theme === 'dark' ? 'text-purple-400' : 'text-purple-500'} />
                                                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        0
                                                    </span>
                                                </div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Delivered
                                                </span>
                                            </div>
                                        </div>

                                        {/* Phone Numbers Preview */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Phone Numbers
                                                </span>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                                    }`}>
                                                    {audience.totalNumbers} total
                                                </span>
                                            </div>
                                            <div className={`grid gap-4 ${audiences.length < 2 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'}`}>
                                                {audience.phoneNumbers.map((phone: PhoneNumber, idx: number) => (
                                                    <motion.button
                                                        key={idx}
                                                        whileHover={{ x: 4 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handlePhoneNumberClick(audience, phone)}
                                                        className={`w-full flex hover:cursor-pointer items-center justify-between p-3 rounded-lg transition-all duration-300 ${theme === 'dark'
                                                            ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                                                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Smartphone size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                                }`}>
                                                                {phone.phoneNumber}
                                                            </span>
                                                        </div>
                                                        <ArrowRight size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        <AnimatePresence>
                                            {expandedAudience === audience.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-4 border-t border-gray-700/50 dark:border-gray-700">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <Calendar size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                    Created: {formatDate(audience.createdAt)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <Clock size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                    Updated: {formatTime(audience.updatedAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Card Footer */}
                                    <div className={`py-6 px-2 md:px-4 lg:px-6 border-t transition-colors duration-300 ${theme === 'dark'
                                        ? 'bg-gray-900/50 border-gray-700'
                                        : 'bg-gray-50/50 border-gray-200'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleView(audience)}
                                                className={`flex hover:cursor-pointer items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <Eye size={16} />
                                                <span className="text-sm">View</span>
                                            </motion.button>

                                            <div className="flex items-center gap-1">
                                                {[
                                                    { 
                                                        icon: Send, 
                                                        action: () => handleSendSMSClick(audience), 
                                                        title: 'Send SMS', 
                                                        color: 'text-purple-500' 
                                                    },
                                                    { 
                                                        icon: Edit, 
                                                        action: () => handleEdit(audience), 
                                                        title: 'Edit', 
                                                        color: 'text-green-500' 
                                                    },
                                                    { 
                                                        icon: Trash2, 
                                                        action: () => handleDeleteClick(audience), 
                                                        title: 'Delete', 
                                                        color: 'text-red-500' 
                                                    },
                                                ].map((btn, idx) => (
                                                    <motion.button
                                                        key={idx}
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={btn.action}
                                                        className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                                            ? 'hover:bg-gray-700'
                                                            : 'hover:bg-gray-100'
                                                            }`}
                                                        title={btn.title}
                                                    >
                                                        <btn.icon size={18} className={btn.color} />
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className={`rounded-2xl p-6 shadow-lg transition-colors duration-300 ${theme === 'dark'
                                    ? 'bg-linear-to-br from-gray-800 to-gray-900 border-gray-700'
                                    : 'bg-linear-to-br from-white to-gray-50 border-gray-200'
                                    } border`}
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            Show per page:
                                        </span>
                                        <select
                                            className={`px-3 py-1.5 rounded-lg transition-colors duration-300 ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-gray-100 border-gray-300 text-gray-700'
                                                } border`}
                                        >
                                            <option>9</option>
                                            <option>18</option>
                                            <option>27</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Page <span className="font-semibold">{currentPage}</span> of{" "}
                                            <span className="font-semibold">{pagination.totalPages}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30'
                                                    } disabled:cursor-not-allowed`}
                                            >
                                                <ChevronLeft size={20} />
                                            </motion.button>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                    let pageNum;
                                                    if (pagination.totalPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage >= pagination.totalPages - 2) {
                                                        pageNum = pagination.totalPages - 4 + i;
                                                    } else {
                                                        pageNum = currentPage - 2 + i;
                                                    }

                                                    return (
                                                        <motion.button
                                                            key={pageNum}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`w-10 h-10 rounded-lg transition-all duration-300 ${currentPage === pageNum
                                                                ? theme === 'dark'
                                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                                                : theme === 'dark'
                                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                                disabled={currentPage === pagination.totalPages}
                                                className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30'
                                                    } disabled:cursor-not-allowed`}
                                            >
                                                <ChevronRight size={20} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Add/Edit Audience Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddEditAudienceModal
                        clientId={clientId}
                        smsConfigs={smsConfigs.map(config => ({
                            id: Number(config.id), // Cast to number
                            appName: config.appName
                        }))}
                        audienceData={audienceToEdit ? {
                            ...audienceToEdit,
                            configId: audienceToEdit.configId ? Number(audienceToEdit.configId) : undefined,
                            clientId: Number(clientId) // Add clientId if required
                        } : undefined}
                        isOpen={isAddModalOpen}
                        onClose={(refreshData: boolean) => {
                            setIsAddModalOpen(false);
                            setAudienceToEdit(null);
                            if (refreshData) {
                                refetch();
                            }
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Audience Details Modal */}
            <AnimatePresence>
                {selectedAudience && (
                    <AudienceDetailsModal
                        isOpen={!!selectedAudience}
                        audience={selectedAudience}
                        client={client}
                        onClose={() => setSelectedAudience(null)}
                        onEdit={handleEdit}
                        onPhoneNumberClick={(phone: PhoneNumber) => {
                            // Handle phone number click from details modal
                            if (selectedAudience) {
                                const configId = getConfigIdByName(selectedAudience.configName);
                                if (configId) {
                                    setSelectedPhoneNumber({
                                        audienceId: selectedAudience.id,
                                        phoneNumber: phone.phoneNumber,
                                        message: phone.message,
                                        configId: configId
                                    });
                                } else {
                                    toast.error("Could not find SMS configuration");
                                }
                            }
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Send SMS Confirmation Modal */}
            <AnimatePresence>
                {audienceToSendSMS && (
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
                            className={`rounded-2xl p-8 w-full max-w-2xl shadow-2xl ${theme === 'dark'
                                ? 'bg-linear-to-br from-gray-800 to-gray-900 border-gray-700'
                                : 'bg-linear-to-br from-white to-gray-50 border-gray-200'
                                } border`}
                        >
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Send className="w-6 h-6 text-purple-500" />
                                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Send SMS to Audience
                                    </h3>
                                </div>
                                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    You are about to send SMS messages to all phone numbers in the audience.
                                </p>
                            </div>

                            {/* Audience Information */}
                            <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}>Audience Name</p>
                                        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>{audienceToSendSMS.configName}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}>Total Recipients</p>
                                        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>{audienceToSendSMS.totalNumbers} phone numbers</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message Preview */}
                            {audienceToSendSMS.phoneNumbers.length > 0 && (
                                <div className="mb-6">
                                    <h4 className={`font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Message Preview (For double check)
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {audienceToSendSMS.phoneNumbers.map((phone, index) => (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Phone size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {phone.phoneNumber}
                                                    </span>
                                                </div>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {phone.message.length > 100 ? phone.message.substring(0, 100) + '...' : phone.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Results Display (if available) */}
                            {sendResults && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-6 p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            Send Results
                                        </h4>
                                        <button
                                            onClick={copyResultsToClipboard}
                                            className={`flex items-center hover:cursor-pointer gap-2 px-4 py-2 rounded-lg transition-colors ${theme === 'dark'
                                                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                                } self-start sm:self-auto`}
                                        >
                                            <ClipboardCheck className="w-4 h-4" />
                                            Copy Results
                                        </button>
                                    </div>

                                    {/* Summary */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <div className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                                                {sendResults.data.total}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Sent</div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${sendResults.data.successful > 0
                                            ? 'bg-green-500/10 dark:bg-green-500/20'
                                            : 'bg-gray-100 dark:bg-gray-800'
                                            }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {sendResults.data.successful}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${sendResults.data.failed > 0
                                            ? 'bg-red-500/10 dark:bg-red-500/20'
                                            : 'bg-gray-100 dark:bg-gray-800'
                                            }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <XCircle className="w-4 h-4 text-red-500" />
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {sendResults.data.failed}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
                                        </div>
                                    </div>

                                    {/* Summary Message */}
                                    <div className={`p-3 rounded-lg ${sendResults.success
                                        ? 'bg-green-50 dark:bg-green-500/10'
                                        : 'bg-yellow-50 dark:bg-yellow-500/10'
                                        }`}>
                                        <div className="flex items-start gap-2">
                                            {sendResults.success ? (
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            )}
                                            <p className={`text-sm ${sendResults.success
                                                ? 'text-green-700 dark:text-green-400'
                                                : 'text-yellow-700 dark:text-yellow-400'
                                                }`}>
                                                {sendResults.message}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setAudienceToSendSMS(null);
                                        setSendResults(null);
                                    }}
                                    className={`flex-1 hover:cursor-pointer py-3 px-4 rounded-xl transition-all duration-300 border ${theme === 'dark'
                                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border-gray-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                                        }`}
                                >
                                    {sendResults ? 'Close' : 'Cancel'}
                                </motion.button>
                                {!sendResults && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSendSMSToAudience}
                                        disabled={isSending}
                                        className={`flex-1 hover:cursor-pointer py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                                            ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30 disabled:opacity-50'
                                            : 'bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50'
                                            }`}
                                    >
                                        {isSending ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Send SMS to All
                                            </>
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Phone Number Modal */}
            <AnimatePresence>
                {selectedPhoneNumber && (
                    <PhoneNumberModal
                        isOpen={!!selectedPhoneNumber}
                        clientId={clientId}
                        configId={selectedPhoneNumber.configId}
                        audienceId={selectedPhoneNumber.audienceId}
                        phoneNumber={selectedPhoneNumber.phoneNumber}
                        message={selectedPhoneNumber.message}
                        onClose={() => setSelectedPhoneNumber(null)}
                        onUpdate={() => refetch()}
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
                            className={`rounded-2xl p-8 w-full max-w-md shadow-2xl ${theme === 'dark'
                                ? 'bg-linear-to-br from-gray-800 to-gray-900 border-gray-700'
                                : 'bg-linear-to-br from-white to-gray-50 border-gray-200'
                                } border`}
                        >
                            <div className="text-center">
                                <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 relative`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30"></div>
                                    <div className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                        }`}>
                                        <Trash2 className="h-8 w-8 text-red-500" />
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Delete Audience?
                                </h3>

                                <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    This will permanently delete the audience{' '}
                                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        &quot;{deleteModal.audience?.configName}&quot;
                                    </span>{' '}
                                    with{' '}
                                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {deleteModal.audience?.totalNumbers} phone numbers
                                    </span>. This action cannot be undone.
                                </p>

                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setDeleteModal({ isOpen: false, audience: null })}
                                        className={`flex-1 hover:cursor-pointer py-3 px-4 rounded-xl transition-all duration-300 border ${theme === 'dark'
                                            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border-gray-700'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                                            }`}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDelete}
                                        className="flex-1 hover:cursor-pointer bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20"
                                    >
                                        Delete Audience
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

export default AudienceList;