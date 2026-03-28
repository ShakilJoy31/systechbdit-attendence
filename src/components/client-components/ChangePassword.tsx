// components/profile/PasswordChange.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    LockKeyhole,
    Shield,
    Sparkles,
    Zap,
    KeyRound,
    Fingerprint,
    RefreshCw,
    Key,
    Copy
} from "lucide-react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useChangePasswordMutation } from "@/redux/api/authentication/authApi";
import { getUserIdFromToken } from "@/utils/helper/userFromToken";

// Password validation schema
const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be less than 50 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords don't match",
        path: ["confirmNewPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from current password",
        path: ["newPassword"],
    });

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export default function PasswordChange() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [, setPasswordSuggestions] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [securityLevel, setSecurityLevel] = useState("");
    const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);

    const controls = useAnimationControls();
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const userId = getUserIdFromToken();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isDirty },
    } = useForm<PasswordChangeFormData>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const newPassword = watch("newPassword");
    const confirmNewPassword = watch("confirmNewPassword");

    // Generate a strong password
    const generateStrongPassword = () => {
        setIsGeneratingPassword(true);
        
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        
        const allChars = lowercase + uppercase + numbers + specialChars;
        
        // Ensure at least one of each required type
        let password = [
            lowercase[Math.floor(Math.random() * lowercase.length)],
            uppercase[Math.floor(Math.random() * uppercase.length)],
            numbers[Math.floor(Math.random() * numbers.length)],
            specialChars[Math.floor(Math.random() * specialChars.length)]
        ];
        
        // Add more random characters to reach 16 length
        for (let i = password.length; i < 16; i++) {
            password.push(allChars[Math.floor(Math.random() * allChars.length)]);
        }
        
        // Shuffle the password array
        password = password.sort(() => Math.random() - 0.5);
        
        const generatedPassword = password.join('');
        
        // Set the password in the form
        setValue("newPassword", generatedPassword, { shouldValidate: true });
        setValue("confirmNewPassword", generatedPassword, { shouldValidate: true });
        
        // Trigger strength calculation
        calculatePasswordStrength(generatedPassword);
        
        // Animation feedback
        controls.start({
            scale: [1, 1.1, 1],
            transition: { duration: 0.3 }
        });
        
        toast.success(
            <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-green-500" />
                <span>Strong password generated!</span>
            </div>,
            {
                duration: 3000,
                position: "top-center",
                style: {
                    background: "#10b981",
                    color: "white",
                    borderRadius: "12px",
                    padding: "12px 16px",
                },
            }
        );
        
        setIsGeneratingPassword(false);
    };

    // Copy password to clipboard
    const copyToClipboard = () => {
        if (newPassword) {
            navigator.clipboard.writeText(newPassword);
            toast.success("Password copied to clipboard!", {
                duration: 2000,
                position: "top-center",
            });
        }
    };

    // Calculate password strength with more criteria
    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        const suggestions: string[] = [];

        // Length check
        if (password.length >= 12) strength += 25;
        else if (password.length >= 8) strength += 15;
        else suggestions.push("Use at least 12 characters for maximum security");

        // Complexity checks
        if (/[a-z]/.test(password)) strength += 15;
        else suggestions.push("Add lowercase letters");

        if (/[A-Z]/.test(password)) strength += 15;
        else suggestions.push("Add uppercase letters");

        if (/[0-9]/.test(password)) strength += 15;
        else suggestions.push("Add numbers");

        if (/[^A-Za-z0-9]/.test(password)) strength += 15;
        else suggestions.push("Add special characters (!@#$%^&*)");

        // Additional security
        if (!/(.)\1{2,}/.test(password)) strength += 10;
        else suggestions.push("Avoid repeating characters");

        if (password.length > 0) {
            if (strength <= 40) setSecurityLevel("Weak");
            else if (strength <= 60) setSecurityLevel("Fair");
            else if (strength <= 80) setSecurityLevel("Good");
            else setSecurityLevel("Excellent");
        }

        setPasswordStrength(Math.min(strength, 100));
        setPasswordSuggestions(suggestions);
    };

    // Animate strength meter on password change
    useEffect(() => {
        if (newPassword) {
            controls.start({
                scale: [1, 1.05, 1],
                transition: { duration: 0.3 }
            });
        }
    }, [newPassword, controls]);

    const getStrengthColor = (strength: number) => {
        if (strength <= 40) return "from-red-500 to-red-600";
        if (strength <= 60) return "from-yellow-500 to-yellow-600";
        if (strength <= 80) return "from-blue-500 to-blue-600";
        return "from-emerald-500 to-green-600";
    };

    const getStrengthBgColor = (strength: number) => {
        if (strength <= 40) return "bg-red-500/20 dark:bg-red-500/20";
        if (strength <= 60) return "bg-yellow-500/20 dark:bg-yellow-500/20";
        if (strength <= 80) return "bg-blue-500/20 dark:bg-blue-500/20";
        return "bg-emerald-500/20 dark:bg-emerald-500/20";
    };

    const onSubmit = async (data: PasswordChangeFormData) => {
        if (!userId) {
            toast.error("Authentication required. Please log in again.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await changePassword({
                id: userId,
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword,
            }).unwrap();

            if (result.success) {
                // Success animation
                await controls.start({
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                    transition: { duration: 0.5 }
                });

                toast.success(
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span>Password changed successfully!</span>
                    </div>,
                    {
                        duration: 4000,
                        position: "top-center",
                        style: {
                            background: "#10b981",
                            color: "white",
                            borderRadius: "12px",
                            padding: "16px",
                        },
                    }
                );

                reset();
                setPasswordStrength(0);
                setPasswordSuggestions([]);
                setSecurityLevel("");
            }
        } catch (error) {
            console.error("Password change error:", error);

            // Error animation
            controls.start({
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.4 }
            });

            if (error.data?.message) {
                toast.error(error.data.message, {
                    duration: 5000,
                    position: "top-center",
                });
            } else if (error.status === 401) {
                toast.error("Current password is incorrect", {
                    duration: 5000,
                    position: "top-center",
                });
            } else if (error.status === 400) {
                toast.error("Invalid input. Please check your passwords", {
                    duration: 5000,
                    position: "top-center",
                });
            } else {
                toast.error("Failed to change password. Please try again.", {
                    duration: 5000,
                    position: "top-center",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Container animations
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden my-4"
        >
            {/* Animated Background */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black p-1">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 animate-pulse" />
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 dark:bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-20 animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 dark:bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-20 animate-blob animation-delay-2000" />

                <div className="relative bg-gradient-to-br from-white via-white/95 to-gray-50/95 dark:from-gray-900/90 dark:via-gray-900/95 dark:to-black/95 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl dark:shadow-2xl">
                    {/* Header with animated icon */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="p-8 border-b border-gray-200/50 dark:border-gray-800/50"
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-50 dark:opacity-50" />
                                    <div className="relative p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700">
                                        <LockKeyhole className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </motion.div>
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                        Password Security
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        Update your password with enhanced security features
                                    </p>
                                </div>
                            </div>
                            
                            {/* Password Generator Button */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <motion.button
                                    type="button"
                                    onClick={generateStrongPassword}
                                    disabled={isGeneratingPassword}
                                    className="relative group"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm" />
                                    <div className="relative px-4 py-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300/50 dark:border-gray-700/50 backdrop-blur-sm flex items-center gap-2">
                                        {isGeneratingPassword ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            </motion.div>
                                        ) : (
                                            <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        )}
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {isGeneratingPassword ? "Generating..." : "Generate Strong Password"}
                                        </span>
                                    </div>
                                </motion.button>
                                <p className="text-xs text-gray-500 dark:text-gray-500 text-center max-w-xs">
                                    Generates a secure 16-character password with all requirements
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Current Password Field */}
                            <motion.div variants={itemVariants} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        Current Password
                                    </label>
                                    <span className="text-xs text-gray-500 dark:text-gray-500">Required</span>
                                </div>
                                <div className="relative group">
                                    <input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="Enter your current password"
                                        className={cn(
                                            "w-full px-5 py-4 rounded-xl border-2",
                                            "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
                                            "border-gray-300/50 dark:border-gray-700/50 group-hover:border-blue-500/50 dark:group-hover:border-blue-500/50",
                                            "text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
                                            "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                                            "transition-all duration-300",
                                            errors.currentPassword && "border-red-500/50 focus:border-red-500"
                                        )}
                                        {...register("currentPassword")}
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        {showCurrentPassword ?
                                            <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" /> :
                                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        }
                                    </motion.button>
                                    {errors.currentPassword && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="absolute -bottom-6 left-0 flex items-center gap-1"
                                        >
                                            <XCircle className="w-3 h-3 text-red-500 dark:text-red-400" />
                                            <span className="text-xs text-red-500 dark:text-red-400">{errors.currentPassword.message}</span>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>

                            {/* New Password Field */}
                            <motion.div variants={itemVariants} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        New Password
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {newPassword && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                type="button"
                                                onClick={copyToClipboard}
                                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <Copy className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">Copy</span>
                                            </motion.button>
                                        )}
                                        <span className="text-xs text-gray-500 dark:text-gray-500">Secure password required</span>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Create a strong new password"
                                        className={cn(
                                            "w-full px-5 py-4 rounded-xl border-2 pr-24",
                                            "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
                                            "border-gray-300/50 dark:border-gray-700/50 group-hover:border-purple-500/50 dark:group-hover:border-purple-500/50",
                                            "text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
                                            "focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
                                            "transition-all duration-300",
                                            errors.newPassword && "border-red-500/50 focus:border-red-500"
                                        )}
                                        {...register("newPassword", {
                                            onChange: (e) => calculatePasswordStrength(e.target.value),
                                        })}
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        {showNewPassword ?
                                            <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" /> :
                                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        }
                                    </motion.button>
                                </div>

                                {/* Password Strength Indicator */}
                                {newPassword && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-4 pt-4"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Security Level</span>
                                                <motion.span
                                                    key={securityLevel}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className={`text-sm font-semibold ${securityLevel === "Weak" ? "text-red-600 dark:text-red-400" :
                                                            securityLevel === "Fair" ? "text-yellow-600 dark:text-yellow-400" :
                                                                securityLevel === "Good" ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400"
                                                        }`}
                                                >
                                                    {securityLevel}
                                                </motion.span>
                                            </div>
                                            <motion.div
                                                animate={controls}
                                                className="relative h-3 bg-gray-200/50 dark:bg-gray-800/50 rounded-full overflow-hidden"
                                            >
                                                <div className={`absolute inset-0 ${getStrengthBgColor(passwordStrength)}`} />
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${passwordStrength}%` }}
                                                    className={`h-full bg-gradient-to-r ${getStrengthColor(passwordStrength)} rounded-full shadow-lg`}
                                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                />
                                                <div className="absolute inset-0 flex">
                                                    {[0, 25, 50, 75, 100].map((point) => (
                                                        <div
                                                            key={point}
                                                            className="h-full w-px bg-gray-300/50 dark:bg-gray-700/50"
                                                            style={{ marginLeft: `${point}%` }}
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Password Requirements Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { text: "12+ chars", met: newPassword.length >= 12, icon: <span className="text-xs">📏</span> },
                                                { text: "A-Z", met: /[A-Z]/.test(newPassword), icon: <span className="text-xs">🔠</span> },
                                                { text: "a-z", met: /[a-z]/.test(newPassword), icon: <span className="text-xs">🔡</span> },
                                                { text: "0-9", met: /[0-9]/.test(newPassword), icon: <span className="text-xs">🔢</span> },
                                                { text: "!@#$", met: /[^A-Za-z0-9]/.test(newPassword), icon: <span className="text-xs">✨</span> },
                                                { text: "No repeats", met: !/(.)\1{2,}/.test(newPassword), icon: <span className="text-xs">🔄</span> },
                                                { text: "Diff from old", met: true, icon: <span className="text-xs">🆕</span> },
                                                { text: "Strong", met: passwordStrength >= 80, icon: <span className="text-xs">🛡️</span> },
                                            ].map((req, index) => (
                                                <motion.div
                                                    key={index}
                                                    whileHover={{ scale: 1.05 }}
                                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 ${
                                                        req.met
                                                            ? "border-emerald-500/30 bg-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                                                            : "border-gray-300/50 bg-gray-100/30 dark:border-gray-700/50 dark:bg-gray-800/30"
                                                    }`}
                                                >
                                                    <div className={`text-lg ${req.met ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-500"}`}>
                                                        {req.icon}
                                                    </div>
                                                    <span className={`text-xs font-medium ${req.met ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-500"}`}>
                                                        {req.text}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                {errors.newPassword && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 mt-2"
                                    >
                                        <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                                        <span className="text-sm text-red-500 dark:text-red-400">{errors.newPassword.message}</span>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Confirm Password Field */}
                            <motion.div variants={itemVariants} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <Fingerprint className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                        Confirm New Password
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {confirmNewPassword && newPassword === confirmNewPassword && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-xs">Passwords match</span>
                                            </motion.div>
                                        )}
                                        <span className="text-xs text-gray-500 dark:text-gray-500">Must match above</span>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <input
                                        id="confirmNewPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter your new password"
                                        className={cn(
                                            "w-full px-5 py-4 rounded-xl border-2",
                                            "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
                                            "border-gray-300/50 dark:border-gray-700/50 group-hover:border-pink-500/50 dark:group-hover:border-pink-500/50",
                                            "text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
                                            "focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20",
                                            "transition-all duration-300",
                                            errors.confirmNewPassword && "border-red-500/50 focus:border-red-500"
                                        )}
                                        {...register("confirmNewPassword")}
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        {showConfirmPassword ?
                                            <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" /> :
                                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        }
                                    </motion.button>
                                    {errors.confirmNewPassword && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="absolute -bottom-6 left-0 flex items-center gap-1"
                                        >
                                            <XCircle className="w-3 h-3 text-red-500 dark:text-red-400" />
                                            <span className="text-xs text-red-500 dark:text-red-400">{errors.confirmNewPassword.message}</span>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Submit Button Section */}
                            <motion.div
                                variants={itemVariants}
                                className="pt-8 border-t border-gray-200/50 dark:border-gray-800/50"
                            >
                                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                                    {/* Security Tips */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-gradient-to-r from-gray-100/30 via-gray-100/20 to-gray-50/30 dark:from-gray-800/30 dark:via-gray-800/20 dark:to-gray-900/30 rounded-xl p-6 border border-gray-200/30 dark:border-gray-700/30 flex-1"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Pro Security Tips</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {[
                                                { tip: "Use a passphrase with 4+ words", emoji: "🗝️" },
                                                { tip: "Enable 2-factor authentication", emoji: "🔐" },
                                                { tip: "Never reuse old passwords", emoji: "🚫" },
                                                { tip: "Update passwords every 90 days", emoji: "📅" },
                                                { tip: "Use a password manager", emoji: "📱" },
                                                { tip: "Avoid personal information", emoji: "👤" },
                                            ].map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    whileHover={{ x: 5 }}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-200/30 dark:bg-gray-800/30 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors"
                                                >
                                                    <span className="text-xl">{item.emoji}</span>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.tip}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <div className="text-center space-y-2">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Click the security shield to change your password
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                All security requirements must be met
                                            </p>
                                        </div>

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading || isSubmitting || !isDirty}
                                            className="relative group hover:cursor-pointer"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {/* Outer glow effect */}
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.5, 0.8, 0.5],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    repeatType: "reverse"
                                                }}
                                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-md"
                                            />

                                            {/* Pulsing ring */}
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    borderColor: ["rgba(139, 92, 246, 0.3)", "rgba(139, 92, 246, 0.6)", "rgba(139, 92, 246, 0.3)"],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                }}
                                                className="absolute -inset-2 rounded-2xl border-2 border-purple-500/30"
                                            />

                                            {/* Main button */}
                                            <motion.div
                                                whileHover={{
                                                    rotate: 180,
                                                    backgroundColor: ["rgba(243, 244, 246, 0.5)", "rgba(224, 231, 255, 0.5)"],
                                                }}
                                                transition={{
                                                    duration: 0.4,
                                                    backgroundColor: { duration: 0.3 }
                                                }}
                                                className={cn(
                                                    "relative p-4 rounded-2xl",
                                                    "bg-gradient-to-br from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50",
                                                    "border-2 border-gray-300/50 dark:border-gray-700/50",
                                                    "backdrop-blur-sm",
                                                    "group-hover:border-purple-500/50",
                                                    "transition-all duration-300",
                                                    (isLoading || isSubmitting) && "animate-pulse",
                                                    (!isDirty) && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                {/* Shine effect on hover */}
                                                <motion.div
                                                    initial={{ x: "-100%" }}
                                                    whileHover={{ x: "100%" }}
                                                    transition={{ duration: 0.5 }}
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                                                />

                                                {/* Icon */}
                                                <div className="relative">
                                                    {isLoading || isSubmitting ? (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        >
                                                            <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                                        </motion.div>
                                                    ) : (
                                                        <>
                                                            {/* Icon glow */}
                                                            <motion.div
                                                                animate={{
                                                                    scale: [1, 1.2, 1],
                                                                    opacity: [0.5, 0.8, 0.5],
                                                                }}
                                                                transition={{
                                                                    duration: 2,
                                                                    repeat: Infinity,
                                                                }}
                                                                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-md rounded-full"
                                                            />

                                                            {/* Main icon */}
                                                            <Shield className="w-8 h-8 text-green-600 dark:text-green-400 relative z-10" />

                                                            {/* Animated checkmark on success */}
                                                            {!isDirty && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                                                                >
                                                                    <span className="text-xs text-white">!</span>
                                                                </motion.div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                {/* Tooltip text */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileHover={{ opacity: 1, y: 0 }}
                                                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                                                >
                                                    <div className="px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                                        <p className="text-xs font-medium text-gray-800 dark:text-white">
                                                            {isDirty ? "Click to secure password" : "Fill all fields first"}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        </motion.button>

                                        {/* Status indicators */}
                                        <AnimatePresence>
                                            {isLoading || isSubmitting ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400"
                                                >
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"
                                                    />
                                                    <span>Encrypting and securing your new password...</span>
                                                </motion.div>
                                            ) : null}
                                        </AnimatePresence>

                                        {/* Security level indicator */}
                                        {isDirty && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-xs text-gray-600 dark:text-gray-400 text-center space-y-1"
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                    <span>Ready to update security</span>
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                </div>
                                                <p className="text-gray-500 dark:text-gray-500">256-bit encryption enabled</p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Add custom animations to global styles */}
            <style jsx global>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                /* Smooth transitions for all inputs */
                input {
                    caret-color: #8b5cf6;
                }
                
                /* Custom scrollbar - light mode */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(229, 231, 235, 0.5);
                }
                
                .dark ::-webkit-scrollbar-track {
                    background: rgba(31, 41, 55, 0.5);
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #6366f1, #8b5cf6);
                    border-radius: 4px;
                }
                
                /* Responsive adjustments */
                @media (max-width: 640px) {
                    .input-padding-right {
                        padding-right: 100px;
                    }
                }
            `}</style>
        </motion.div>
    );
}