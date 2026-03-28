"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Send,
    Settings,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader,
    ChevronDown,
    Copy,
    ClipboardCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetClientSMSQuery } from '@/redux/api/sms-configurations/smsApi';
import { useSendSMSMutation } from '@/redux/api/sms-configurations/smsApi';
import { getUserInfo } from '@/utils/helper/userFromToken';
import { useRouter } from 'next/navigation';
import {
    SMSConfig,
    SMSSendResponse,
    isSMSApiResponse,
} from '@/utils/interface/sendSmsTypes';

const SMSComponent = () => {
    const [clientId, setClientId] = useState<string | null>(null);
    const [selectedConfig, setSelectedConfig] = useState<SMSConfig | null>(null);
    const [phoneNumbers, setPhoneNumbers] = useState<string>('');
    const [customMessage, setCustomMessage] = useState<string>('');
    const [isSending, setIsSending] = useState(false);
    const [showConfigDropdown, setShowConfigDropdown] = useState(false);
    const [sendResults, setSendResults] = useState<SMSSendResponse | null>(null);
    const [useCustomMessage,] = useState(true);

    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch user info
    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getUserInfo();
            if (!userInfo) {
                router.push("/");
            } else {
                setClientId(userInfo.id?.toString() || null);
            }
        };
        fetchUser();
    }, [router]);

    // Fetch SMS configurations
    const {
        data: smsConfigsData,
        isLoading: configsLoading,
        isError: configsError,
        refetch: refetchConfigs
    } = useGetClientSMSQuery(
        { clientId: clientId!, page: 1, limit: 100 },
        { skip: !clientId }
    );

    console.log(smsConfigsData);

    // Send SMS mutation
    const [sendSMS, { isLoading: isSendingMutation }] = useSendSMSMutation();

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowConfigDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper function to extract SMS configurations from response
    const getSMSConfigsFromResponse = (response): SMSConfig[] => {
        // Try different response structures
        if (!response) return [];

        // Case 1: Direct array of SMSConfig
        if (Array.isArray(response)) {
            return response;
        }

        // Case 2: Response has data.data array structure (SMSApiResponse)
        if (isSMSApiResponse(response) && response.data?.data) {
            return response.data.data;
        }

        // Case 3: Response has data property that's an array
        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }

        // Case 4: Response has nested data.data structure
        if (response.data?.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    };

    // Auto-select config if only one exists
    useEffect(() => {
        if (smsConfigsData) {
            const smsConfigs = getSMSConfigsFromResponse(smsConfigsData);
            if (smsConfigs.length === 1) {
                setSelectedConfig(smsConfigs[0]);
            }
        }
    }, [smsConfigsData]);

    // Get SMS configurations
    const smsConfigs = getSMSConfigsFromResponse(smsConfigsData);
    const activeConfigs = smsConfigs.filter((config: SMSConfig) => config.status);

    // Validate phone numbers
    const validatePhoneNumbers = (numbers: string): { valid: boolean; numbers: string[]; errors: string[] } => {
        const numbersArray = numbers
            .split(/[\n,;]+/)
            .map(num => num.trim())
            .filter(num => num.length > 0);

        const errors: string[] = [];
        const validNumbers: string[] = [];

        numbersArray.forEach((num, index) => {
            // Clean the number (remove non-digits)
            const cleanNum = num.replace(/\D/g, '');

            // Validate length
            if (cleanNum.length < 10 || cleanNum.length > 15) {
                errors.push(`Line ${index + 1}: "${num}" must be 10-15 digits`);
            } else {
                validNumbers.push(cleanNum);
            }
        });

        return {
            valid: errors.length === 0,
            numbers: validNumbers,
            errors
        };
    };

    // Handle send SMS
    const handleSendSMS = async () => {
        if (!selectedConfig) {
            toast.error('Please select an SMS configuration');
            return;
        }

        if (!phoneNumbers.trim()) {
            toast.error('Please enter at least one phone number');
            return;
        }

        // Validate phone numbers
        const validation = validatePhoneNumbers(phoneNumbers);
        if (!validation.valid) {
            toast.error('Invalid phone numbers found');
            validation.errors.forEach(error => toast.error(error, { duration: 4000 }));
            return;
        }

        if (validation.numbers.length === 0) {
            toast.error('No valid phone numbers found');
            return;
        }

        // Check if using custom message
        const finalMessage = useCustomMessage && customMessage.trim() ? customMessage.trim() : '';

        if (useCustomMessage && !finalMessage) {
            toast.error('Please enter a custom message');
            return;
        }

        setIsSending(true);
        setSendResults(null);

        try {
            const payload: {
                clientId: string | number;
                configId: string | number;
                phoneNumbers: string[];
                messages?: string[];
            } = {
                clientId: clientId!,
                configId: selectedConfig.id,
                phoneNumbers: validation.numbers
            };

            // Add custom messages if provided
            if (useCustomMessage && finalMessage) {
                // Create array with same message for all numbers
                payload.messages = Array(validation.numbers.length).fill(finalMessage);
            }

            const result = await sendSMS(payload).unwrap() as SMSSendResponse;
            setSendResults(result);

            if (result.success) {
                toast.success(`SMS sent successfully to ${result.data.successful} recipients`);

                // Clear form if everything succeeded
                if (result.data.failed === 0) {
                    setPhoneNumbers('');
                    setCustomMessage('');
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
                    total: validation.numbers.length,
                    successful: 0,
                    failed: validation.numbers.length,
                    results: [],
                    errors: validation.numbers.map(num => ({
                        phoneNumber: num,
                        error: 'Failed to send SMS'
                    }))
                }
            } as SMSSendResponse);
        } finally {
            setIsSending(false);
        }
    };

    // Copy results to clipboard
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

    // Loading state
    if (!clientId || configsLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center rounded-xl bg-white dark:bg-gray-800">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                    <p className="text-gray-600 dark:text-gray-300">
                        Loading SMS configurations...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (configsError) {
        return (
            <div className="min-h-[400px] flex items-center justify-center rounded-xl bg-white dark:bg-gray-800">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        Unable to Load Configurations
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                        Failed to load SMS configurations. Please try again.
                    </p>
                    <button
                        onClick={() => refetchConfigs()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // No configurations state
    if (smsConfigs.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center rounded-xl p-6 bg-white dark:bg-gray-800">
                <div className="text-center max-w-md">
                    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                        No SMS Configurations Found
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                        You need to create at least one active SMS configuration before sending messages.
                    </p>
                    <button
                        onClick={() => router.push(`/dashboard/sms-configurations`)}
                        className="px-6 py-3 rounded-lg font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Create SMS Configuration
                    </button>
                </div>
            </div>
        );
    }

    // No active configurations
    if (activeConfigs.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center rounded-xl p-6 bg-white dark:bg-gray-800">
                <div className="text-center max-w-md">
                    <Settings className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                        No Active SMS Configurations
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                        All your SMS configurations are inactive. Please enable at least one configuration to send messages.
                    </p>
                    <button
                        onClick={() => router.push(`/dashboard/sms-configurations`)}
                        className="px-6 py-3 rounded-lg font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Manage Configurations
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl shadow-lg transition-colors duration-300 bg-white dark:bg-gray-800 p-4 md:p-6">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Send className="w-6 h-6 md:w-8 md:h-8 text-blue-500 dark:text-blue-400" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        Send SMS
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Send SMS messages to multiple phone numbers at once
                </p>
            </div>

            {/* Configuration Selection */}
            <div className="mb-6 md:mb-8">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    SMS Configuration
                    {activeConfigs.length > 1 && (
                        <span className="text-gray-500 ml-1">({activeConfigs.length} active configurations)</span>
                    )}
                </label>

                {activeConfigs.length === 1 ? (
                    // Single configuration - show as card
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Settings className="w-4 h-4 text-green-500" />
                                    <span className="font-medium text-gray-900 dark:text-white">{activeConfigs[0].appName}</span>
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                                        Active
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Sender ID: {activeConfigs[0].senderId} • Type: {activeConfigs[0].type}
                                </p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Auto-selected
                            </div>
                        </div>
                    </div>
                ) : (
                    // Multiple configurations - dropdown
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setShowConfigDropdown(!showConfigDropdown)}
                            className="w-full flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Settings className="w-5 h-5 text-blue-500" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {selectedConfig ? selectedConfig.appName : 'Select Configuration'}
                                    </div>
                                    {selectedConfig && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Sender ID: {selectedConfig.senderId}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 transition-transform ${showConfigDropdown ? 'rotate-180' : ''} text-gray-500`} />
                        </button>

                        {showConfigDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-10 max-h-60 overflow-y-auto border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                            >
                                {activeConfigs.map((config) => (
                                    <button
                                        key={config.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedConfig(config);
                                            setShowConfigDropdown(false);
                                        }}
                                        className={`w-full p-4 hover:cursor-pointer text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedConfig?.id === config.id
                                            ? 'bg-blue-50 dark:bg-blue-500/20'
                                            : ''
                                            }`}
                                    >
                                        <div className="font-medium text-gray-900 dark:text-white">{config.appName}</div>
                                        <div className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                            Sender ID: {config.senderId} • Type: {config.type}
                                        </div>
                                        <div className="text-xs mt-1 text-gray-500">
                                            Default message: {config.message}
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Configuration Details */}
            {selectedConfig && (
                <div className="mb-4 md:mb-6 p-4 rounded-lg bg-blue-50/50 dark:bg-gray-900/50">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex justify-between items-center w-full mb-2 ">
                            <h4 className="font-medium text-gray-800 dark:text-gray-300">
                                Default Message
                            </h4>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedConfig.message);
                                    toast.success('Message copied to clipboard');
                                }}
                                className="p-1.5 hover:cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0 group"
                                title="Copy message"
                                type="button"
                            >
                                <motion.div
                                    whileTap={{
                                        scale: 0.9,
                                        rotate: 15
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 17
                                    }}
                                    className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                                >
                                    <Copy className="w-6 h-6" />
                                </motion.div>
                            </button>
                        </div>
                    </div>

                    {/* Default Message Preview */}
                    <div className="border-gray-700/30">
                        <div className="p-3 rounded bg-gray-100 dark:bg-gray-800 flex justify-between gap-x-2 items-start">
                            <p className="text-gray-700 dark:text-gray-300 break-words flex-1">
                                {selectedConfig.message}
                            </p>

                        </div>
                    </div>
                </div>
            )}

            {/* Phone Numbers Input */}
            <div className="mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Numbers
                    </label>
                </div>

                <textarea
                    value={phoneNumbers}
                    onChange={(e) => setPhoneNumbers(e.target.value)}
                    placeholder={`Enter phone numbers (one per line or separated by commas/semicolons) Example:
01712345678
01898765432,01987654321`}
                    rows={2}
                    className="w-full p-3 md:p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 resize-none transition-colors"
                />

                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {phoneNumbers ? (
                        <>
                            Detected: {phoneNumbers.split(/[\n,;]+/).filter(num => num.trim().length > 0).length} number(s)
                            {phoneNumbers.includes(',') && ' (comma-separated)'}
                            {phoneNumbers.includes(';') && ' (semicolon-separated)'}
                            {phoneNumbers.includes('\n') && !phoneNumbers.includes(',') && !phoneNumbers.includes(';') && ' (line-separated)'}
                        </>
                    ) : (
                        'Enter phone numbers above'
                    )}
                </div>
            </div>

            {/* Custom Message Input */}
            {useCustomMessage && (
                <div className="mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Custom Message
                        </label>
                        <span className="text-xs text-gray-500">
                            {customMessage.length} characters
                        </span>
                    </div>
                    <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Enter your custom message here. Leave empty to use the default configuration message."
                        rows={4}
                        className="w-full p-3 md:p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 resize-none transition-colors"
                    />
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        This message will override the default configuration message for all recipients.
                    </div>
                </div>
            )}

            {/* Send Button */}
            <div className="mb-6 md:mb-8">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendSMS}
                    disabled={!selectedConfig || !phoneNumbers.trim() || isSending || isSendingMutation}
                    className={`px-2 w-full justify-center hover:cursor-pointer py-4 text-sm border rounded transition-colors duration-300 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 dark:border-blue-500/30 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1`}
                >
                    {isSending || isSendingMutation ? (
                        <>
                            <Loader className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5 md:w-6 md:h-6" />
                            Send SMS
                        </>
                    )}
                </motion.button>


                <div className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
                    {selectedConfig && phoneNumbers.trim() && (
                        <>
                            Ready to send to {phoneNumbers.split(/[\n,;]+/).filter(num => num.trim().length > 0).length} recipient(s)
                            {useCustomMessage ? ' with custom message' : ' with default message'}
                        </>
                    )}
                </div>
            </div>

            {/* Results Display */}
            {sendResults && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Send Results
                        </h3>
                        <button
                            onClick={copyResultsToClipboard}
                            className="flex items-center hover:cursor-pointer gap-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 self-start sm:self-auto"
                        >
                            <ClipboardCheck className="w-4 h-4" />
                            Copy Results
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
                        <div className="p-3 md:p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                            <div className="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                                {sendResults.data.total}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Recipients</div>
                        </div>
                        <div className={`p-3 md:p-4 rounded-lg ${sendResults.data.successful > 0
                            ? 'bg-green-500/10'
                            : 'bg-gray-50 dark:bg-gray-900'
                            }`}>
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                    {sendResults.data.successful}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
                        </div>
                        <div className={`p-3 md:p-4 rounded-lg ${sendResults.data.failed > 0
                            ? 'bg-red-500/10'
                            : 'bg-gray-50 dark:bg-gray-900'
                            }`}>
                            <div className="flex items-center gap-2 mb-1">
                                <XCircle className="w-5 h-5 text-red-500" />
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                    {sendResults.data.failed}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
                        </div>
                    </div>

                    {/* Detailed Results */}
                    {sendResults.data.results.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                                Successful Messages
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {sendResults.data.results.map((result, index) => (
                                    <div
                                        key={index}
                                        className="p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 dark:bg-gray-900"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                                    {result.phoneNumber}
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    {result.response}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Errors */}
                    {sendResults.data.errors && sendResults.data.errors.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                                Failed Messages
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {sendResults.data.errors.map((error, index) => (
                                    <div
                                        key={index}
                                        className="p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 dark:bg-gray-900"
                                    >
                                        <div className="flex items-center gap-3">
                                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                                    {error.phoneNumber}
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                    {error.error}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Summary Message */}
                    <div className={`mt-6 p-4 rounded-lg ${sendResults.success
                        ? 'bg-green-50 dark:bg-green-500/10'
                        : 'bg-yellow-50 dark:bg-yellow-500/10'
                        }`}>
                        <div className="flex items-start gap-3">
                            {sendResults.success ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                                <p className={`font-medium ${sendResults.success
                                    ? 'text-green-700 dark:text-green-400'
                                    : 'text-yellow-700 dark:text-yellow-400'
                                    }`}>
                                    {sendResults.message}
                                </p>
                                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                    {sendResults.data.failed > 0
                                        ? 'Some messages failed to send. Check the failed messages above for details.'
                                        : 'All messages were sent successfully!'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default SMSComponent;



