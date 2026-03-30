"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Save,
    Wifi,
    Shield,
    Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import { useCreateIpConfigMutation, useUpdateIpConfigMutation, WifiIpConfig } from "@/redux/api/employee/wifiIpConfigApi";

interface AddEditIpConfigModalProps {
    configData?: WifiIpConfig | null;
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
}

const AddEditIpConfigModal: React.FC<AddEditIpConfigModalProps> = ({
    configData,
    isOpen,
    onClose
}) => {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        ipAddress: "",
        name: "",
        isActive: true,
    });

    const [createIpConfig] = useCreateIpConfigMutation();
    const [updateIpConfig] = useUpdateIpConfigMutation();

    useEffect(() => {
        if (configData) {
            setFormData({
                ipAddress: configData.ipAddress,
                name: configData.name,
                isActive: configData.isActive,
            });
        } else {
            setFormData({
                ipAddress: "",
                name: "",
                isActive: true,
            });
        }
    }, [configData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
        }));
    };

    const validateForm = () => {
        if (!formData.ipAddress?.trim()) {
            toast.error("IP address is required");
            return false;
        }
        if (!formData.name?.trim()) {
            toast.error("IP name is required");
            return false;
        }

        // IP Address validation
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(formData.ipAddress)) {
            toast.error("Please enter a valid IP address");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (configData?.id) {
                await updateIpConfig({
                    id: configData.id,
                    data: formData
                }).unwrap();
                toast.success("IP configuration updated successfully!");
            } else {
                await createIpConfig(formData).unwrap();
                toast.success("IP configuration created successfully!");
            }

            onClose(true);
        } catch (error: any) {
            toast.error(error?.data?.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`rounded-2xl w-full max-w-lg flex flex-col shadow-2xl ${
                        theme === 'dark'
                            ? 'bg-gray-900 border-gray-800'
                            : 'bg-white border-gray-100'
                    } border`}
                >
                    {/* Header */}
                    <div className={`flex-shrink-0 p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                                    <Wifi className={`w-6 h-6 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {configData ? "Edit IP Configuration" : "Add New IP Configuration"}
                                    </h2>
                                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {configData 
                                            ? `Update configuration for ${configData.ipAddress}` 
                                            : "Register a trusted office network IP"}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onClose()}
                                className={`p-2 cursor-pointer rounded-full transition-all duration-300 ${
                                    theme === 'dark'
                                        ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                        : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <X size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* IP Address */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    IP Address *
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        name="ipAddress"
                                        value={formData.ipAddress}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 192.168.1.100"
                                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        } border`}
                                        required
                                    />
                                </div>
                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Enter a valid IPv4 address (e.g., 192.168.1.100)
                                </p>
                            </div>

                            {/* IP Name */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    IP Name *
                                </label>
                                <div className="relative">
                                    <Wifi className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Main Office, Branch Office"
                                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        } border`}
                                        required
                                    />
                                </div>
                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    A descriptive name for this IP address
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Status
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="isActive"
                                            value="true"
                                            checked={formData.isActive === true}
                                            onChange={() => setFormData(prev => ({ ...prev, isActive: true }))}
                                            className="text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Active
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="isActive"
                                            value="false"
                                            checked={formData.isActive === false}
                                            onChange={() => setFormData(prev => ({ ...prev, isActive: false }))}
                                            className="text-red-500 focus:ring-red-500"
                                        />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Inactive
                                        </span>
                                    </label>
                                </div>
                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Inactive IPs will not be accepted for attendance verification
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className={`flex-shrink-0 flex flex-col sm:flex-row justify-end gap-4 p-6 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onClose()}
                            className={`px-6 py-2.5 cursor-pointer rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                                theme === 'dark'
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            disabled={isLoading}
                        >
                            <X size={18} />
                            Cancel
                        </motion.button>

                        <motion.button
                            type="submit"
                            onClick={handleSubmit}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-6 py-2.5 cursor-pointer rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                                theme === 'dark'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            } shadow-lg shadow-emerald-500/20`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    {configData ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    {configData ? "Update IP" : "Create IP"}
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${theme === 'dark' ? '#4B5563' : '#D1D5DB'};
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${theme === 'dark' ? '#6B7280' : '#9CA3AF'};
                }
            `}</style>
        </AnimatePresence>
    );
};

export default AddEditIpConfigModal;