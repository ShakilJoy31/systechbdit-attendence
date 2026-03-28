"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, Trash2, Phone, MessageSquare, FileUp, Check, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import { Audience, PhoneNumberData, useCreateAudienceMutation, useUpdateAudienceMutation } from "@/redux/api/sms-configurations/audienceApi";
import { useGetSMSByIdQuery } from "@/redux/api/sms-configurations/smsApi";

interface AddEditAudienceModalProps {
    clientId: string | number;
    smsConfigs: Array<{ id: number; appName: string }>;
    audienceData?: Audience;
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
}

const AddEditAudienceModal: React.FC<AddEditAudienceModalProps> = ({
    clientId,
    smsConfigs,
    audienceData,
    isOpen,
    onClose
}) => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        configId: "",
        phoneNumbers: [] as Array<{ phoneNumber: string; message: string }>
    });

    const [isLoading, setIsLoading] = useState(false);
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [useConfigMessage, setUseConfigMessage] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [createAudience] = useCreateAudienceMutation();
    const [updateAudience] = useUpdateAudienceMutation();

    // Get SMS config data for the selected config
    const { data: smsConfigData } = useGetSMSByIdQuery(
        { clientId, id: formData.configId },
        { skip: !formData.configId }
    );

    // Get the config message from the SMS config
    const configMessage = smsConfigData?.data?.message || "";

    useEffect(() => {
        if (audienceData) {
            setFormData({
                configId: audienceData.configId.toString(),
                phoneNumbers: audienceData.phoneNumbers || []
            });
        } else {
            setFormData({
                configId: smsConfigs[0]?.id.toString() || "",
                phoneNumbers: []
            });
        }
    }, [audienceData, smsConfigs]);

    useEffect(() => {
        // When config message changes and useConfigMessage is true, update the newMessage
        if (useConfigMessage && configMessage) {
            setNewMessage(configMessage);
        }
    }, [configMessage, useConfigMessage]);

    const handleAddPhoneNumber = () => {
        if (!newPhoneNumber.trim() || !newMessage.trim()) {
            toast.error("Phone number and message are required");
            return;
        }

        // Validate phone number format
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(newPhoneNumber)) {
            toast.error("Phone number must be 10-15 digits");
            return;
        }

        // Check for duplicates
        if (formData.phoneNumbers.some(p => p.phoneNumber === newPhoneNumber)) {
            toast.error("This phone number already exists");
            return;
        }

        setFormData(prev => ({
            ...prev,
            phoneNumbers: [...prev.phoneNumbers, {
                phoneNumber: newPhoneNumber,
                message: newMessage
            }]
        }));

        setNewPhoneNumber("");
        setNewMessage("");
        setUseConfigMessage(false);
    };

    const handleRemovePhoneNumber = (index: number) => {
        setFormData(prev => ({
            ...prev,
            phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index)
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
            toast.error("Please upload Excel or CSV file only");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("File size should be less than 5MB");
            return;
        }

        setSelectedFile(file);
        toast.success(`File selected: ${file.name}`);
    };
    const parseExcelFile = async () => {
        if (!selectedFile) {
            toast.error("Please select a file first");
            return;
        }

        setIsUploading(true);
        try {
            // Dynamically import xlsx to avoid SSR issues
            const XLSX = await import('xlsx');

            // Read the file
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    if (!data) {
                        throw new Error("Failed to read file");
                    }

                    // Parse the Excel file
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    // Get all sheet data as array with headers
                    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    console.log("Sheet data:", sheetData); // Debug log

                    if (sheetData.length <= 1) { // Only headers or empty
                        toast.error("No data found in the Excel file");
                        return;
                    }

                    // Extract headers from first row
                    const headers = sheetData[0] as string[];
                    console.log("Headers:", headers); // Debug log

                    // Find phone number column index
                    let phoneColumnIndex = -1;
                    let messageColumnIndex = -1;

                    // Common column names for phone numbers
                    const phoneColumnNames = [
                        'phone_number', 'phoneNumber', 'number', 'phone',
                        'Phone', 'Phone Number', 'mobile', 'Mobile', 'MOBILE',
                        'phone number', 'phone no', 'Phone No', 'PHONE_NO'
                    ];

                    // Common column names for messages
                    const messageColumnNames = [
                        'message', 'msg', 'text', 'content',
                        'Message', 'MSG', 'TEXT', 'CONTENT',
                        'sms', 'SMS'
                    ];

                    // Find phone column
                    headers.forEach((header, index) => {
                        const normalizedHeader = String(header).toLowerCase().trim();
                        for (const phoneName of phoneColumnNames) {
                            if (normalizedHeader.includes(phoneName.toLowerCase())) {
                                phoneColumnIndex = index;
                                console.log(`Found phone column "${header}" at index ${index}`);
                                break;
                            }
                        }
                    });

                    // Find message column
                    headers.forEach((header, index) => {
                        const normalizedHeader = String(header).toLowerCase().trim();
                        for (const messageName of messageColumnNames) {
                            if (normalizedHeader.includes(messageName.toLowerCase())) {
                                messageColumnIndex = index;
                                console.log(`Found message column "${header}" at index ${index}`);
                                break;
                            }
                        }
                    });

                    // If phone column not found by name, try to guess (usually first column)
                    if (phoneColumnIndex === -1) {
                        phoneColumnIndex = 0; // Assume first column is phone numbers
                        console.log("Assuming first column is phone numbers");
                    }

                    // If message column not found by name, try to guess (usually second column)
                    if (messageColumnIndex === -1) {
                        messageColumnIndex = 1; // Assume second column is messages
                        console.log("Assuming second column is messages");
                    }

                    // Process each data row (skip header row)
                    const processedData: Array<{ phoneNumber: string; message: string }> = [];
                    const errors: string[] = [];

                    for (let i = 1; i < sheetData.length; i++) {
                        const row = sheetData[i] as PhoneNumberData[];

                        if (!row || row.length === 0) continue;

                        let phoneNumber = '';
                        let message = '';

                        // Get phone number from the identified column
                        if (phoneColumnIndex >= 0 && phoneColumnIndex < row.length) {
                            phoneNumber = String(row[phoneColumnIndex] || '').trim();
                        }

                        // Get message from the identified column
                        if (messageColumnIndex >= 0 && messageColumnIndex < row.length) {
                            message = String(row[messageColumnIndex] || '').trim();
                        }

                        // If no message found, use config message or default
                        if (!message && configMessage) {
                            message = configMessage;
                        } else if (!message) {
                            message = "Default message";
                        }

                        // Validate phone number
                        const phoneRegex = /^[0-9]{10,15}$/;
                        let cleanPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters

                        // Handle Bangladeshi phone numbers (add 880 if starts with 0)
                        if (cleanPhoneNumber.startsWith('0')) {
                            cleanPhoneNumber = '880' + cleanPhoneNumber.substring(1);
                        }

                        // Handle if starts with country code but missing 880
                        if (cleanPhoneNumber.length === 10) {
                            cleanPhoneNumber = '880' + cleanPhoneNumber;
                        }

                        console.log(`Row ${i}: Raw phone: "${phoneNumber}", Clean: "${cleanPhoneNumber}"`);

                        if (!phoneRegex.test(cleanPhoneNumber)) {
                            errors.push(`Row ${i + 1}: Invalid phone number "${phoneNumber}"`);
                            continue; // Skip invalid rows but continue processing
                        }

                        processedData.push({
                            phoneNumber: cleanPhoneNumber,
                            message
                        });
                    }

                    console.log("Processed data:", processedData); // Debug log

                    if (processedData.length === 0) {
                        toast.error("No valid phone numbers found in the file");
                        return;
                    }

                    // Filter out duplicates
                    const existingNumbers = new Set(formData.phoneNumbers.map(p => p.phoneNumber));
                    const newData = processedData.filter(item => !existingNumbers.has(item.phoneNumber));

                    if (newData.length === 0) {
                        toast.error("All phone numbers from the file already exist in the list");
                        return;
                    }

                    // Add new data to form
                    setFormData(prev => ({
                        ...prev,
                        phoneNumbers: [...prev.phoneNumbers, ...newData]
                    }));

                    // Show success message with stats
                    const successMessage = `Successfully added ${newData.length} phone numbers from file`;
                    if (errors.length > 0) {
                        toast.success(`${successMessage} (${errors.length} errors)`);
                        console.log("Parsing errors:", errors);
                    } else {
                        toast.success(successMessage);
                    }

                    setSelectedFile(null);

                    // Reset file input
                    const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';

                } catch (error) {
                    console.error("Error parsing Excel file:", error);
                    toast.error("Failed to parse file. Please check the format.");
                } finally {
                    setIsUploading(false);
                }
            };

            reader.onerror = () => {
                toast.error("Failed to read file");
                setIsUploading(false);
            };

            if (selectedFile.name.endsWith('.csv')) {
                // For CSV files
                reader.readAsText(selectedFile);
            } else {
                // For Excel files
                reader.readAsBinaryString(selectedFile);
            }

        } catch (error) {
            console.error("Error loading xlsx library:", error);
            toast.error("Failed to parse file. Please make sure the file format is correct.");
            setIsUploading(false);
        }
    };

    const downloadSampleExcel = () => {
        try {
            // Dynamically import xlsx
            import('xlsx').then((XLSX) => {
                // Create sample data with proper headers
                const sampleData = [
                    ["phone_number", "message"], // Headers
                    ["01712345678", "ভাই ক্যামন আছেন? আজকে আমাদের অফারে বিশেষ ছাড় পাচ্ছেন।"],
                    ["01898765432", "স্যার, আপনার অর্ডারটি কনফার্ম হয়েছে। ডেলিভারি সময়: আজ বিকাল ৪টা।"],
                    ["01911223344", configMessage || "Default message for SMS"]
                ];

                // Create a new workbook
                const workbook = XLSX.utils.book_new();

                // Create worksheet from the data
                const worksheet = XLSX.utils.aoa_to_sheet(sampleData);

                // Add worksheet to workbook
                XLSX.utils.book_append_sheet(workbook, worksheet, "Phone Numbers");

                // Generate Excel file buffer
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

                // Create Blob from buffer
                const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.setAttribute('href', url);
                link.setAttribute('download', 'sample_phone_numbers.xlsx');
                link.style.visibility = 'hidden';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up
                URL.revokeObjectURL(url);

                toast.success("Sample Excel file downloaded!");
            }).catch((error) => {
                console.error("Error loading xlsx for download:", error);
                toast.error("Failed to create sample file");
            });
        } catch (error) {
            console.error("Error in downloadSampleExcel:", error);
            toast.error("Failed to create sample file");
        }
    };

    const validateForm = () => {
        if (!formData.configId) {
            toast.error("Please select an SMS configuration");
            return false;
        }

        if (formData.phoneNumbers.length === 0) {
            toast.error("Please add at least one phone number");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const data = {
                configId: parseInt(formData.configId),
                phoneNumbers: formData.phoneNumbers
            };

            if (audienceData?.id) {
                await updateAudience({
                    clientId,
                    id: audienceData.id,
                    data
                }).unwrap();
                toast.success("Audience updated successfully!");
            } else {
                await createAudience({
                    clientId,
                    data
                }).unwrap();
                toast.success("Audience created successfully!");
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
                    className={`rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                        } border`}
                >
                    {/* Header */}
                    <div className={`flex-shrink-0 p-6 border-b transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <div className="flex justify-between items-center">
                            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                {audienceData ? "Edit Audience" : "Create New Audience"}
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onClose()}
                                className={`p-2 hover:bg-red-600 hover:text-red-200 border hover:border-red-600 hover:cursor-pointer rounded-full transition-colors duration-300 ${theme === 'dark'
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
                            {/* SMS Configuration Selection */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    SMS Configuration *
                                </label>
                                <select
                                    value={formData.configId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, configId: e.target.value }))}
                                    required
                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                >
                                    <option value="">Select SMS Configuration</option>
                                    {smsConfigs.map((config) => (
                                        <option key={config.id} value={config.id}>
                                            {config.appName}
                                        </option>
                                    ))}
                                </select>
                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    Select which SMS configuration to use for this audience
                                </p>
                            </div>

                            {/* File Upload Section */}
                            <div className={`rounded-lg p-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                                }`}>
                                <div className="flex justify-between items-center mb-3">
                                    <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        <FileUp size={16} />
                                        Upload Excel File
                                    </label>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={downloadSampleExcel}
                                        className={`text-xs hover:cursor-pointer px-3 py-1 rounded flex items-center gap-1 transition-colors duration-300 ${theme === 'dark'
                                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                                            }`}
                                    >
                                        <Download size={12} /> Sample
                                    </motion.button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="file"
                                            id="excel-upload"
                                            accept=".xlsx,.xls,.csv"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => document.getElementById('excel-upload')?.click()}
                                            className={`px-4 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                }`}
                                        >
                                            <FileUp size={16} />
                                            Choose File
                                        </motion.button>
                                        {selectedFile && (
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {selectedFile.name}
                                                </p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {selectedFile && (
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={parseExcelFile}
                                            disabled={isUploading}
                                            className={`px-4 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 disabled:opacity-50'
                                                : 'bg-green-500 text-white hover:bg-green-600 disabled:opacity-50'
                                                }`}
                                        >
                                            {isUploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Parsing File...
                                                </>
                                            ) : (
                                                <>
                                                    <FileUp size={16} />
                                                    Upload & Parse File
                                                </>
                                            )}
                                        </motion.button>
                                    )}

                                    <div className="space-y-1">
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Supported formats: .xlsx, .xls, .csv
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Required columns: <strong>phone_number</strong> (10-15 digits), <strong>message</strong> (optional)
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Max file size: 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Add Phone Numbers */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Phone Numbers *
                                </label>

                                {/* Add Phone Number Form */}
                                <div className={`p-4 rounded-lg mb-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                                    }`}>
                                    <div className="space-y-4">
                                        {/* Phone Number Input */}
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    value={newPhoneNumber}
                                                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                                                    placeholder="8801712345678"
                                                    className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                                        } border`}
                                                />
                                            </div>
                                        </div>

                                        {/* Message Input with Config Message Option */}
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                    Message
                                                </label>
                                                {configMessage && (
                                                    <motion.button
                                                        type="button"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setNewMessage(configMessage);
                                                            setUseConfigMessage(true);
                                                        }}
                                                        className={`text-xs hover:cursor-pointer px-2 py-1 rounded flex items-center gap-1 transition-colors duration-300 ${theme === 'dark'
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
                                                                Using Config Message
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MessageSquare size={12} />
                                                                Use Config Message
                                                            </>
                                                        )}
                                                    </motion.button>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                                <textarea
                                                    value={newMessage}
                                                    onChange={(e) => {
                                                        setNewMessage(e.target.value);
                                                        if (useConfigMessage && e.target.value !== configMessage) {
                                                            setUseConfigMessage(false);
                                                        }
                                                    }}
                                                    placeholder={configMessage || "Enter message for this number..."}
                                                    rows={3}
                                                    className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                                        } border`}
                                                />
                                            </div>
                                            {configMessage && (
                                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Config message: {configMessage.substring(0, 50)}
                                                    {configMessage.length > 50 ? "..." : ""}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAddPhoneNumber}
                                        className={`mt-4 px-4 py-2 hover:cursor-pointer rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                    >
                                        <Plus size={16} />
                                        Add Phone Number
                                    </motion.button>
                                </div>

                                {/* Phone Numbers List */}
                                <div className={`rounded-lg overflow-hidden border transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                    <div className={`p-3 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
                                        }`}>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Phone Numbers ({formData.phoneNumbers.length})
                                            </span>
                                        </div>
                                    </div>
                                    {formData.phoneNumbers.length === 0 ? (
                                        <div className={`p-8 text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                            }`}>
                                            <Phone className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>No phone numbers added yet</p>
                                            <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Add numbers manually or upload an Excel file
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="max-h-64 overflow-y-auto">
                                            {formData.phoneNumbers.map((phone, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-3 border-b transition-colors duration-300 ${theme === 'dark' ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-100 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Phone size={12} className={`flex-shrink-0 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                                                    }`} />
                                                                <code className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                                                                    }`}>
                                                                    {phone.phoneNumber}
                                                                </code>
                                                                {index >= formData.phoneNumbers.length - 3 && (
                                                                    <span className={`text-xs px-1.5 py-0.5 rounded ${theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                                                        New
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                                }`}>
                                                                {phone.message}
                                                            </p>
                                                        </div>
                                                        <motion.button
                                                            type="button"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleRemovePhoneNumber(index)}
                                                            className={`p-1 hover:cursor-pointer rounded transition-colors duration-300 ${theme === 'dark'
                                                                ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                                                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                                }`}
                                                        >
                                                            <Trash2 size={14} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className={`flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onClose()}
                                    className={`px-6 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
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
                                    className={`px-6 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    disabled={isLoading}
                                >
                                    <Save size={18} />
                                    {isLoading ? "Saving..." : (audienceData ? "Update" : "Create")}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddEditAudienceModal;