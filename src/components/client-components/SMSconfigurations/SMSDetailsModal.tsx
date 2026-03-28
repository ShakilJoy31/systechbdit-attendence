"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit, MessageSquare, Key, Calendar, CheckCircle, XCircle, Eye, EyeOff, Hash, Copy, FileText, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import { SMS } from "@/utils/interface/smsConfiguration";
import { useTheme } from "@/hooks/useThemeContext";

interface SMSDetailsModalProps {
    isOpen: boolean;
    sms: SMS | null;
    client: {
        id: number;
        fullName: string;
        email: string;
        mobileNo: string;
    };
    onClose: () => void;
    onEdit: (sms: SMS) => void;
    onTestSMS: (sms: SMS) => void;
    onToggleStatus: (sms: SMS) => void;
}

const SMSDetailsModal: React.FC<SMSDetailsModalProps> = ({
    isOpen,
    sms,
    client,
    onClose,
    onEdit,
    onToggleStatus,
}) => {
    const { theme } = useTheme();
    const [showApiKey, setShowApiKey] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen || !sms) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: boolean) => {
        if (status) {
            return (
                <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-2 transition-colors duration-300 ${
                    theme === 'dark' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-green-100 text-green-700'
                }`}>
                    <CheckCircle size={14} />
                    Active
                </span>
            );
        } else {
            return (
                <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-2 transition-colors duration-300 ${
                    theme === 'dark' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-red-100 text-red-700'
                }`}>
                    <XCircle size={14} />
                    Inactive
                </span>
            );
        }
    };

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
            <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-2 transition-colors duration-300 ${
                theme === 'dark' ? colors.dark : colors.light
            }`}>
                {badgeIcons[type] || '❓'}
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
        );
    };

    const maskApiKey = (apiKey: string) => {
        if (!apiKey) return '';
        if (apiKey.length <= 8) {
            return '•'.repeat(apiKey.length);
        }
        const firstFour = apiKey.substring(0, 4);
        const lastFour = apiKey.substring(apiKey.length - 4);
        return `${firstFour}${'•'.repeat(6)}${lastFour}`;
    };

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(sms.apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateExampleUrl = () => {
        return `${sms.baseUrl}?api_key=${sms.apiKey}&type=${sms.type}&contacts=${client.mobileNo}&senderid=${sms.senderId}&msg=${encodeURIComponent(sms.message)}`;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ${
                        theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    } border`}
                >
                    {/* Header */}
                    <div className={`flex-shrink-0 p-6 border-b transition-colors duration-300 ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        <div className="flex justify-between items-center">
                            <div className='flex items-center gap-4'>
                                <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-colors duration-300 ${
                                    theme === 'dark' 
                                    ? 'bg-blue-500/20 border-2 border-blue-500/30' 
                                    : 'bg-blue-50 border-2 border-blue-500'
                                }`}>
                                    <MessageSquare size={32} className="text-blue-500" />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {sms.appName}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        {getStatusBadge(sms.status)}
                                        {getTypeBadge(sms.type)}
                                       
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className={`p-2 hover:cursor-pointer rounded-full transition-colors duration-300 ${
                                    theme === 'dark' 
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <X size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* SMS Configuration Details */}
                            <div className={`rounded-lg p-6 transition-colors duration-300 ${
                                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                            }`}>
                                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <MessageSquare size={20} />
                                    SMS Configuration Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className={`text-sm ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>App/Service Name</p>
                                        <p className={`text-lg font-semibold ${
                                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>{sms.appName}</p>
                                    </div>
                                   
                                    <div>
                                        <p className={`text-sm ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>Message Type</p>
                                        <div className="mt-2">
                                            {getTypeBadge(sms.type)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>Sender ID</p>
                                        <p className={`font-medium mt-1 flex items-center gap-2 ${
                                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            <Hash size={16} className="text-blue-500" />
                                            {sms.senderId}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className={`text-sm mb-2 ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>API Key</p>
                                        <div className={`p-4 rounded-lg border transition-colors duration-300 ${
                                            theme === 'dark' 
                                            ? 'bg-gray-900 border-gray-700' 
                                            : 'bg-white border-gray-200'
                                        }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Key size={16} className="text-yellow-500" />
                                                    <code className={`font-mono text-sm md:text-base transition-colors duration-300 ${
                                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                                                    }`}>
                                                        {showApiKey ? sms.apiKey : maskApiKey(sms.apiKey)}
                                                    </code>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => setShowApiKey(!showApiKey)}
                                                        className={`p-1.5 rounded transition-colors duration-300 ${
                                                            theme === 'dark'
                                                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                        title={showApiKey ? "Hide API Key" : "Show API Key"}
                                                    >
                                                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={handleCopyApiKey}
                                                        className={`p-1.5 rounded transition-colors duration-300 ${
                                                            theme === 'dark'
                                                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                        title="Copy API Key"
                                                    >
                                                        <Copy size={18} />
                                                    </motion.button>
                                                </div>
                                            </div>
                                            {copied && (
                                                <p className={`text-xs mt-2 ${
                                                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                                }`}>
                                                    ✓ API Key copied to clipboard!
                                                </p>
                                            )}
                                            <p className={`text-xs mt-2 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                ⚠️ This API key is sensitive. Keep it secure!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className={`rounded-lg p-6 transition-colors duration-300 ${
                                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                            }`}>
                                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <FileText size={20} />
                                    Message Content
                                </h3>
                                <div className={`p-4 rounded-lg border transition-colors duration-300 ${
                                    theme === 'dark' 
                                    ? 'bg-gray-900 border-gray-700' 
                                    : 'bg-white border-gray-200'
                                }`}>
                                    <div className="flex items-start gap-3">
                                        <FileText size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className={`text-sm mb-2 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                SMS Message ({sms.message.length} characters)
                                            </p>
                                            <p className={`whitespace-pre-wrap ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                                            }`}>
                                                {sms.message}
                                            </p>
                                            {sms.message.length > 160 && (
                                                <p className={`text-xs mt-2 ${
                                                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                                                }`}>
                                                    ⚠️ This message will be split into multiple SMS ({Math.ceil(sms.message.length / 160)} parts)
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Example SMS URL */}
                            <div className={`rounded-lg p-6 transition-colors duration-300 ${
                                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                            }`}>
                                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <Tag size={20} />
                                    Example SMS URL
                                </h3>
                                <div className={`p-4 rounded-lg border transition-colors duration-300 ${
                                    theme === 'dark' 
                                    ? 'bg-gray-900 border-gray-700' 
                                    : 'bg-white border-gray-200'
                                }`}>
                                    <p className={`text-sm mb-2 ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>Base URL</p>
                                    <code className={`text-sm block mb-3 p-2 rounded ${
                                        theme === 'dark' 
                                        ? 'bg-gray-800 text-gray-300' 
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {sms.baseUrl}
                                    </code>

                                    <p className={`text-sm mb-2 ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>Full URL with Client&apos;s Number</p>
                                    <code className={`text-sm block overflow-x-auto whitespace-nowrap mb-3 p-2 rounded ${
                                        theme === 'dark' 
                                        ? 'bg-gray-800 text-gray-300' 
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {generateExampleUrl()}
                                    </code>
                                </div>
                            </div>

                            {/* System Information */}
                            <div className={`rounded-lg p-6 transition-colors duration-300 ${
                                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                            }`}>
                                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <Calendar size={20} />
                                    System Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className={`text-sm ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>Created At</p>
                                        <p className={`font-semibold ${
                                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>{formatDate(sms.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>Last Updated</p>
                                        <p className={`font-semibold ${
                                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>{formatDate(sms.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`flex-shrink-0 p-6 border-t transition-colors duration-300 ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onToggleStatus(sms)}
                                    className={`flex items-center gap-2 transition-colors duration-300 ${
                                        theme === 'dark' 
                                        ? 'text-gray-300 hover:text-white' 
                                        : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    {sms.status ? (
                                        <>
                                            <ToggleRight size={20} className={theme === 'dark' ? 'text-green-400' : 'text-green-500'} />
                                            <span>Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <ToggleLeft size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} />
                                            <span>Inactive</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className={`px-6 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 ${
                                        theme === 'dark'
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Close
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        onClose();
                                        onEdit(sms);
                                    }}
                                    className={`px-6 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                                        theme === 'dark'
                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    <Edit size={16} />
                                    Edit Configuration
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SMSDetailsModal;