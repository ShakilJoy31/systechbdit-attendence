// components/clients/ClientCard.tsx
'use client';

import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    AlertCircle,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Eye,
    UserCheck,
    UserX,
    MoreVertical
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditClientModal from './EditClientModal';

// Types
export interface Client {
    id: number;
    fullName: string;
    photo: string;
    dateOfBirth: string;
    age: number;
    sex: string;
    nidOrPassportNo: string;
    mobileNo: string;
    email: string;
    role: string;
    status: 'active' | 'pending' | 'inactive';
    createdAt: string;
    updatedAt: string;
    nidPhoto: {
        frontSide: string;
        backSide: string;
    };
}

interface ClientCardProps {
    client: Client;
    onView: (client: Client) => void;
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
    onStatusChange: (client: Client, status: 'active' | 'pending' | 'inactive') => void;
    refetch?: () => void;
}

export default function ClientCard({
    client,
    onView,
    onDelete,
    onStatusChange,
    refetch
}: ClientCardProps) {
    const router = useRouter();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleEditClick = () => {
        setShowEditModal(true);
        setShowDropdown(false);
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        if (refetch) refetch();
    };

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative"
            >
                {/* Glowing background effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 dark:group-hover:from-blue-500/5 dark:group-hover:via-purple-500/5 dark:group-hover:to-blue-500/5 rounded-2xl blur-xl transition-all duration-500" />

                {/* Main card */}
                <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-100 dark:group-hover:shadow-blue-900/20 group-hover:border-blue-200 dark:group-hover:border-blue-900/50 overflow-hidden">

                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/5 dark:to-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Animated border gradient */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-4">
                                {/* Avatar with status indicator */}
                                <div className="relative">
                                    {/* Avatar ring animation */}
                                    <motion.div
                                        className="absolute -inset-1 border-2 border-blue-400/30 dark:border-blue-500/30 rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    />

                                    {/* Avatar */}
                                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {client.photo ? (
                                            <img
                                                src={client.photo}
                                                alt={client.fullName}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-7 h-7" />
                                        )}

                                        {/* Online status indicator */}
                                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${client.status === 'active' ? 'bg-emerald-500' :
                                            client.status === 'pending' ? 'bg-amber-500' :
                                                'bg-rose-500'
                                            }`}>
                                            {client.status === 'active' && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-emerald-500"
                                                    animate={{ scale: [1, 1.3, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Client info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {client.fullName}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${client.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
                                            : client.status === 'pending'
                                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
                                                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
                                            }`}>
                                            {client.status === 'active' && <CheckCircle className="w-3 h-3" />}
                                            {client.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                                            {client.status === 'inactive' && <XCircle className="w-3 h-3" />}
                                            {client.status}
                                        </span>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                            {client.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="p-2 rounded-lg hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </button>

                                {showDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowDropdown(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 py-1">
                                            <button
                                                onClick={() => {
                                                    onView(client);
                                                    setShowDropdown(false);
                                                }}
                                                className="w-full hover:cursor-pointer px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </button>
                                            <button
                                                onClick={handleEditClick}
                                                className="w-full hover:cursor-pointer px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit Profile
                                            </button>
                                            {client.status !== 'active' && (
                                                <button
                                                    onClick={() => {
                                                        onStatusChange(client, 'active');
                                                        setShowDropdown(false);
                                                    }}
                                                    className="w-full hover:cursor-pointer px-4 py-2 text-left text-sm text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                    Activate Account
                                                </button>
                                            )}
                                            {client.status !== 'pending' && (
                                                <button
                                                    onClick={() => {
                                                        onStatusChange(client, 'pending');
                                                        setShowDropdown(false);
                                                    }}
                                                    className="w-full hover:cursor-pointer px-4 py-2 text-left text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center gap-2"
                                                >
                                                    <AlertCircle className="w-4 h-4" />
                                                    Set as Pending
                                                </button>
                                            )}
                                            {client.status !== 'inactive' && (
                                                <button
                                                    onClick={() => {
                                                        onStatusChange(client, 'inactive');
                                                        setShowDropdown(false);
                                                    }}
                                                    className="w-full hover:cursor-pointer px-4 py-2 text-left text-sm text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                                                >
                                                    <UserX className="w-4 h-4" />
                                                    Deactivate
                                                </button>
                                            )}
                                            <div className="border-t border-gray-200 dark:border-gray-800 my-1" />
                                            <button
                                                onClick={() => {
                                                    onDelete(client);
                                                    setShowDropdown(false);
                                                }}
                                                className="w-full hover:cursor-pointer px-4 py-2 text-left text-sm text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Client
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* SMS Configuration Button - RESTORED */}
                        <div className='my-2 mr-2'>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push(`/admin/all-users/user-sms-configuration/${client.id}`)}
                                className="p-2 rounded-xl hover:cursor-pointer w-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 group bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-100 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20"
                            >
                                {/* Icon container */}
                                <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 group-hover:from-blue-600 group-hover:to-purple-700 transition-all">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>

                                {/* Text */}
                                <span className="text-blue-700 dark:text-blue-300 text-xs xl:text-md group-hover:text-blue-800 dark:group-hover:text-blue-200">
                                    SMS Configuration
                                </span>

                                {/* Arrow indicator */}
                                <svg className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* Client info grid */}
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="space-y-3">
                                {/* Email */}
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-colors">
                                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {client.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-colors">
                                    <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                                        <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {client.mobileNo}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Age */}
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-colors">
                                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Age</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {client.age} years
                                        </p>
                                    </div>
                                </div>

                                {/* NID */}
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-colors">
                                    <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                        <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">NID/Passport</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {client.nidOrPassportNo}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                            {/* Join date */}
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <Calendar className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Joined</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {new Date(client.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2">
                                {/* View NID button */}
                                {client.nidPhoto?.frontSide && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.open(client.nidPhoto.frontSide, '_blank')}
                                        className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 transition-all flex items-center gap-1.5"
                                    >
                                        <Shield className="w-3.5 h-3.5" />
                                        View NID
                                    </motion.button>
                                )}

                                {/* Profile button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onView(client)}
                                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white text-xs font-semibold hover:shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-blue-500/15 transition-all flex items-center gap-1.5"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    View Profile
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Hover shine effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>
            </motion.div>

            {/* Edit Client Modal */}
            {showEditModal && (
                <EditClientModal
                    client={client}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </>
    );
}