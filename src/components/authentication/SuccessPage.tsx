'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home, CreditCard, Calendar, Hash, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { appConfiguration } from '@/utils/constant/appConfiguration';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(7);
    const [pageReady, setPageReady] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [error, setError] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tran_id = searchParams.get('tran_id');
        const errorParam = searchParams.get('error');
        
        setTransactionId(tran_id);
        
        if (errorParam) {
            setError(errorParam);
        }

        // Verify transaction with backend
        if (tran_id) {
            fetch(`${appConfiguration.baseUrl}/payment/status/${tran_id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setPaymentData(data.data);
                        setLoading(false);
                    } else {
                        setError('Transaction verification failed');
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.error('Verification error:', err);
                    setError('Failed to verify transaction');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }

        // Check if we've already reloaded
        const hasReloaded = sessionStorage.getItem('paymentSuccessReloaded');
        
        if (!hasReloaded && !errorParam && tran_id) {
            sessionStorage.setItem('paymentSuccessReloaded', 'true');
            const timer = setTimeout(() => {
                window.location.reload();
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setPageReady(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!pageReady || loading) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    sessionStorage.removeItem('paymentSuccessReloaded');
                    router.push('/admin/dashboard');
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router, pageReady, loading]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-BD', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    // Format currency
    const formatCurrency = (amount, currency = 'BDT') => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (!pageReady || loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {loading ? 'Verifying your payment...' : 'Preparing your payment confirmation...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error || (paymentData && paymentData.transaction.status !== 'completed')) {
        return (
            <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                >
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Payment Verification Failed
                        </h1>

                        {transactionId && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Transaction ID: {transactionId}
                            </p>
                        )}

                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
                            <p className="text-red-600 dark:text-red-400">
                                {error || paymentData?.transaction?.errorMessage || 'Your payment could not be verified. Please contact support.'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/register"
                                className="block w-full px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all duration-200 text-center"
                            >
                                Try Again
                            </Link>
                            
                            <Link
                                href="/"
                                className="block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-center"
                            >
                                <Home className="inline mr-2 w-4 h-4" />
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Payment Successful!
                    </h1>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your account has been activated successfully.
                    </p>

                    {/* Payment Details Card */}
                    {paymentData && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6 text-left border border-gray-200 dark:border-gray-600">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                                Payment Details
                            </h2>
                            
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <Hash className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</p>
                                        <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                                            {paymentData.transaction.transactionId}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Date & Time</p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {formatDate(paymentData.transaction.completedAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <CreditCard className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(paymentData.transaction.amount, paymentData.transaction.currency)}
                                        </p>
                                    </div>
                                </div>

                                {paymentData.transaction.cardType && (
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {paymentData.transaction.cardType}
                                            {paymentData.transaction.cardBrand && ` • ${paymentData.transaction.cardBrand}`}
                                            {paymentData.transaction.cardIssuer && ` • ${paymentData.transaction.cardIssuer}`}
                                        </p>
                                        {paymentData.transaction.cardNo && (
                                            <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-1">
                                                Card: **** **** **** {paymentData.transaction.cardNo.slice(-4)}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {paymentData.transaction.bankTransactionId && (
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Bank Transaction ID</p>
                                        <p className="text-sm font-mono text-gray-900 dark:text-white">
                                            {paymentData.transaction.bankTransactionId}
                                        </p>
                                    </div>
                                )}

                                {paymentData.user && (
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Holder</p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {paymentData.user.fullName}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {paymentData.user.email} • {paymentData.user.mobileNo}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Link
                            href="/login"
                            className="block w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-center"
                        >
                            Go to Login
                            <ArrowRight className="inline ml-2 w-4 h-4" />
                        </Link>

                        <Link
                            href="/"
                            className="block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-center"
                        >
                            <Home className="inline mr-2 w-4 h-4" />
                            Return to Home
                        </Link>
                    </div>

                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Redirecting to login in {countdown} seconds...
                    </p>
                </div>
            </motion.div>
        </div>
    );
}