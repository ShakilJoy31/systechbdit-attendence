// components/employee/AddEditEmployeeModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Save,
    User,
    Mail,
    Phone,
    Briefcase,
    Calendar,
    Clock,
    MapPin,
    Users,
    Award,
    Camera,
    Image as ImageIcon,
    Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from "@/redux/api/employee/employeeApi";
import Image from "next/image";
import { useAddThumbnailMutation } from "@/redux/features/file/fileApi";

interface Employee {
    id?: number;
    employeeId: string;
    name: string;
    email: string;
    phone: string;
    designation: string;
    department: string;
    joiningDate: string;
    shift: 'morning' | 'evening' | 'night';
    status: 'active' | 'inactive';
    biometricId?: string;
    address?: string;
    profileImage?: string;
}

interface AddEditEmployeeModalProps {
    employeeData?: Employee | null;
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
}

const AddEditEmployeeModal: React.FC<AddEditEmployeeModalProps> = ({
    employeeData,
    isOpen,
    onClose
}) => {
    const { theme } = useTheme();
    console.log(ImageIcon);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string>("");

    const [formData, setFormData] = useState<Partial<Employee>>({
        employeeId: "",
        name: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        joiningDate: "",
        shift: "morning",
        status: "active",
        biometricId: "",
        address: "",
        profileImage: "",
    });

    const [createEmployee] = useCreateEmployeeMutation();
    const [updateEmployee] = useUpdateEmployeeMutation();
    const [addThumbnail] = useAddThumbnailMutation();

    useEffect(() => {
        if (employeeData) {
            setFormData({
                ...employeeData,
                joiningDate: employeeData.joiningDate?.split('T')[0] || "",
                profileImage: employeeData.profileImage || "",
            });
            setUploadedImage(employeeData.profileImage || "");
        } else {
            setFormData({
                employeeId: "",
                name: "",
                email: "",
                phone: "",
                designation: "",
                department: "",
                joiningDate: "",
                shift: "morning",
                status: "active",
                biometricId: "",
                address: "",
                profileImage: "",
            });
            setUploadedImage("");
        }
    }, [employeeData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateEmployeeId = () => {
        const prefix = "EMP";
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}${year}${random}`;
    };

    const handleImageUpload = async (file: File) => {
        try {
            setIsUploading(true);
            
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);
            
            const response = await addThumbnail(uploadFormData).unwrap();
            
            if (response.success && response.data && response.data[0]) {
                const imageUrl = response.data[0];
                setUploadedImage(imageUrl);
                setFormData(prev => ({ ...prev, profileImage: imageUrl }));
                toast.success("Profile photo uploaded successfully!");
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        } else {
            toast.error("Please upload an image file");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const removeImage = () => {
        setUploadedImage("");
        setFormData(prev => ({ ...prev, profileImage: "" }));
        toast.success("Profile photo removed");
    };

    const validateForm = () => {
        if (!formData.name?.trim()) {
            toast.error("Employee name is required");
            return false;
        }
        if (!formData.email?.trim()) {
            toast.error("Email is required");
            return false;
        }
        if (!formData.phone?.trim()) {
            toast.error("Phone number is required");
            return false;
        }
        if (!formData.designation?.trim()) {
            toast.error("Designation is required");
            return false;
        }
        if (!formData.department?.trim()) {
            toast.error("Department is required");
            return false;
        }
        if (!formData.joiningDate) {
            toast.error("Joining date is required");
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        // Phone validation
        const phoneRegex = /^(?:\+88|01)?\d{11}$/;
        if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
            toast.error("Please enter a valid Bangladeshi phone number");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const submitData = {
                ...formData,
                employeeId: formData.employeeId || generateEmployeeId(),
            };

            if (employeeData?.id) {
                await updateEmployee({
                    id: employeeData.id,
                    data: submitData
                }).unwrap();
                toast.success("Employee updated successfully!");
            } else {
                await createEmployee(submitData).unwrap();
                toast.success("Employee created successfully!");
            }

            onClose(true);
        } catch (error) {
            toast.error(error?.data?.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const departments = [
        "HR", "IT", "Finance", "Marketing", "Sales", 
        "Operations", "Customer Support", "Administration"
    ];

    const designations = [
        "Manager", "Senior Executive", "Executive", 
        "Junior Executive", "Intern", "Team Lead", 
        "Director", "Assistant Manager"
    ];

    const shifts = [
        { value: "morning", label: "Morning (9:00 AM - 6:00 PM)" },
        { value: "evening", label: "Evening (3:00 PM - 12:00 AM)" },
        { value: "night", label: "Night (10:00 PM - 7:00 AM)" }
    ];

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
                    className={`rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl ${
                        theme === 'dark'
                            ? 'bg-gray-900 border-gray-800'
                            : 'bg-white border-gray-100'
                    } border`}
                >
                    {/* Header - Fixed */}
                    <div className={`flex-shrink-0 p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                                    <User className={`w-6 h-6 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {employeeData ? "Edit Employee" : "Add New Employee"}
                                    </h2>
                                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {employeeData 
                                            ? `Update information for ${employeeData.name}` 
                                            : "Register a new employee to the system"}
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

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Profile Photo Upload */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Profile Photo
                                </label>
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                                        uploadedImage
                                            ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-900/10"
                                            : "border-gray-300 hover:border-emerald-400 dark:border-gray-700 dark:hover:border-emerald-500"
                                    }`}
                                >
                                    {uploadedImage ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                    <Image
                                                        src={uploadedImage}
                                                        alt="Profile"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        Profile Photo
                                                    </p>
                                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Uploaded successfully
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                            >
                                                <X className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Camera className="mx-auto w-10 h-10 text-gray-400 mb-2" />
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Drag & drop or{' '}
                                                <label className="text-emerald-500 hover:text-emerald-600 cursor-pointer">
                                                    browse
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileSelect}
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                            </p>
                                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Support: JPG, PNG, GIF (Max 5MB)
                                            </p>
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-xl flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Employee ID and Name */}
                           
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Md. Rahim Uddin"
                                            className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                            } border`}
                                            required
                                        />
                                    </div>
                                </div>
                           

                            {/* Email and Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="rahim@company.com"
                                            className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                            } border`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="01712345678"
                                            className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                            } border`}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Department and Designation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Department *
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-700 text-white'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900'
                                            } border`}
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Designation *
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <select
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-700 text-white'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900'
                                            } border`}
                                            required
                                        >
                                            <option value="">Select Designation</option>
                                            {designations.map(desig => (
                                                <option key={desig} value={desig}>{desig}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Joining Date and Shift */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Joining Date *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="date"
                                            name="joiningDate"
                                            value={formData.joiningDate}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-700 text-white'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900'
                                            } border`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Work Shift *
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <select
                                            name="shift"
                                            value={formData.shift}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-700 text-white'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900'
                                            } border`}
                                            required
                                        >
                                            {shifts.map(shift => (
                                                <option key={shift.value} value={shift.value}>{shift.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Biometric ID */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Biometric ID (Optional)
                                </label>
                                <div className="relative">
                                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        name="biometricId"
                                        value={formData.biometricId || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter device ID or fingerprint ID"
                                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        } border`}
                                    />
                                </div>
                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    ID used in attendance device (if applicable)
                                </p>
                            </div>

                            {/* Address */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Address
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <textarea
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="House #, Road #, Area, City"
                                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 resize-none ${
                                            theme === 'dark'
                                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        } border`}
                                    />
                                </div>
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
                                            name="status"
                                            value="active"
                                            checked={formData.status === 'active'}
                                            onChange={handleInputChange}
                                            className="text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Active
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="inactive"
                                            checked={formData.status === 'inactive'}
                                            onChange={handleInputChange}
                                            className="text-red-500 focus:ring-red-500"
                                        />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Inactive
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer - Fixed with Buttons */}
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
                                    {employeeData ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    {employeeData ? "Update Employee" : "Create Employee"}
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

export default AddEditEmployeeModal;