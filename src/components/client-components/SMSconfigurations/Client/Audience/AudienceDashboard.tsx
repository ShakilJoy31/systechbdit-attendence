"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Phone,
    MessageSquare,
    Loader,
    AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetClientByIdQuery } from '@/redux/api/authentication/authApi';
import { useTheme } from '@/hooks/useThemeContext';
// import BackButton from '@/components/reusable-components/BackButton';
import { useGetAudienceStatsQuery } from '@/redux/api/sms-configurations/audienceApi';
import AudienceStatsCards from './AudienceStatsCards';
import AudienceList from './AudienceList';
import { getUserInfo } from '@/utils/helper/userFromToken';

const AudienceDashboard = () => {
    const [user, setUser] = useState(null);
    const [clientId, setClientId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getUserInfo();
            if (!userInfo) {
                router.push("/");
            } else {
                setUser(userInfo);
                setClientId(userInfo.id?.toString() || null);
            }
        };
        fetchUser();
    }, []);

    const router = useRouter();
    const { theme } = useTheme();

    // Conditionally call APIs only when clientId is available
    const { data: clientData, isLoading: clientLoading, isError: clientError } = useGetClientByIdQuery(
        clientId!,
        { skip: !clientId }
    );

    const { data: statsData, isLoading: statsLoading } = useGetAudienceStatsQuery(
        clientId!,
        { skip: !clientId }
    );

    if (clientLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        Loading client information...
                    </p>
                </div>
            </div>
        );
    }

    if (clientError || !clientData) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        Failed to load client information
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const client = clientData.data;
    const stats = statsData?.data;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} p-2 md:p-3 lg:p-4`}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div>
                        <h1 className={`text-xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Audience Management
                        </h1>
                        <p className={`mt-1 text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage phone numbers and messages for {client.fullName}
                        </p>
                    </div>
                </div>

                {/* Client Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className={`${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                        } border rounded-xl py-6 px-2 md:px-4 lg:px-6 shadow-lg transition-colors duration-300`}
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Client Avatar */}
                        <div className="relative">
                            <div className={`w-20 h-20 rounded-full ${theme === 'dark'
                                ? 'bg-gray-700'
                                : 'bg-gray-100'
                                } flex items-center justify-center overflow-hidden transition-colors duration-300`}>
                                {client.photo ? (
                                    <img
                                        src={client.photo}
                                        alt={client.fullName}
                                        
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Users className="w-10 h-10 text-gray-400" />
                                )}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-900' : 'border-white'
                                } ${client.status === 'active' ? 'bg-green-500' :
                                    client.status === 'pending' ? 'bg-yellow-500' :
                                        'bg-red-500'}`} />
                        </div>

                        {/* Client Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className='flex items-center gap-x-2'>
                                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {client.fullName}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${client.status === 'active' ?
                                            (theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700') :
                                            client.status === 'pending' ?
                                                (theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700') :
                                                (theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
                                            }`}>
                                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                        </span>
                                    </div>
                                </div>


                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                        }`}>
                                        <Phone className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Phone
                                        </p>
                                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {client.mobileNo}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                        }`}>
                                        <Phone className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Email
                                        </p>
                                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {client.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                        }`}>
                                        <MessageSquare className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            SMS Configurations
                                        </p>
                                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            View SMS Configs
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Statistics */}
            {!statsLoading && stats && (
                <AudienceStatsCards stats={stats} clientId={user?.id} />
            )}

            {/* Audience List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <AudienceList clientId={user?.id} client={client} />
            </motion.div>
        </div>
    );
};

export default AudienceDashboard;