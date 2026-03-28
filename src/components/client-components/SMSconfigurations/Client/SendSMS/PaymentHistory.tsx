'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw,
    Wallet,
    ArrowRight,
    DollarSign,
    TrendingUp,
    Zap,
    Sparkles,
    Coins,
    Loader2,
    History,
    Gift,
    MessageSquare,
    BarChart3,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useGetUserPaymentsQuery } from '@/redux/api/sms-configurations/smsApi';
import { getUserInfo } from '@/utils/helper/userFromToken';
import { useProcessRechargePaymentMutation } from '@/redux/api/authentication/authApi';
import { useGetSMSHistoryQuery } from '@/redux/api/sms-configurations/smsApi';

interface PaymentHistoryProps {
    userId?: string | number;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ userId: propUserId }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getUserInfo();
            if (!userInfo) {
                router.push('/');
            } else {
                setUser(userInfo);
            }
        };
        fetchUser();
    }, [router]);

    const effectiveUserId = propUserId || user?.id;

    const { data: paymentsData, isLoading, refetch } = useGetUserPaymentsQuery(effectiveUserId, {
        skip: !effectiveUserId,
        pollingInterval: 30000, // This will automatically refetch every 30 seconds
    });

    // Refetch on component mount when userId is available
    useEffect(() => {
        if (effectiveUserId) {
            refetch();
        }
    }, [effectiveUserId, refetch]); // Added proper dependencies

    // Fetch SMS history to calculate usage
    const { data: smsHistoryData, refetch: refetchSMS } = useGetSMSHistoryQuery(
        {
            page: 1,
            limit: 1000,
            clientId: effectiveUserId?.toString(),
        },
        {
            skip: !effectiveUserId,
        }
    );

    // Also refetch SMS history on mount
    useEffect(() => {
        if (effectiveUserId) {
            refetchSMS();
        }
    }, [effectiveUserId, refetchSMS]);

    const [processRechargePayment] = useProcessRechargePaymentMutation();

    // Calculate total balance from all completed transactions
    const calculateTotalBalance = () => {
        if (!paymentsData?.data?.transactions) return 0;
        return paymentsData.data.transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    };

    // Calculate current month's recharge
    const calculateMonthlyRecharge = () => {
        if (!paymentsData?.data?.transactions) return 0;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return paymentsData.data.transactions
            .filter(t =>
                t.status === 'completed' &&
                new Date(t.createdAt) >= startOfMonth
            )
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    };

    // Calculate SMS usage statistics
    const calculateSMSUsage = () => {
        const smsHistory = smsHistoryData?.data?.history || [];
        
        // Total SMS sent
        const totalSMSSent = smsHistory.length;
        
        // Total cost based on SMS count (0.50 per SMS)
        const COST_PER_SMS = 0.50;
        const totalSMSCost = smsHistory.reduce((sum, sms) => {
            // Use smsCount if available, otherwise assume 1
            const count = sms.smsCount || 1;
            return sum + (count * COST_PER_SMS);
        }, 0);
        
        // Current month's SMS usage
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlySMS = smsHistory.filter(sms => 
            new Date(sms.sentAt) >= startOfMonth
        );
        
        const monthlySMSSent = monthlySMS.length;
        const monthlySMSCost = monthlySMS.reduce((sum, sms) => {
            const count = sms.smsCount || 1;
            return sum + (count * COST_PER_SMS);
        }, 0);
        
        return {
            totalSMSSent,
            totalSMSCost,
            monthlySMSSent,
            monthlySMSCost,
        };
    };

    const totalBalance = calculateTotalBalance();
    const monthlyRecharge = calculateMonthlyRecharge();
    const smsUsage = calculateSMSUsage();

    const handleRecharge = async () => {
        if (!amount || parseFloat(amount) < 10) {
            toast.error('Please enter a valid amount (minimum 10 BDT)');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await processRechargePayment({
                userId: effectiveUserId,
                amount: parseFloat(amount),
                paymentMethod: 'sslcommerz',
                payload: {
                    fullName: user?.fullName,
                    email: user?.email,
                    mobileNo: user?.mobileNo,
                    ...user
                },
            }).unwrap();

            if (response.success && response.data.gatewayUrl) {
                localStorage.setItem('rechargeAmount', amount);
                localStorage.setItem('rechargeTransactionId', response.data.transactionId);

                window.location.href = response.data.gatewayUrl;
            } else {
                toast.error('Failed to initialize payment');
            }
        } catch (error) {
            console.error('Recharge error:', error);
            toast.error(error.data?.message || 'Payment processing failed');
            setIsProcessing(false);
            setIsModalOpen(false);
            setAmount('');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
            case 'failed':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-700';
            case 'pending':
                return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20 text-yellow-700';
            case 'failed':
                return 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/20 text-red-700';
            default:
                return 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 border-gray-500/20 text-gray-700';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8"
            >
                {/* Header with Balance Card */}
                <motion.div className="mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-pulse" />
                        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="text-3xl md:text-4xl font-bold flex items-center gap-3"
                                    >
                                        <Wallet className="w-8 h-8" />
                                        SMS Balance
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-blue-100 mt-2"
                                    >
                                        We&apos;ll charge 0.50 BDT per SMS sent. You can recharge anytime, anywhere!
                                    </motion.p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsModalOpen(true)}
                                    className="group relative hover:cursor-pointer px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Zap className="w-5 h-5 group-hover:animate-pulse" />
                                        Recharge Now
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400"
                                        initial={{ x: '100%' }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Balance Stats Cards */}
                <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-100 text-sm">Available Balance</p>
                                <p className="text-4xl font-bold mt-2">৳ {totalBalance.toFixed(2)}</p>
                                <p className="text-blue-100 text-sm mt-1">Total SMS credits</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Coins className="w-8 h-8" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-green-100 text-sm">Monthly Recharge</p>
                                <p className="text-4xl font-bold mt-2">৳ {monthlyRecharge.toFixed(2)}</p>
                                <p className="text-green-100 text-sm mt-1">This month</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-purple-100 text-sm">Total Transactions</p>
                                <p className="text-4xl font-bold mt-2">{paymentsData?.data?.totalTransactions || 0}</p>
                                <p className="text-purple-100 text-sm mt-1">All time</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl">
                                <History className="w-8 h-8" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Transactions List */}
                <motion.div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <History className="w-5 h-5 text-blue-500" />
                                    Transaction History
                                </h2>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* SMS Usage Summary */}
                                <div onClick={()=> router.push("/admin/sms/history")} className="flex items-center hover:cursor-pointer gap-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            SMS Sent:
                                        </span>
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                            {smsUsage.totalSMSSent}
                                        </span>
                                    </div>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Total Cost:
                                        </span>
                                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                            ৳ {smsUsage.totalSMSCost.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            This month:
                                        </span>
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {smsUsage.monthlySMSSent} SMS
                                        </span>
                                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                            (৳ {smsUsage.monthlySMSCost.toFixed(2)})
                                        </span>
                                    </div>
                                </div>
                                
                                <motion.button
                                    whileHover={{ rotate: 180 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        refetch();
                                        refetchSMS();
                                    }}
                                    className="p-2 hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <RefreshCw className="w-5 h-5 text-gray-500" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : paymentsData?.data?.transactions?.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20 px-4"
                        >
                            <div className="relative inline-block">
                                <Gift className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <Sparkles className="w-6 h-6 text-yellow-400" />
                                </motion.div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No Transactions Yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Start by recharging your SMS balance
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                            >
                                Make Your First Recharge
                            </motion.button>
                        </motion.div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {paymentsData?.data?.transactions.map((transaction, index) => (
                                    <motion.div
                                        key={transaction.id}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                                        className="p-6 cursor-pointer"
                                        onClick={() => setSelectedTransaction(transaction)}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <motion.div
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.5 }}
                                                    className={`p-3 rounded-xl ${getStatusColor(transaction.status)}`}
                                                >
                                                    {getStatusIcon(transaction.status)}
                                                </motion.div>

                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            Recharge #{transaction.transactionId.slice(-8)}
                                                        </h3>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                                                            {transaction.status}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(transaction.createdAt)}
                                                        </span>
                                                        {transaction.cardBrand && (
                                                            <span className="flex items-center gap-1">
                                                                <CreditCard className="w-4 h-4" />
                                                                {transaction.cardBrand}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <DollarSign className="w-4 h-4" />
                                                            {transaction.currency}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 ml-14 md:ml-0">
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                        + ৳ {transaction.amount}
                                                    </p>
                                                </div>
                                                <motion.div
                                                    whileHover={{ x: 5 }}
                                                    className="text-gray-400"
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>

                {/* Transaction Details Modal */}
                <AnimatePresence>
                    {selectedTransaction && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setSelectedTransaction(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: 'spring', damping: 25 }}
                                className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={`p-6 ${getStatusColor(selectedTransaction.status)}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(selectedTransaction.status)}
                                            <h3 className="text-xl font-semibold">Recharge Details</h3>
                                        </div>
                                        <motion.button
                                            whileHover={{ rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setSelectedTransaction(null)}
                                            className="p-2 hover:bg-black/10 hover:cursor-pointer rounded-full transition-colors"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 md:col-span-1">
                                            <p className="text-sm text-gray-500">Transaction ID</p>
                                            <p className="font-mono font-semibold">{selectedTransaction.transactionId}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <p className="text-sm text-gray-500">Amount Added</p>
                                            <p className="text-3xl font-bold text-green-600">+ ৳ {selectedTransaction.amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <p className={`capitalize font-semibold ${getStatusColor(selectedTransaction.status)}`}>
                                                {selectedTransaction.status}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Method</p>
                                            <p className="capitalize">{selectedTransaction.paymentMethod || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Created At</p>
                                            <p>{formatDate(selectedTransaction.createdAt)}</p>
                                        </div>
                                        {selectedTransaction.completedAt && (
                                            <div>
                                                <p className="text-sm text-gray-500">Completed At</p>
                                                <p>{formatDate(selectedTransaction.completedAt)}</p>
                                            </div>
                                        )}
                                    </div>

                                    {selectedTransaction.cardBrand && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                Payment Information
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Card Brand</p>
                                                    <p>{selectedTransaction.cardBrand}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Card Type</p>
                                                    <p>{selectedTransaction.cardType || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Card Issuer</p>
                                                    <p>{selectedTransaction.cardIssuer || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Bank Transaction ID</p>
                                                    <p className="font-mono text-sm">{selectedTransaction.bankTransactionId || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Recharge Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: 'spring', damping: 25 }}
                                className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <Zap className="w-6 h-6" />
                                        Recharge Balance
                                    </h3>
                                    <p className="text-blue-100 mt-1">Add SMS credits to your account</p>
                                </div>

                                <div className="p-6">
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Amount (BDT)
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="Enter amount"
                                                min="10"
                                                step="1"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Minimum amount: 10 BDT</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-6">
                                        {[50, 100, 200, 500, 1000, 2000].map((value) => (
                                            <motion.button
                                                key={value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setAmount(value.toString())}
                                                className="py-2 hover:cursor-pointer px-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                                            >
                                                ৳ {value}
                                            </motion.button>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 hover:cursor-pointer px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleRecharge}
                                            disabled={isProcessing}
                                            className="flex-1 px-4 py-3 hover:cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-5 h-5" />
                                                    Proceed to Payment
                                                </>
                                            )}
                                        </motion.button>
                                    </div>

                                    {/* Current Balance Info */}
                                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                            <Wallet className="w-4 h-4" />
                                            Current Balance: ৳ {totalBalance.toFixed(2)}
                                        </p>
                                        {amount && !isNaN(parseFloat(amount)) && (
                                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                                New Balance: ৳ {(totalBalance + parseFloat(amount || '0')).toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};

export default PaymentHistory;