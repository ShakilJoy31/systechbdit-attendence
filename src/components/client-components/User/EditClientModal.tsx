// components/clients/EditClientModal.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    X,
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Camera,
    Loader2,
    AlertCircle,
    CheckCircle,
    XCircle,
    Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useThemeContext';
import Image from 'next/image';
import { Client } from './ClientCard';
import { useAddThumbnailMutation } from '@/redux/features/file/fileApi';
import { useUpdateClientMutation } from '@/redux/api/authentication/authApi';

// Types
interface EditClientModalProps {
    client: Client;
    onClose: () => void;
    onSuccess: () => void;
}

// Update schema for edit (all fields optional)
const editClientSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
    email: z.string().email('Please enter a valid email address').optional(),
    mobileNo: z.string().min(11, 'Please enter a valid mobile number').optional(),
    dateOfBirth: z.string().optional(),
    sex: z.enum(['male', 'female', 'other']).optional(),
    nidOrPassportNo: z.string().min(10, 'NID/Passport number must be at least 10 characters').optional(),
    nidPhotoFrontSide: z.string().url().optional().or(z.literal('')),
    nidPhotoBackSide: z.string().url().optional().or(z.literal('')),
    photo: z.string().url().optional().or(z.literal('')),
    status: z.enum(['active', 'pending', 'inactive']).optional(),
    role: z.enum(['client', 'admin', 'super_admin']).optional(),
});

type EditClientFormData = z.infer<typeof editClientSchema>;

export default function EditClientModal({ client, onClose, onSuccess }: EditClientModalProps) {
    const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
    const { theme } = useTheme();
    const [addThumbnail] = useAddThumbnailMutation();

    const [isUploading, setIsUploading] = useState({
        photo: false,
        nidFront: false,
        nidBack: false,
    });

    const [uploadedFiles, setUploadedFiles] = useState({
        photo: client.photo || '',
        nidFront: client.nidPhoto?.frontSide || '',
        nidBack: client.nidPhoto?.backSide || '',
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<EditClientFormData>({
        resolver: zodResolver(editClientSchema),
        defaultValues: {
            fullName: client.fullName,
            email: client.email,
            mobileNo: client.mobileNo,
            dateOfBirth: client.dateOfBirth,
            sex: client.sex as 'male' | 'female' | 'other',
            nidOrPassportNo: client.nidOrPassportNo,
            nidPhotoFrontSide: client.nidPhoto?.frontSide || '',
            nidPhotoBackSide: client.nidPhoto?.backSide || '',
            photo: client.photo || '',
            status: client.status,
            role: client.role as 'client' | 'admin' | 'super_admin',
        },
    });

    const handleFileUpload = async (file: File, type: 'photo' | 'nidFront' | 'nidBack') => {
        try {
            setIsUploading(prev => ({ ...prev, [type]: true }));

            const formData = new FormData();
            formData.append('image', file);

            const response = await addThumbnail(formData).unwrap();

            if (response.success && response.data && response.data[0]) {
                const fileUrl = response.data[0];

                setUploadedFiles(prev => ({ ...prev, [type]: fileUrl }));

                if (type === 'photo') {
                    setValue('photo', fileUrl);
                } else if (type === 'nidFront') {
                    setValue('nidPhotoFrontSide', fileUrl);
                } else if (type === 'nidBack') {
                    setValue('nidPhotoBackSide', fileUrl);
                }

                toast.success(`${type === 'photo' ? 'Photo' : 'Document'} uploaded successfully!`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed. Please try again.');
        } finally {
            setIsUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'nidFront' | 'nidBack') => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file, type);
        }
    };

    const onSubmit = async (data: EditClientFormData) => {
        try {
            // Filter out undefined values to only send changed fields
            const updatedData = Object.fromEntries(
                Object.entries(data).filter(([value]) => value !== undefined)
            );

            // Make the API call
            const response = await updateClient({
                id: client.id,
                ...updatedData
            }).unwrap();

            if (response.message === 'Client updated successfully!') {
                toast.success(response.message);
                onSuccess();
                onClose();
            } else {
                throw new Error(response.message || 'Failed to update client');
            }
        } catch (error) {
            console.error('Update error:', error);
            const errorMessage = error?.data?.message || error?.message || 'Failed to update client';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800'
                    : 'bg-white border-gray-200'
                    } border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
            >
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Edit User
                            </h2>
                            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Update information for {client.fullName}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                ? 'hover:bg-gray-800'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <X className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Status and Role Section */}
                        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Account Status & Role
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Status Selection */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Account Status
                                    </label>
                                    <div className="flex gap-3">
                                        {['active', 'pending', 'inactive'].map((status) => (
                                            <label
                                                key={status}
                                                className={`flex-1 cursor-pointer`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={status}
                                                    {...register('status')}
                                                    className="hidden"
                                                />
                                                <div className={`
                                                    p-3 rounded-lg border-2 text-center transition-all
                                                    ${watch('status') === status
                                                        ? status === 'active'
                                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                            : status === 'pending'
                                                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                                                : 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                                                        : theme === 'dark'
                                                            ? 'border-gray-700 hover:border-gray-600'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }
                                                `}>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {status === 'active' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                                        {status === 'pending' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                                                        {status === 'inactive' && <XCircle className="w-4 h-4 text-rose-500" />}
                                                        <span className={`text-sm font-medium capitalize
                                                            ${watch('status') === status
                                                                ? status === 'active'
                                                                    ? 'text-emerald-700 dark:text-emerald-300'
                                                                    : status === 'pending'
                                                                        ? 'text-amber-700 dark:text-amber-300'
                                                                        : 'text-rose-700 dark:text-rose-300'
                                                                : theme === 'dark'
                                                                    ? 'text-gray-400'
                                                                    : 'text-gray-600'
                                                            }
                                                        `}>
                                                            {status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        User Role
                                    </label>
                                    <select
                                        {...register('role')}
                                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                                            ${theme === 'dark'
                                                ? 'bg-gray-900 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500'
                                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400'
                                            }`}
                                    >
                                        <option value="client">Client</option>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Personal Information
                            </h3>

                            <div className="space-y-4">
                                {/* Profile Photo */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Profile Photo
                                    </label>
                                    <div className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200
                                        ${uploadedFiles.photo
                                            ? 'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10'
                                            : theme === 'dark'
                                                ? 'border-gray-700 hover:border-blue-500'
                                                : 'border-gray-300 hover:border-blue-400'
                                        }`}>
                                        {uploadedFiles.photo ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                        <Image
                                                            src={uploadedFiles.photo}
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
                                                <label className="cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                    <Camera className="w-5 h-5 text-blue-500" />
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileSelect(e, 'photo')}
                                                        disabled={isUploading.photo}
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Camera className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Drag & drop or{' '}
                                                    <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                                                        browse
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileSelect(e, 'photo')}
                                                            disabled={isUploading.photo}
                                                        />
                                                    </label>
                                                </p>
                                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    Support: JPG, PNG, GIF (Max 5MB)
                                                </p>
                                            </div>
                                        )}
                                        {isUploading.photo && (
                                            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className={`w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                        </div>
                                        <input
                                            {...register('fullName')}
                                            type="text"
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                                                ${theme === 'dark'
                                                    ? 'bg-gray-900 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400'
                                                }`}
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="mt-1 text-sm text-rose-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email and Phone */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className={`w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                            </div>
                                            <input
                                                {...register('email')}
                                                type="email"
                                                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                                                    ${theme === 'dark'
                                                        ? 'bg-gray-900 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500'
                                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400'
                                                    }`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-rose-500">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Mobile Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className={`w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                            </div>
                                            <input
                                                {...register('mobileNo')}
                                                type="tel"
                                                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                                                    ${theme === 'dark'
                                                        ? 'bg-gray-900 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500'
                                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400'
                                                    }`}
                                            />
                                        </div>
                                        {errors.mobileNo && (
                                            <p className="mt-1 text-sm text-rose-500">{errors.mobileNo.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Date of Birth and Gender */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Date of Birth
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className={`w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                            </div>
                                            <input
                                                {...register('dateOfBirth')}
                                                type="date"
                                                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                                                    ${theme === 'dark'
                                                        ? 'bg-gray-900 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500'
                                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Gender
                                        </label>
                                        <select
                                            {...register('sex')}
                                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                                                ${theme === 'dark'
                                                    ? 'bg-gray-900 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400'
                                                }`}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Identity Documents */}
                        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Identity Documents
                            </h3>

                            <div className="space-y-4">
                                {/* NID/Passport Number */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        NID / Passport Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Shield className={`w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                        </div>
                                        <input
                                            {...register('nidOrPassportNo')}
                                            type="text"
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                                                ${theme === 'dark'
                                                    ? 'bg-gray-900 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* NID Front Side */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        NID Front Side
                                    </label>
                                    <div className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200
                                        ${uploadedFiles.nidFront
                                            ? 'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10'
                                            : theme === 'dark'
                                                ? 'border-gray-700 hover:border-blue-500'
                                                : 'border-gray-300 hover:border-blue-400'
                                        }`}>
                                        {uploadedFiles.nidFront ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                        <Image
                                                            src={uploadedFiles.nidFront}
                                                            alt="NID Front"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                            NID Front Side
                                                        </p>
                                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            Uploaded successfully
                                                        </p>
                                                    </div>
                                                </div>
                                                <label className="cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                    <Camera className="w-5 h-5 text-blue-500" />
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileSelect(e, 'nidFront')}
                                                        disabled={isUploading.nidFront}
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Camera className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Click to upload or drag and drop
                                                </p>
                                                <label className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                                                    Browse Files
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileSelect(e, 'nidFront')}
                                                        disabled={isUploading.nidFront}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                        {isUploading.nidFront && (
                                            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* NID Back Side */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        NID Back Side
                                    </label>
                                    <div className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200
                                        ${uploadedFiles.nidBack
                                            ? 'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10'
                                            : theme === 'dark'
                                                ? 'border-gray-700 hover:border-blue-500'
                                                : 'border-gray-300 hover:border-blue-400'
                                        }`}>
                                        {uploadedFiles.nidBack ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                        <Image
                                                            src={uploadedFiles.nidBack}
                                                            alt="NID Back"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                            NID Back Side
                                                        </p>
                                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            Uploaded successfully
                                                        </p>
                                                    </div>
                                                </div>
                                                <label className="cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                    <Camera className="w-5 h-5 text-blue-500" />
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileSelect(e, 'nidBack')}
                                                        disabled={isUploading.nidBack}
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Camera className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Click to upload or drag and drop
                                                </p>
                                                <label className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                                                    Browse Files
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileSelect(e, 'nidBack')}
                                                        disabled={isUploading.nidBack}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                        {isUploading.nidBack && (
                                            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`px-6 py-3 rounded-lg border transition-colors
                                    ${theme === 'dark'
                                        ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isUpdating}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting || isUpdating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}