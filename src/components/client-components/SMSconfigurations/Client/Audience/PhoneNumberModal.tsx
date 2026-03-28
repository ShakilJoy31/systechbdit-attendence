"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Phone, MessageSquare, Send, Calendar, Clock, Check, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import { useSendSMSMutation } from "@/redux/api/sms-configurations/smsApi"; // Updated to use the new API
import { useGetSMSByIdQuery } from "@/redux/api/sms-configurations/smsApi";
import { SMSSendResult } from "@/utils/interface/sendSmsInterface";

interface PhoneNumberModalProps {
    isOpen: boolean;
    clientId: string | number;
    audienceId: number;
    phoneNumber: string;
    message: string;
    configId: string | number; // Changed to required
    onClose: () => void;
    onUpdate: () => void;
}

const PhoneNumberModal: React.FC<PhoneNumberModalProps> = ({
    isOpen,
    clientId,
    phoneNumber: initialPhoneNumber,
    message: initialMessage,
    configId,
    onClose,
    onUpdate
}) => {
    const { theme } = useTheme();
    const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
    const [message, setMessage] = useState(initialMessage);
    const [scheduledTime, setScheduledTime] = useState("");
    const [isScheduling, setIsScheduling] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [useConfigMessage, setUseConfigMessage] = useState(false);
    const [sendStatus, setSendStatus] = useState<{
        success?: number;
        failed?: number;
        results?: SMSSendResult[];
        errors?: Array<{
            phoneNumber: string;
            error: string;
            response?: unknown;
        }>;
    } | null>(null);

    // Use the new sendSMS mutation (not sendSMSToAudience)
    const [sendSMS] = useSendSMSMutation();

    // Fetch SMS config data using configId
    const { data: smsConfigData } = useGetSMSByIdQuery(
        { clientId, id: configId },
        { skip: !configId || !isOpen || configId === 0 }
    );

    // Get the config message from the SMS config
    const configMessage = smsConfigData?.data?.message || "";

    // Reset states when modal opens
    useEffect(() => {
        if (isOpen) {
            setPhoneNumber(initialPhoneNumber);
            setMessage(initialMessage);
            setUseConfigMessage(false);
            setSendStatus(null);
        }
    }, [isOpen, initialPhoneNumber, initialMessage]);

    const handleSendSMS = async () => {
        if (!configId || configId === 0) {
            toast.error("SMS configuration is required");
            return;
        }

        if (!phoneNumber.trim()) {
            toast.error("Phone number is required");
            return;
        }

        // Determine which message to send
        let messageToSend = message;
        
        // If useConfigMessage is true OR message is empty, use config message
        if (useConfigMessage || !message.trim()) {
            if (!configMessage.trim()) {
                toast.error("Configuration message is empty");
                return;
            }
            messageToSend = configMessage;
        }

        // If message is still empty after checking config
        if (!messageToSend.trim()) {
            toast.error("Message cannot be empty");
            return;
        }

        try {
            setIsSending(true);
            setSendStatus(null);

            // Call the new SMS sending API with configId and optional custom message
            const result = await sendSMS({
                clientId,
                configId,
                phoneNumbers: [phoneNumber.trim()],
                messages: useConfigMessage ? undefined : [messageToSend] // Only send custom message if not using config
            }).unwrap();

            console.log("SMS Result:", result);

            if (result.success) {
                if (result.data.results && result.data.results.length > 0) {
                    const sentResult = result.data.results[0];
                    if (sentResult.success) {
                        const messageType = sentResult.messageUsed === 'custom' ? 'Custom' : 'Config';
                        toast.success(`To: ${phoneNumber} - ${messageType} message sent successfully`);
                    } else {
                        toast.error(`To: ${phoneNumber} - ${sentResult.error || 'Failed to send'}`);
                    }
                }

                setSendStatus({
                    success: result.data.successful,
                    failed: result.data.failed,
                    results: result.data.results,
                    errors: result.data.errors
                });
            } else {
                toast.error(result.message || "Failed to send SMS");
            }

            onUpdate();
            
            // Don't close automatically if there were failures
            if (result.data.failed === 0) {
                setTimeout(() => onClose(), 1500);
            }
        } catch (error: unknown) {
            console.error('Send SMS error:', error);
            
            let errorMessage = "Failed to send SMS";
            if (error && typeof error === 'object' && 'data' in error && 
                error.data && typeof error.data === 'object' && 'message' in error.data) {
                errorMessage = (error.data as { message: string }).message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    const handleScheduleSMS = () => {
        if (!scheduledTime) {
            toast.error("Please select a schedule time");
            return;
        }

        toast.success(`SMS scheduled for ${new Date(scheduledTime).toLocaleString()}`);
        // Implement actual scheduling logic here
    };

    const handleUseConfigMessage = () => {
        if (configMessage) {
            setMessage(configMessage);
            setUseConfigMessage(true);
            toast.success("Config message applied!");
        } else {
            toast.error("Config message not available");
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = e.target.value;
        setMessage(newMessage);
        
        // Automatically toggle useConfigMessage based on content
        if (configMessage) {
            if (newMessage === configMessage) {
                setUseConfigMessage(true);
            } else if (useConfigMessage && newMessage !== configMessage) {
                setUseConfigMessage(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
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
                className={`rounded-xl w-full max-w-md shadow-2xl ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                    } border`}
            >
                {/* Header */}
                <div className={`p-6 border-b transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                                }`}>
                                <Phone className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Send SMS
                                </h2>
                                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {useConfigMessage ? 'Using config message' : 'Using custom message'}
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className={`p-2 hover:cursor-pointer hover:bg-red-600 hover:text-red-200 border hover:border-red-600 rounded-full transition-colors duration-300 ${theme === 'dark'
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <X size={20} />
                        </motion.button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* SMS Config Info */}
                    {smsConfigData?.data && (
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                            }`}>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Config: <span className="font-bold">{smsConfigData.data.appName}</span>
                            </p>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                Sender ID: {smsConfigData.data.senderId} • Type: {smsConfigData.data.type}
                            </p>
                        </div>
                    )}

                    {/* Phone Number Input */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                    } border`}
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                    {/* Message Textarea */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Message
                                {useConfigMessage && (
                                    <span className={`ml-2 text-xs px-2 py-1 rounded ${theme === 'dark' 
                                        ? 'bg-blue-500/20 text-blue-300' 
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        Using Config
                                    </span>
                                )}
                            </label>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    {message.length} characters
                                </span>
                                {configMessage && (
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleUseConfigMessage}
                                        className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors duration-300 ${theme === 'dark'
                                                ? useConfigMessage
                                                    ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                                                    : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20'
                                                : useConfigMessage
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                    : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                                            }`}
                                    >
                                        {useConfigMessage ? (
                                            <>
                                                <Check size={12} />
                                                Config Applied
                                            </>
                                        ) : (
                                            <>
                                                <MessageSquare size={12} />
                                                Use Config
                                            </>
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <MessageSquare className="absolute top-3 left-3 text-gray-400 h-4 w-4" />
                            <textarea
                                value={message}
                                onChange={handleMessageChange}
                                maxLength={500}
                                rows={4}
                                className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                    } border`}
                                placeholder={configMessage || "Type your message here..."}
                            />
                        </div>
                        {configMessage && (
                            <div className="mt-2">
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <span className="font-medium">Config message:</span> {configMessage.substring(0, 60)}
                                    {configMessage.length > 60 ? "..." : ""}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Send Status Display */}
                    {sendStatus && (
                        <div className={`p-3 rounded-lg ${
                            sendStatus.failed === 0
                                ? theme === 'dark' ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
                                : theme === 'dark' ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                            <div className="flex items-center gap-2">
                                {sendStatus.failed === 0 ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                )}
                                <p className={`text-sm font-medium ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    {sendStatus.failed === 0
                                        ? `SMS sent successfully to ${sendStatus.success} number(s)`
                                        : `Sent to ${sendStatus.success}, failed for ${sendStatus.failed}`
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Schedule Option */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="checkbox"
                                id="schedule"
                                checked={isScheduling}
                                onChange={(e) => setIsScheduling(e.target.checked)}
                                className={`w-4 h-4 rounded focus:ring-blue-500 transition-colors duration-300 ${
                                    theme === 'dark'
                                        ? 'text-blue-500 bg-gray-700 border-gray-600'
                                        : 'text-blue-600 border-gray-300'
                                }`}
                            />
                            <label htmlFor="schedule" className={`text-sm flex items-center gap-2 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                <Calendar size={14} />
                                Schedule for later
                            </label>
                        </div>

                        {isScheduling && (
                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Schedule Time
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="datetime-local"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                        className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-6 border-t transition-colors duration-300 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className={`flex-1 hover:cursor-pointer px-4 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                                theme === 'dark'
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <X size={18} />
                            Cancel
                        </motion.button>

                        {isScheduling ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleScheduleSMS}
                                className={`flex-1 hover:cursor-pointer px-4 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                                    theme === 'dark'
                                        ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30'
                                        : 'bg-purple-500 text-white hover:bg-purple-600'
                                }`}
                            >
                                Schedule SMS
                                <Calendar size={18} />
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSendSMS}
                                disabled={isSending || !configId || configId === 0 || !phoneNumber.trim() || (!message.trim() && !configMessage.trim())}
                                className={`flex-1 px-4 hover:cursor-pointer py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                                    theme === 'dark'
                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                }`}
                            >
                                {isSending ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        {useConfigMessage ? 'Send Config SMS' : 'Send Custom SMS'}
                                        <Send size={18} />
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PhoneNumberModal;