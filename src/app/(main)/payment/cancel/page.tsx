'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, ArrowLeft, Home, Clock, Hash, Info } from 'lucide-react';
import Link from 'next/link';
import { appConfiguration } from '@/utils/constant/appConfiguration';

// Create a separate component that uses useSearchParams
function PaymentCancelContent() {
    const searchParams = useSearchParams();
    const [pageReady, setPageReady] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tran_id = searchParams.get('tran_id');
        setTransactionId(tran_id);

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
        const hasReloaded = sessionStorage.getItem('paymentCancelReloaded');
        
        if (!hasReloaded) {
            sessionStorage.setItem('paymentCancelReloaded', 'true');
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
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {loading ? 'Checking payment status...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
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
                        className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <X className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Payment Cancelled
                    </h1>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-2">
                            <Info className="w-5 h-5 mr-2" />
                            <p className="font-medium">Transaction Cancelled</p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            You have cancelled the payment process. No charges were made to your account.
                        </p>
                    </div>

                    {/* Cancelled Transaction Details */}
                    {paymentData && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6 text-left border border-gray-200 dark:border-gray-600">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                                Cancelled Transaction
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
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Initiated On</p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {new Date(paymentData.transaction.createdAt).toLocaleString('en-BD', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Info className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(paymentData.transaction.amount, paymentData.transaction.currency)}
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                            ✓ No charges applied
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

                                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                                    <p className="text-sm">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                            Cancelled by user
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Next Steps */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">What would you like to do?</p>
                        <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-2">
                            <li>• You can try the payment again whenever you&apos;re ready</li>
                            <li>• Your registration information has been saved</li>
                            <li>• No payment has been deducted from your account</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/register"
                            className="block w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-lg font-medium hover:from-yellow-700 hover:to-amber-700 transition-all duration-200 text-center"
                        >
                            <ArrowLeft className="inline mr-2 w-4 h-4" />
                            Return to Registration
                        </Link>
                        
                        <Link
                            href="/"
                            className="block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-center"
                        >
                            <Home className="inline mr-2 w-4 h-4" />
                            Go to Home
                        </Link>
                    </div>

                    {!paymentData && transactionId && (
                        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Transaction ID: {transactionId}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// Main component with Suspense boundary
export default function PaymentCancelPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading payment cancel page...</p>
                </div>
            </div>
        }>
            <PaymentCancelContent />
        </Suspense>
    );
}