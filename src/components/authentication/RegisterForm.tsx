'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Eye, EyeOff, Lock, Mail, X, Loader2, AlertCircle, Shield,
    Smartphone, User, Calendar, Phone, Camera, Check,
    ArrowLeft, ArrowRight, UserCircle, CreditCard,
    Image as ImageIcon, CreditCard as PaymentIcon, DollarSign,
    CheckCircle2, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProcessPaymentMutation, useRegisterClientMutation } from '@/redux/api/authentication/authApi';
import { useAddThumbnailMutation } from '@/redux/features/file/fileApi';
import { shareWithCookies } from '@/utils/helper/shareWithCookies';
import { appConfiguration } from '@/utils/constant/appConfiguration';


// Schema validation for multi-step form
const personalInfoSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    mobileNo: z.string().min(11, 'Please enter a valid mobile number'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    sex: z.string().min(1, 'Please select your gender'),
});

const identitySchema = z.object({
    nidOrPassportNo: z.string().min(10, 'NID/Passport number must be at least 10 characters'),
    nidPhotoFrontSide: z.string().url('Please upload front side of NID').optional().or(z.literal('')),
    nidPhotoBackSide: z.string().url('Please upload back side of NID').optional().or(z.literal('')),
});

const accountSchema = z.object({
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    photo: z.string().url('Please upload a profile photo').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Combined schema for final validation
const registerSchema = personalInfoSchema.merge(identitySchema).merge(accountSchema);

// Define the type here - BEFORE the component
type RegisterFormData = z.infer<typeof registerSchema>;

// Steps configuration
const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Identity Documents', icon: CreditCard },
    { id: 3, name: 'Account Setup', icon: Lock },
];

export default function RegisterForm() {
    const [processPayment] = useProcessPaymentMutation();
    const router = useRouter();
    const [registerClient, { isLoading: registerLoading }] = useRegisterClientMutation();
    const [addThumbnail] = useAddThumbnailMutation();

    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [animateBg, setAnimateBg] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<{
        photo?: string;
        nidFront?: string;
        nidBack?: string;
    }>({});

    // New state for payment modal
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [registeredUserData, setRegisteredUserData] = useState(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isUploading, setIsUploading] = useState({
        photo: false,
        nidFront: false,
        nidBack: false,
    });

    // Handle theme mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
        setValue,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            mobileNo: '',
            dateOfBirth: '',
            sex: undefined,
            nidOrPassportNo: '',
            nidPhotoFrontSide: '',
            nidPhotoBackSide: '',
            password: '',
            confirmPassword: '',
            photo: '',
        },
        mode: 'onChange',
    });

    // Background animation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimateBg(prev => !prev);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

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

    const handleDrop = (e: React.DragEvent, type: 'photo' | 'nidFront' | 'nidBack') => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
            handleFileUpload(file, type);
        } else {
            toast.error('Please upload an image or PDF file');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'nidFront' | 'nidBack') => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file, type);
        }
    };

    const removeFile = (type: 'photo' | 'nidFront' | 'nidBack') => {
        setUploadedFiles(prev => ({ ...prev, [type]: undefined }));
        if (type === 'photo') {
            setValue('photo', '');
        } else if (type === 'nidFront') {
            setValue('nidPhotoFrontSide', '');
        } else if (type === 'nidBack') {
            setValue('nidPhotoBackSide', '');
        }
    };

    const nextStep = async () => {
        let isValid = false;

        if (currentStep === 1) {
            isValid = await trigger(['fullName', 'email', 'mobileNo', 'dateOfBirth', 'sex']);
        } else if (currentStep === 2) {
            isValid = await trigger(['nidOrPassportNo']);
        }

        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handlePayment = async () => {
        setIsProcessingPayment(true);

        try {
            const response = await processPayment({
                userId: registeredUserData?.id,
                amount: 50,
                paymentMethod: 'sslcommerz',
                payload: {
                    fullName: registeredUserData?.fullName,
                    photo: registeredUserData?.photo || '',
                    dateOfBirth: registeredUserData?.dateOfBirth,
                    age: registeredUserData?.age,
                    sex: registeredUserData?.sex,
                    nidOrPassportNo: registeredUserData?.nidOrPassportNo,
                    nidPhotoFrontSide: registeredUserData?.nidPhotoFrontSide || '',
                    nidPhotoBackSide: registeredUserData?.nidPhotoBackSide || '',
                    mobileNo: registeredUserData?.mobileNo,
                    email: registeredUserData?.email,
                    password: registeredUserData?.password,
                    role: 'client',
                }
            }).unwrap();

            console.log('Payment Response:', response); // You can see the response here

            if (response.success && response.data?.gatewayUrl) {
                window.location.href = response.data.gatewayUrl;
            } else {
                throw new Error(response.message || 'Payment initiation failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error?.data?.message || error?.message || 'Payment failed. Please try again.');
            setIsProcessingPayment(false);
        }
    };

    const onSubmit = async (data: RegisterFormData) => {
        // Manual validation
        if (data.password !== data.confirmPassword) {
            toast.error('Opps! Passwords do not match!');
            return;
        }
        setErrorMessage(null);
        try {
            // Calculate age from date of birth
            const birthDate = new Date(data.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            const payload = {
                fullName: data.fullName,
                photo: data.photo || '',
                dateOfBirth: data.dateOfBirth,
                age: age,
                sex: data.sex,
                nidOrPassportNo: data.nidOrPassportNo,
                nidPhotoFrontSide: data.nidPhotoFrontSide || '',
                nidPhotoBackSide: data.nidPhotoBackSide || '',
                mobileNo: data.mobileNo,
                email: data.email,
                password: data.password,
                status: 'pending', // Set as pending initially
                role: 'client',
            };

            const response = await registerClient(payload).unwrap();

            if (response.success) {
                // Set tokens in cookies if they're provided in the response
                if (response.data?.tokens?.accessToken) {
                    const { accessToken, refreshToken } = response.data.tokens;

                    // Set tokens in cookies using shareWithCookies
                    const tokenName = `${appConfiguration.appCode}token`;
                    const refreshTokenName = `${appConfiguration.appCode}refreshToken`;

                    // Set tokens with 1 day expiry for access token, 7 days for refresh token
                    shareWithCookies("set", tokenName, 1440, accessToken); // 1 day
                    shareWithCookies("set", refreshTokenName, 10080, refreshToken); // 7 days

                    // Verify cookies were set
                    const verifyAccessToken = shareWithCookies("get", tokenName, 0);
                    const verifyRefreshToken = shareWithCookies("get", refreshTokenName, 0);

                    console.log('Registration cookies set verification:', {
                        accessTokenSet: !!verifyAccessToken,
                        refreshTokenSet: !!verifyRefreshToken
                    });
                }

                // Check account status and show appropriate message
                if (response.data?.accountInfo?.status === 'pending') {
                    toast.success(response.data.accountInfo.message || 'Registration successful! Your account is pending approval.');

                    // Store user data but don't redirect to dashboard
                    setRegisteredUserData(response.data || payload);
                    setShowPaymentModal(true);
                } else {
                    // If account is active immediately (unlikely with pending status)
                    toast.success('Registration successful!');

                    // Redirect based on user role
                    const userRole = response.data?.role?.toLowerCase();
                    if (userRole === 'admin' || userRole === 'super_admin') {
                        router.push(`/redirect?to=/admin/dashboard`);
                    } else {
                        router.push(`/redirect?to=/dashboard`);
                    }
                }
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error?.data?.message || error?.message || 'Registration failed';
            setErrorMessage(errorMessage);
            toast.error(errorMessage);
        }
    };

    // Don't render theme-dependent UI until mounted
    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black p-4">
                <div className="animate-pulse">
                    <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                    <div className="h-96 w-96 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={cn(
                "min-h-screen mt-16 flex items-center justify-center p-4 transition-colors duration-300",
                "bg-gradient-to-br from-gray-50 via-white to-blue-50",
                "dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black"
            )}>
                {/* Animated background elements - keep your existing code */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -inset-2.5 opacity-30 dark:opacity-50">
                        <div className={cn(
                            "absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob",
                            "bg-gradient-to-r from-blue-200 to-purple-200",
                            animateBg && "animate-pulse"
                        )} />
                        <div className={cn(
                            "absolute top-1/3 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000",
                            "bg-gradient-to-r from-green-200 to-blue-200",
                            animateBg && "animate-pulse"
                        )} />
                        <div className={cn(
                            "absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000",
                            "bg-gradient-to-r from-pink-200 to-yellow-200",
                            animateBg && "animate-pulse"
                        )} />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-2xl"
                >
                    {/* Keep all your existing form JSX exactly as it is */}
                    <div className={cn(
                        "rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300",
                        "bg-white/80 border border-gray-200/50",
                        "dark:bg-gray-900/80 dark:border-gray-800"
                    )}>
                        {/* Header */}
                        <div className="p-8 pb-6">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col items-center mb-6"
                            >
                                <div className="relative mb-4">
                                    <div className={cn(
                                        "absolute inset-0 rounded-full blur-lg opacity-75",
                                        "bg-gradient-to-r from-blue-400 to-purple-500",
                                        "dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-600"
                                    )} />
                                    <div className={cn(
                                        "relative w-16 h-16 rounded-full flex items-center justify-center border-2",
                                        "bg-white border-gray-200",
                                        "dark:bg-gray-900 dark:border-gray-800"
                                    )}>
                                        <UserCircle className={cn(
                                            "w-8 h-8",
                                            "text-blue-500",
                                            "dark:text-blue-400"
                                        )} />
                                    </div>
                                </div>
                                <h1 className={cn(
                                    "text-2xl font-bold mb-2",
                                    "text-gray-900",
                                    "dark:text-white"
                                )}>
                                    Create Account
                                </h1>
                                <p className={cn(
                                    "text-sm",
                                    "text-gray-600",
                                    "dark:text-gray-400"
                                )}>
                                    Join us today! Please fill in your information
                                </p>
                            </motion.div>

                            {/* Progress Steps */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    {steps.map((step, index) => (
                                        <div key={step.id} className="flex items-center">
                                            <div className="relative">
                                                <div
                                                    className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                                                        currentStep > step.id
                                                            ? "bg-green-500 text-white"
                                                            : currentStep === step.id
                                                                ? "bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900"
                                                                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                    )}
                                                >
                                                    {currentStep > step.id ? (
                                                        <Check className="w-5 h-5" />
                                                    ) : (
                                                        <step.icon className="w-5 h-5" />
                                                    )}
                                                </div>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div
                                                    className={cn(
                                                        "w-auto lg:w-60 h-1 rounded transition-all duration-200",
                                                        currentStep > step.id + 1
                                                            ? "bg-green-500"
                                                            : currentStep > step.id
                                                                ? "bg-blue-500"
                                                                : "bg-gray-200 dark:bg-gray-700"
                                                    )}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2">
                                    {steps.map((step) => (
                                        <span
                                            key={step.id}
                                            className={cn(
                                                "text-xs font-medium",
                                                currentStep >= step.id
                                                    ? "text-gray-900 dark:text-white"
                                                    : "text-gray-400 dark:text-gray-500"
                                            )}
                                        >
                                            {step.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {errorMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={cn(
                                            "mb-4 p-3 rounded-lg border",
                                            "bg-red-50/50 border-red-200",
                                            "dark:bg-red-500/10 dark:border-red-500/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm">{errorMessage}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit, (errors) => {
                                if (errors.confirmPassword) {
                                    toast.error(errors.confirmPassword.message);
                                }
                            })} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {/* Step 1: Personal Information */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-4"
                                        >
                                            {/* Profile Photo Upload */}
                                            <div>
                                                <label className={cn(
                                                    "block text-sm font-medium mb-2",
                                                    "text-gray-700",
                                                    "dark:text-gray-300"
                                                )}>
                                                    Profile Photo
                                                </label>
                                                <div
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => handleDrop(e, 'photo')}
                                                    className={cn(
                                                        "relative border-2 border-dashed rounded-lg p-4 transition-all duration-200",
                                                        uploadedFiles.photo
                                                            ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10"
                                                            : "border-gray-300 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-500"
                                                    )}
                                                >
                                                    {uploadedFiles.photo ? (
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                                    <Image
                                                                        src={uploadedFiles.photo}
                                                                        alt="Profile"
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        Profile Photo
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Uploaded successfully
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile('photo')}
                                                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                                            >
                                                                <X className="w-4 h-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <Camera className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
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
                                                            <p className="text-xs text-gray-500 mt-1">
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
                                                <label className={cn(
                                                    "block text-sm font-medium mb-2",
                                                    "text-gray-700",
                                                    "dark:text-gray-300"
                                                )}>
                                                    Full Name
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User className={cn(
                                                            "w-5 transition-colors",
                                                            "text-gray-400 group-focus-within:text-blue-500",
                                                            "dark:text-gray-500 dark:group-focus-within:text-blue-400"
                                                        )} />
                                                    </div>
                                                    <input
                                                        {...register('fullName')}
                                                        type="text"
                                                        disabled={registerLoading}
                                                        className={cn(
                                                            "block w-full pl-10 pr-3 py-3 rounded-lg placeholder-gray-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                                            "bg-white/70 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                            "dark:bg-gray-800/70 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
                                                        )}
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                {errors.fullName && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors.fullName.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className={cn(
                                                    "block text-sm font-medium mb-2",
                                                    "text-gray-700",
                                                    "dark:text-gray-300"
                                                )}>
                                                    Email Address
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Mail className={cn(
                                                            "w-5 transition-colors",
                                                            "text-gray-400 group-focus-within:text-blue-500",
                                                            "dark:text-gray-500 dark:group-focus-within:text-blue-400"
                                                        )} />
                                                    </div>
                                                    <input
                                                        {...register('email')}
                                                        type="email"
                                                        disabled={registerLoading}
                                                        className={cn(
                                                            "block w-full pl-10 pr-3 py-3 rounded-lg placeholder-gray-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                                            "bg-white/70 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                            "dark:bg-gray-800/70 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
                                                        )}
                                                        placeholder="you@example.com"
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors.email.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Mobile Number */}
                                            <div>
                                                <label className={cn(
                                                    "block text-sm font-medium mb-2",
                                                    "text-gray-700",
                                                    "dark:text-gray-300"
                                                )}>
                                                    Mobile Number
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Phone className={cn(
                                                            "w-5 transition-colors",
                                                            "text-gray-400 group-focus-within:text-blue-500",
                                                            "dark:text-gray-500 dark:group-focus-within:text-blue-400"
                                                        )} />
                                                    </div>
                                                    <input
                                                        {...register('mobileNo')}
                                                        type="tel"
                                                        disabled={registerLoading}
                                                        className={cn(
                                                            "block w-full pl-10 pr-3 py-3 rounded-lg placeholder-gray-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                                            "bg-white/70 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                            "dark:bg-gray-800/70 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
                                                        )}
                                                        placeholder="013XXXXXXXX"
                                                    />
                                                </div>
                                                {errors.mobileNo && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors.mobileNo.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Date of Birth and Gender */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className={cn(
                                                        "block text-sm font-medium mb-2",
                                                        "text-gray-700",
                                                        "dark:text-gray-300"
                                                    )}>
                                                        Date of Birth
                                                    </label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Calendar className={cn(
                                                                "w-5 transition-colors",
                                                                "text-gray-400 group-focus-within:text-blue-500",
                                                                "dark:text-gray-500 dark:group-focus-within:text-blue-400"
                                                            )} />
                                                        </div>
                                                        <input
                                                            {...register('dateOfBirth')}
                                                            type="date"
                                                            disabled={registerLoading}
                                                            className={cn(
                                                                "block w-full pl-10 pr-3 py-3 rounded-lg placeholder-gray-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                                                "bg-white/70 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                                "dark:bg-gray-800/70 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
                                                            )}
                                                        />
                                                    </div>
                                                    {errors.dateOfBirth && (
                                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                            {errors.dateOfBirth.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className={cn(
                                                        "block text-sm font-medium mb-2",
                                                        "text-gray-700",
                                                        "dark:text-gray-300"
                                                    )}>
                                                        Gender
                                                    </label>
                                                    <select
                                                        {...register('sex')}
                                                        disabled={registerLoading}
                                                        className={cn(
                                                            "block w-full px-3 py-3 rounded-lg focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                                            "bg-white/70 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                            "dark:bg-gray-800/70 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
                                                        )}
                                                    >
                                                        <option value="">Select gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                    {errors.sex && (
                                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                            {errors.sex.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Identity Documents */}
                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-4"
                                        >
                                            {/* NID/Passport Number */}
                                            <div>
                                                <label className={cn(
                                                    "block text-sm font-medium mb-2",
                                                    "text-gray-700",
                                                    "dark:text-gray-300"
                                                )}>
                                                    NID / Passport Number
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <CreditCard className={cn(
                                                            "w-5 transition-colors",
                                                            "text-gray-400 group-focus-within:text-blue-500",
                                                            "dark:text-gray-500 dark:group-focus-within:text-blue-400"
                                                        )} />
                                                    </div>
                                                    <input
                                                        {...register('nidOrPassportNo')}
                                                        type="text"
                                                        disabled={registerLoading}
                                                        className={cn(
                                                            "block w-full pl-10 pr-3 py-3 rounded-lg placeholder-gray-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                                            "bg-white/70 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                            "dark:bg-gray-800/70 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
                                                        )}
                                                        placeholder="Enter your NID or Passport number"
                                                    />
                                                </div>
                                                {errors.nidOrPassportNo && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                        {errors.nidOrPassportNo.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* NID Front Side */}
                                            <div>
                                                <label className={cn(
                                                    "block text-sm font-medium mb-2",
                                                    "text-gray-700",
                                                    "dark:text-gray-300"
                                                )}>
                                                    NID Front Side
                                                </label>
                                                <div
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => handleDrop(e, 'nidFront')}
                                                    className={cn(
                                                        "relative border-2 border-dashed rounded-lg p-4 transition-all duration-200",
                                                        uploadedFiles.nidFront
                                                            ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10"
                                                            : "border-gray-300 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-500"
                                                    )}
                                                >
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
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        NID Front Side
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Uploaded successfully
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile('nidFront')}
                                                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                                            >
                                                                <X className="w-4 h-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <ImageIcon className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                Drag & drop or{' '}
                                                                <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                                                                    browse
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*,application/pdf"
                                                                        onChange={(e) => handleFileSelect(e, 'nidFront')}
                                                                        disabled={isUploading.nidFront}
                                                                    />
                                                                </label>
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Support: JPG, PNG, PDF (Max 10MB)
                                                            </p>
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
                                                <label className={cn(
                                                    "block text-sm font-medium mb-2",
                                                    "text-gray-700",
                                                    "dark:text-gray-300"
                                                )}>
                                                    NID Back Side
                                                </label>
                                                <div
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => handleDrop(e, 'nidBack')}
                                                    className={cn(
                                                        "relative border-2 border-dashed rounded-lg p-4 transition-all duration-200",
                                                        uploadedFiles.nidBack
                                                            ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10"
                                                            : "border-gray-300 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-500"
                                                    )}
                                                >
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
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        NID Back Side
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Uploaded successfully
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile('nidBack')}
                                                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                                            >
                                                                <X className="w-4 h-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <ImageIcon className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                Drag & drop or{' '}
                                                                <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                                                                    browse
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*,application/pdf"
                                                                        onChange={(e) => handleFileSelect(e, 'nidBack')}
                                                                        disabled={isUploading.nidBack}
                                                                    />
                                                                </label>
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Support: JPG, PNG, PDF (Max 10MB)
                                                            </p>
                                                        </div>
                                                    )}
                                                    {isUploading.nidBack && (
                                                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
                                                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Account Setup */}
                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-4"
                                        >
                                            {/* Password */}
                                            <div>
                                                <label className={cn(
                                                    "block text-sm font-medium mb-2",
                                                    "text-gray-700",
                                                    "dark:text-gray-300"
                                                )}>
                                                    Password
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className={cn(
                                                            "w-5 transition-colors",
                                                            "text-gray-400 group-focus-within:text-blue-500",
                                                            "dark:text-gray-500 dark:group-focus-within:text-blue-400"
                                                        )} />
                                                    </div>
                                                    <input
                                                        {...register('password')}
                                                        type={showPassword ? 'text' : 'password'}
                                                        disabled={registerLoading}
                                                        className={cn(
                                                            "block w-full pl-10 pr-10 py-3 rounded-lg placeholder-gray-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                                            "bg-white/70 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                            "dark:bg-gray-800/70 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
                                                        )}
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                                                        ) : (
                                                            <Eye className="w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.password && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                        {errors.password.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Confirm Password */}
                                            <div>
                                                <label className={cn(
                                                    "block text-sm font-medium mb-2",
                                                    "text-gray-700",
                                                    "dark:text-gray-300"
                                                )}>
                                                    Confirm Password
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className={cn(
                                                            "w-5 transition-colors",
                                                            "text-gray-400 group-focus-within:text-blue-500",
                                                            "dark:text-gray-500 dark:group-focus-within:text-blue-400"
                                                        )} />
                                                    </div>
                                                    <input
                                                        {...register('confirmPassword')}
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        disabled={registerLoading}
                                                        className={cn(
                                                            "block w-full pl-10 pr-10 py-3 rounded-lg placeholder-gray-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                                            "bg-white/70 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                            "dark:bg-gray-800/70 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
                                                        )}
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                                                        ) : (
                                                            <Eye className="w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                        {errors.confirmPassword.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Password Strength Indicator */}
                                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Password Requirements:
                                                </p>
                                                <ul className="space-y-1 text-xs">
                                                    <li className="flex items-center gap-2">
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            watch('password')?.length >= 6 ? "bg-green-500" : "bg-gray-300"
                                                        )} />
                                                        <span className={watch('password')?.length >= 6 ? "text-green-600" : "text-gray-500"}>
                                                            At least 6 characters
                                                        </span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            /[A-Z]/.test(watch('password') || '') ? "bg-green-500" : "bg-gray-300"
                                                        )} />
                                                        <span className={/[A-Z]/.test(watch('password') || '') ? "text-green-600" : "text-gray-500"}>
                                                            At least one uppercase letter
                                                        </span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            /[0-9]/.test(watch('password') || '') ? "bg-green-500" : "bg-gray-300"
                                                        )} />
                                                        <span className={/[0-9]/.test(watch('password') || '') ? "text-green-600" : "text-gray-500"}>
                                                            At least one number
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Navigation Buttons */}
                                <div className="flex gap-3 pt-4">
                                    {currentStep > 1 && (
                                        <motion.button
                                            type="button"
                                            onClick={prevStep}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                "flex-1 px-6 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2",
                                                "bg-gray-100 text-gray-700 hover:bg-gray-200",
                                                "dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            )}
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                            Back
                                        </motion.button>
                                    )}

                                    {currentStep < 3 ? (
                                        <motion.button
                                            type="button"
                                            onClick={nextStep}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                "flex-1 px-6 py-3 hover:cursor-pointer text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2",
                                                "bg-gradient-to-r from-blue-600 to-purple-600",
                                                "dark:from-blue-700 dark:to-purple-700"
                                            )}
                                        >
                                            Next
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            type="submit"
                                            disabled={registerLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                "flex-1 px-6 py-3 hover:cursor-pointer text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                                                "bg-gradient-to-r from-blue-600 to-purple-600",
                                                "dark:from-blue-700 dark:to-purple-700"
                                            )}
                                        >
                                            {registerLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Create Account
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className={cn(
                            "px-8 py-6 border-t",
                            "bg-gradient-to-r from-gray-50/50 to-blue-50/50 border-gray-200",
                            "dark:bg-gradient-to-r dark:from-gray-900/50 dark:to-gray-800/50 dark:border-gray-800"
                        )}>
                            <p className={cn(
                                "text-center",
                                "text-gray-600",
                                "dark:text-gray-400"
                            )}>
                                Already have an account?{' '}
                                <button
                                    onClick={() => router.push('/login')}
                                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Mobile App CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={cn(
                            "mt-6 p-4 rounded-xl border backdrop-blur-sm",
                            "bg-gradient-to-r from-white/80 to-blue-50/80 border-gray-200",
                            "dark:bg-gradient-to-r dark:from-gray-900/80 dark:to-gray-800/80 dark:border-gray-800"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                "bg-gradient-to-r from-blue-100 to-purple-100",
                                "dark:bg-gradient-to-r dark:from-blue-500/10 dark:to-purple-500/10"
                            )}>
                                <Smartphone className={cn(
                                    "w-5 h-5",
                                    "text-blue-600",
                                    "dark:text-blue-400"
                                )} />
                            </div>
                            <div className="flex-1">
                                <p className={cn(
                                    "text-sm font-medium",
                                    "text-gray-900",
                                    "dark:text-white"
                                )}>
                                    Get our mobile app
                                </p>
                                <p className={cn(
                                    "text-xs",
                                    "text-gray-600",
                                    "dark:text-gray-400"
                                )}>
                                    Manage your account on the go
                                </p>
                            </div>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                Download
                            </button>
                        </div>
                    </motion.div>

                    {/* Security Badge */}
                    <div className="mt-4 text-center">
                        <p className={cn(
                            "text-xs flex items-center justify-center gap-1",
                            "text-gray-500",
                            "dark:text-gray-400"
                        )}>
                            <Shield className="w-3 h-3" />
                            Your data is protected with 256-bit SSL encryption
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="max-w-lg w-full rounded-2xl shadow-2xl flex flex-col max-h-[80vh] dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-gray-700 bg-white border border-gray-200"
                        >
                            {/* Modal Header - Fixed */}
                            <div className="p-6 border-b rounded-t-2xl dark:border-gray-700 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full dark:bg-blue-500/20 dark:ring-2 dark:ring-blue-500/30 bg-blue-100 ring-2 ring-blue-200">
                                        <PaymentIcon className="w-6 h-6 dark:text-blue-400 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold dark:text-white text-gray-900">
                                            Complete Your Registration
                                        </h3>
                                        <p className="text-sm dark:text-gray-400 text-gray-600">
                                            Activate your account with a one-time payment
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowPaymentModal(false);
                                        }}
                                        className="p-2 rounded-full transition-colors dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    {/* Welcome Message with Gradient */}
                                    <div className="p-5 rounded-xl relative overflow-hidden dark:bg-gradient-to-br dark:from-blue-900/30 dark:to-purple-900/30 dark:border dark:border-blue-800/50 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-10 -mt-10" />
                                        <p className="text-sm relative z-10 dark:text-gray-200 text-gray-700">
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {registeredUserData?.fullName || 'Guest'}
                                            </span>
                                            , your account has been successfully created and is pending activation.
                                        </p>
                                    </div>

                                    {/* SMS Service Card */}
                                    <div className="space-y-3">
                                        <h4 className="text-base font-semibold flex items-center gap-2 dark:text-white text-gray-900">
                                            <span className="w-1 h-5 rounded-full dark:bg-blue-500 bg-blue-600" />
                                            SMS Service Activation
                                        </h4>

                                        <div className="p-5 rounded-xl border dark:bg-gray-800/50 dark:border-gray-700 bg-white border-gray-200 shadow-sm">
                                            {/* Credit Display */}
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-dashed dark:border-gray-700 border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg dark:bg-blue-900/30 bg-blue-100">
                                                        <CreditCard className="w-5 h-5 dark:text-blue-400 text-blue-600" />
                                                    </div>
                                                    <span className="text-sm font-medium dark:text-gray-300 text-gray-700">
                                                        Initial SMS Credit
                                                    </span>
                                                </div>
                                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                    ৳50
                                                </span>
                                            </div>

                                            {/* Benefits List */}
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                                                    <div className="mt-0.5">
                                                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                            <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium dark:text-gray-200 text-gray-700">
                                                            Instant Activation
                                                        </p>
                                                        <p className="text-xs dark:text-gray-400 text-gray-500">
                                                            Your account becomes active immediately after payment
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                                                    <div className="mt-0.5">
                                                        <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium dark:text-gray-200 text-gray-700">
                                                            Pay-as-you-go SMS
                                                        </p>
                                                        <p className="text-xs dark:text-gray-400 text-gray-500">
                                                            Credits are deducted per SMS sent
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                                                    <div className="mt-0.5">
                                                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                            <AlertCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium dark:text-gray-200 text-gray-700">
                                                            Easy Recharge
                                                        </p>
                                                        <p className="text-xs dark:text-gray-400 text-gray-500">
                                                            Top up anytime through your dashboard
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Summary */}
                                    <div className="p-5 rounded-xl text-center relative overflow-hidden dark:bg-gradient-to-br dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20 dark:border dark:border-blue-500/30 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 border border-blue-200">
                                        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                                        <p className="text-sm mb-2 relative z-10 dark:text-gray-300 text-gray-600">
                                            One-time Activation Fee
                                        </p>
                                        <div className="relative z-10">
                                            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                                ৳50
                                            </span>
                                            <span className="text-sm ml-2 dark:text-gray-400 text-gray-500">
                                                BDT
                                            </span>
                                        </div>
                                        <p className="text-xs mt-2 relative z-10 dark:text-gray-400 text-gray-500">
                                            Includes 50 Taka SMS credit • No hidden charges
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer - Fixed */}
                            <div className="p-6 border-t rounded-b-2xl dark:border-gray-700 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowPaymentModal(false);
                                            router.push('/login');
                                        }}
                                        className="flex-1 hover:cursor-pointer px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:border dark:border-gray-600 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                    >
                                        Later
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        disabled={isProcessingPayment}
                                        className="flex-1 hover:cursor-pointer px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessingPayment ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <DollarSign className="w-4 h-4" />
                                                Pay Now
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add this to your global styles or component styles */}
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

            {/* Animation styles - keep your existing */}
            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}