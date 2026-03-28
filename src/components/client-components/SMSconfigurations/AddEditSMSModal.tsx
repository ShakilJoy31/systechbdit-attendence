"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Eye, EyeOff, Shield, Hash, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCreateSMSMutation, useUpdateSMSMutation } from "@/redux/api/sms-configurations/smsApi";
import { SMS } from "@/utils/interface/smsConfiguration";
import { useTheme } from "@/hooks/useThemeContext";

interface AddEditSMSModalProps {
    clientId: string | number;
    smsData?: SMS | null;
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
}

const AddEditSMSModal: React.FC<AddEditSMSModalProps> = ({
    clientId,
    smsData,
    isOpen,
    onClose
}) => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        appName: "",
        apiKey: "",
        type: "unicode" as const,
        senderId: "",
        message: "",
        status: true,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [apiKeyStrength, setApiKeyStrength] = useState({
        score: 0,
        message: ""
    });

    const [createSMS] = useCreateSMSMutation();
    const [updateSMS] = useUpdateSMSMutation();

    // Initialize form data
    useEffect(() => {
        if (smsData) {
            setFormData({
                appName: smsData.appName,
                apiKey: smsData.apiKey,
                type: smsData.type as "unicode",
                senderId: smsData.senderId,
                message: smsData.message,
                status: smsData.status,
            });
        } else {
            setFormData({
                appName: "",
                apiKey: "",
                type: "unicode",
                senderId: "",
                message: "",
                status: true,
            });
        }
    }, [smsData]);

    // Check API key strength
    useEffect(() => {
        checkApiKeyStrength(formData.apiKey);
    }, [formData.apiKey]);

    const checkApiKeyStrength = (apiKey: string) => {
        if (!apiKey) {
            setApiKeyStrength({ score: 0, message: "" });
            return;
        }

        let score = 0;
        const messages = [];

        if (apiKey.length >= 10) score += 1;
        else messages.push("At least 10 characters");

        if (/[A-Z]/.test(apiKey)) score += 1;
        else messages.push("Uppercase letters");

        if (/[a-z]/.test(apiKey)) score += 1;
        else messages.push("Lowercase letters");

        if (/[0-9]/.test(apiKey)) score += 1;
        else messages.push("Numbers");

        if (/[^A-Za-z0-9]/.test(apiKey)) score += 1;
        else messages.push("Special characters");

        let message = "";
        if (score >= 4) {
            message = "Strong API key ✓";
        } else if (score >= 2) {
            message = "Moderate API key";
        } else if (score > 0) {
            message = "Weak API key";
        } else {
            message = "Very weak API key";
        }

        if (messages.length > 0 && score < 4) {
            message += ` - Needs: ${messages.join(", ")}`;
        }

        setApiKeyStrength({ score, message });
    };

    // Handle form input changes
    const handleInputChange = (field: string, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Validate form
    const validateForm = (): boolean => {
        if (!formData.appName.trim()) {
            toast.error("App name is required");
            return false;
        }

        if (!formData.apiKey.trim()) {
            toast.error("API key is required");
            return false;
        }

        if (formData.apiKey.length < 10) {
            toast.error("API key must be at least 10 characters");
            return false;
        }

        if (!formData.senderId.trim()) {
            toast.error("Sender ID is required");
            return false;
        }

        if (formData.senderId.length < 3 || formData.senderId.length > 20) {
            toast.error("Sender ID must be between 3 and 20 characters");
            return false;
        }

        if (!formData.message.trim()) {
            toast.error("Message is required");
            return false;
        }

        if (formData.message.length > 500) {
            toast.error("Message cannot exceed 500 characters");
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (smsData?.id) {
                // Update existing SMS
                await updateSMS({
                    clientId,
                    id: smsData.id,
                    data: formData
                }).unwrap();
                toast.success("SMS configuration updated successfully!");
            } else {
                // Create new SMS
                await createSMS({
                    clientId,
                    data: formData
                }).unwrap();
                toast.success("SMS configuration created successfully!");
            }

            onClose(true);
        } catch (error) {
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
                className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`rounded-xl w-full max-w-4xl overflow-hidden flex flex-col shadow-2xl ${
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
                            <h2 className={`text-2xl font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                                {smsData ? "Edit SMS Configuration" : "Add New SMS Configuration"}
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onClose()}
                                className={`p-2 rounded-full transition-colors duration-300 ${
                                    theme === 'dark' 
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <X size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* SMS Configuration */}
                            <div className="space-y-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        App/Service Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.appName}
                                        onChange={(e) => handleInputChange('appName', e.target.value)}
                                        required
                                        className={`w-full px-3 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                            theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                        placeholder="e.g., MRAM SMS Gateway, Company SMS"
                                    />
                                    <p className={`text-xs mt-1 ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        Name to identify this SMS configuration
                                    </p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        API Key *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showApiKey ? "text" : "password"}
                                            value={formData.apiKey}
                                            onChange={(e) => handleInputChange('apiKey', e.target.value)}
                                            required
                                            className={`w-full pl-3 pr-10 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                                theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                            } border`}
                                            placeholder="Enter your API key"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowApiKey(!showApiKey)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showApiKey ? (
                                                <EyeOff size={18} className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`} />
                                            ) : (
                                                <Eye size={18} className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`} />
                                            )}
                                        </button>
                                    </div>
                                    {formData.apiKey && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Shield size={12} className={apiKeyStrength.score >= 4 ? "text-green-500" : "text-yellow-500"} />
                                                <span className={`text-xs ${
                                                    apiKeyStrength.score >= 4 ? "text-green-600" : 
                                                    apiKeyStrength.score >= 2 ? "text-yellow-600" : 
                                                    "text-red-600"
                                                }`}>
                                                    {apiKeyStrength.message}
                                                </span>
                                            </div>
                                            <div className={`w-full rounded-full h-1.5 ${
                                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                            }`}>
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                                        apiKeyStrength.score >= 4
                                                            ? "bg-green-500 w-full"
                                                            : apiKeyStrength.score >= 2
                                                                ? "bg-yellow-500 w-3/4"
                                                                : apiKeyStrength.score > 0
                                                                    ? "bg-red-500 w-1/2"
                                                                    : "bg-red-300 w-1/4"
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Message Type *
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => handleInputChange('type', e.target.value)}
                                            required
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                                theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                            } border`}
                                        >
                                            <option value="unicode">Unicode (Bengali/Arabic)</option>
                                            <option value="text">Text (English)</option>
                                            <option value="flash">Flash Message</option>
                                        </select>
                                    </div>

                                   
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Sender ID *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Hash size={16} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.senderId}
                                            onChange={(e) => handleInputChange('senderId', e.target.value)}
                                            required
                                            maxLength={20}
                                            className={`w-full pl-10 pr-3 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                                theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                            } border`}
                                            placeholder="e.g., 8809601017931"
                                        />
                                    </div>
                                    <p className={`text-xs mt-1 ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        This will appear as sender on recipient&apos;s phone
                                    </p>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className={`block text-sm font-medium ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            SMS Message *
                                        </label>
                                        <span className={`text-xs ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            {formData.message.length} characters
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <FileText size={16} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                        </div>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                            required
                                            maxLength={500}
                                            rows={4}
                                            className={`w-full pl-10 pr-3 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${
                                                theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                            } border`}
                                            placeholder="Type your SMS message here..."
                                        />
                                    </div>
                                    <p className={`text-xs mt-1 ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        This message will be sent to recipients. Use dynamic variables like {"{name}"}, {"{amount}"} if needed.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="status"
                                        checked={formData.status}
                                        onChange={(e) => handleInputChange('status', e.target.checked)}
                                        className={`w-4 h-4 rounded focus:ring-blue-500 transition-colors duration-300 ${
                                            theme === 'dark'
                                            ? 'text-blue-500 bg-gray-700 border-gray-600'
                                            : 'text-blue-600 border-gray-300'
                                        }`}
                                    />
                                    <label htmlFor="status" className={`text-sm ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Active Configuration
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className={`flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t transition-colors duration-300 ${
                                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onClose()}
                                    className={`px-2 md:px-3 lg:px-4 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                                        theme === 'dark'
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    disabled={isLoading}
                                >
                                    <X size={18} />
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-2 md:px-3 lg:px-4 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                                        theme === 'dark'
                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                    disabled={isLoading}
                                >
                                    <Save size={18} />
                                    {isLoading ? "Saving..." : (smsData ? "Update" : "Save")}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddEditSMSModal;