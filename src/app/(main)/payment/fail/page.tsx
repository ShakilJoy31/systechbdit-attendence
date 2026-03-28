'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Home, AlertTriangle, Hash, Clock } from 'lucide-react';
import Link from 'next/link';
import { appConfiguration } from '@/utils/constant/appConfiguration';

// Create a client component that uses useSearchParams
function PaymentFailContent() {
    const searchParams = useSearchParams();
    const [pageReady, setPageReady] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tran_id = searchParams.get('tran_id');

        // Fetch payment details if transaction ID exists
        if (tran_id) {
            fetch(`${appConfiguration.baseUrl}/payment/status/${tran_id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setPaymentData(data.data);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching payment details:', err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }

        // Page reload logic
        const hasReloaded = sessionStorage.getItem('paymentFailReloaded');
        
        if (!hasReloaded) {
            sessionStorage.setItem('paymentFailReloaded', 'true');
            window.location.reload();
        } else {
            setPageReady(true);
        }
    }, [searchParams]);

    // Format currency
    const formatCurrency = (amount, currency = 'BDT') => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Show loading state
    if (!pageReady || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {loading ? 'Checking payment status...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Payment Failed
                    </h1>
                    
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center text-red-600 dark:text-red-400 mb-2">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            <p className="font-medium">Transaction Unsuccessful</p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            We couldn&apos;t process your payment. This could be due to insufficient funds, incorrect information, or network issues.
                        </p>
                    </div>

                    {/* Failed Transaction Details */}
                    {paymentData && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6 text-left border border-gray-200 dark:border-gray-600">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
                                Transaction Details
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
                                    <Clock className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Attempted On</p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {new Date(paymentData.transaction.createdAt).toLocaleString('en-BD', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <AlertTriangle className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount Attempted</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(paymentData.transaction.amount, paymentData.transaction.currency)}
                                        </p>
                                    </div>
                                </div>

                                {paymentData.user && (
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Account</p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {paymentData.user.fullName}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {paymentData.user.email}
                                        </p>
                                    </div>
                                )}

                                {paymentData.transaction.errorMessage && (
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Error Details</p>
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            {paymentData.transaction.errorMessage}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Suggestions:</p>
                        <ul className="text-xs text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1">
                            <li>Check your card details and try again</li>
                            <li>Ensure sufficient balance in your account</li>
                            <li>Try a different payment method</li>
                            <li>Contact your bank if the issue persists</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/register"
                            className="block w-full px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all duration-200 text-center"
                        >
                            <RefreshCw className="inline mr-2 w-4 h-4" />
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

// Main component with Suspense boundary
export default function PaymentFailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading payment fail page...</p>
                </div>
            </div>
        }>
            <PaymentFailContent />
        </Suspense>
    );
}