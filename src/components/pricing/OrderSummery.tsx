"use client"

import { useState, useEffect } from "react";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import Button from "../reusable-components/Button";
import { usePathname, useRouter } from "next/navigation";

export default function OrderSummery({ configuration, username, password, confirmPassword }) {
    const router = useRouter();
    const pathname = usePathname();
    const [localConfig, setLocalConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load data from localStorage on component mount
    useEffect(() => {
        const loadConfigFromStorage = () => {
            const savedData = localStorage.getItem('pricingConfiguration');

            if (savedData) {
                try {
                    const config = JSON.parse(savedData);

                    // Define pricing data arrays
                    const pricingPlans = [
                        { id: "basic", name: "Basic Plan", price: 9.99, discountedPrice: 8.99, description: "Perfect for small projects and startups" },
                        { id: "standard", name: "Standard Plan", price: 19.99, discountedPrice: 17.99, description: "Ideal for growing businesses" },
                        { id: "premium", name: "Premium Plan", price: 29.99, discountedPrice: 26.99, description: "For agencies and established businesses" },
                        { id: "enterprise", name: "Enterprise Plan", price: 49.99, discountedPrice: 44.99, description: "Tailored for large organizations" },
                    ];

                    const serverTypes = [
                        { id: "shared", name: "Shared Hosting", price: 0 },
                        { id: "vps", name: "VPS Hosting", price: 15.99 },
                        { id: "aws", name: "AWS Hosting", price: 29.99 }
                    ];

                    const storageTypes = [
                        { id: "50gb", name: "50 GB SSD", price: 0 },
                        { id: "100gb", name: "100 GB NVMe", price: 9.99 },
                        { id: "150gb", name: "150 GB SSD", price: 14.99 },
                        { id: "200gb", name: "200 GB NVMe", price: 19.99 }
                    ];

                    const userOptions = [
                        { id: "2", name: "2 Users", price: 0 },
                        { id: "3", name: "3 Users", price: 2.5 },
                        { id: "4", name: "4 Users", price: 5.99 },
                        { id: "5", name: "5 Users", price: 8.99 }
                    ];

                    const bandwidthOptions = [
                        { id: "100gb", name: "100 GB Bandwidth", price: 0 },
                        { id: "250gb", name: "250 GB Bandwidth", price: 4.99 },
                        { id: "500gb", name: "500 GB Bandwidth", price: 9.99 },
                        { id: "1tb", name: "1 TB Bandwidth", price: 14.99 }
                    ];

                    const ipv4Options = [
                        { id: "1", name: "1 IPv4", price: 0 },
                        { id: "2", name: "2 IPv4", price: 3.99 },
                        { id: "3", name: "3 IPv4", price: 7.99 },
                        { id: "4", name: "4 IPv4", price: 11.99 }
                    ];

                    // Create configuration object from localStorage data
                    const newConfig = {
                        selectedPlan: pricingPlans.find(plan => plan.id === config.selectedPlan) || pricingPlans[0],
                        serverType: serverTypes.find(server => server.id === config.serverType) || serverTypes[0],
                        storageType: storageTypes.find(storage => storage.id === config.storageType) || storageTypes[0],
                        dataProtection: config.dataProtection || false,
                        userCount: userOptions.find(user => user.id === config.userCount) || userOptions[0],
                        bandwidth: bandwidthOptions.find(bw => bw.id === config.bandwidth) || bandwidthOptions[0],
                        ipv4: ipv4Options.find(ip => ip.id === config.ipv4) || ipv4Options[0],
                        username: config.username || "",
                        password: config.password || "",
                    };

                    setLocalConfig(newConfig);
                } catch (error) {
                    console.error("Error parsing configuration from localStorage:", error);
                }
            }
            setIsLoading(false);
        };

        // If configuration is passed via props, use that
        if (configuration) {
            setLocalConfig(configuration);
            setIsLoading(false);
        } else {
            // Otherwise load from localStorage
            loadConfigFromStorage();
        }
    }, [configuration]);

    // Use configuration from props if available, otherwise use localStorage data
    const config = configuration || localConfig;

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <Heading className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Order Summary</Heading>
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!config || !config.selectedPlan) {
        return (
            <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <Heading className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Order Summary</Heading>
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <p>No order configuration found.</p>
                    <p className="mt-2 text-sm">Please go back to the pricing page to configure your order.</p>
                </div>
            </div>
        );
    }

    const {
        selectedPlan,
        serverType,
        storageType,
        dataProtection,
        userCount,
        bandwidth,
        ipv4
    } = config;

    // Calculate total
    const basePrice = selectedPlan.discountedPrice;
    const serverPrice = serverType?.price || 0;
    const storagePrice = storageType?.price || 0;
    const dataProtectionPrice = dataProtection ? 5.99 : 0;
    const userPrice = userCount?.price || 0;
    const bandwidthPrice = bandwidth?.price || 0;
    const ipv4Price = ipv4?.price || 0;

    const subtotal = basePrice + serverPrice + storagePrice + dataProtectionPrice + userPrice + bandwidthPrice + ipv4Price;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
            <Heading className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Order Summary</Heading>

            {/* Plan Details */}
            <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Heading className="text-lg font-semibold text-gray-800 dark:text-white ">Basic Plan</Heading>
                        <Paragraph className="text-sm text-gray-600 dark:text-gray-300 ">{selectedPlan.description}</Paragraph>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">${selectedPlan.discountedPrice.toFixed(2)}</div>
                        <div className="text-sm text-gray-400 line-through">${selectedPlan.price.toFixed(2)}</div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <Paragraph className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        You&apos;re saving ${(selectedPlan.price - selectedPlan.discountedPrice).toFixed(2)} with this plan!
                    </Paragraph>
                </div>
            </div>

            {/* Configuration Details */}
            <div className="mb-6">
                <Heading className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Configuration:</Heading>

                <div className="space-y-3">
                    {/* Server Type */}
                    <div className="flex justify-between items-center">
                        <Paragraph className="text-sm text-gray-600 dark:text-gray-300 ">Server: {serverType?.name}</Paragraph>
                        {serverType?.price > 0 && (
                            <Paragraph className="text-sm text-gray-800 dark:text-gray-300 ">+${serverType.price.toFixed(2)}</Paragraph>
                        )}
                    </div>

                    {/* Storage Type */}
                    <div className="flex justify-between items-center">
                        <Paragraph className="text-sm text-gray-600 dark:text-gray-300 ">Storage: {storageType?.name}</Paragraph>
                        {storageType?.price > 0 && (
                            <Paragraph className="text-sm text-gray-800 dark:text-gray-300 ">+${storageType.price.toFixed(2)}</Paragraph>
                        )}
                    </div>

                    {/* Data Protection */}
                    {dataProtection && (
                        <div className="flex justify-between items-center">
                            <Paragraph className="text-sm text-gray-600 dark:text-gray-300 ">Data Protection</Paragraph>
                            <Paragraph className="text-sm text-gray-800 dark:text-gray-300 ">+$5.99</Paragraph>
                        </div>
                    )}

                    {/* User Count */}
                    <div className="flex justify-between items-center">
                        <Paragraph className="text-sm text-gray-600 dark:text-gray-300 ">Users: {userCount?.name}</Paragraph>
                        {userCount?.price > 0 && (
                            <Paragraph className="text-sm text-gray-800 dark:text-gray-300 ">+${userCount.price.toFixed(2)}</Paragraph>
                        )}
                    </div>

                    {/* Bandwidth */}
                    <div className="flex justify-between items-center">
                        <Paragraph className="text-sm text-gray-600 dark:text-gray-300 ">Bandwidth: {bandwidth?.name}</Paragraph>
                        {bandwidth?.price > 0 && (
                            <Paragraph className="text-sm text-gray-800 dark:text-gray-300 ">+${bandwidth.price.toFixed(2)}</Paragraph>
                        )}
                    </div>

                    {/* IPv4 */}
                    <div className="flex justify-between items-center">
                        <Paragraph className="text-sm text-gray-600 dark:text-gray-300 ">IPv4: {ipv4?.name}</Paragraph>
                        {ipv4?.price > 0 && (
                            <Paragraph className="text-sm text-gray-800 dark:text-gray-300 ">+${ipv4.price.toFixed(2)}</Paragraph>
                        )}
                    </div>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <Paragraph className="text-gray-600 dark:text-gray-300">Subtotal</Paragraph>
                    <Paragraph className="text-gray-800 dark:text-gray-300">${subtotal.toFixed(2)}</Paragraph>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <Paragraph className="text-gray-600 dark:text-gray-300">Tax (10%)</Paragraph>
                    <Paragraph className="text-gray-800 dark:text-gray-300">${tax.toFixed(2)}</Paragraph>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                    <Heading className="text-lg font-bold text-gray-800 dark:text-gray-300">Total</Heading>
                    <Heading className="text-lg font-bold text-blue-600">${total.toFixed(2)}/month</Heading>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                {
                    pathname === '/pricing/pricing-details/customer-info-fields' ? '' : <Button
                        disabled={
                            !username ||
                            !password ||
                            !confirmPassword ||
                            password !== confirmPassword ||
                            password.length < 8 ||
                            confirmPassword.length < 8
                        }
                        onClick={() => router.push('/pricing/pricing-details/customer-info-fields')}
                        className={`w-full hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors ${(!username || !password || !confirmPassword || password !== confirmPassword || password.length < 8 || confirmPassword.length < 8)
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                    >
                        Next
                    </Button>
                }


                <button className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 hover:cursor-pointer text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium transition-colors">
                    Talk to Sales
                </button>
            </div>

            {/* Guarantee */}
            <div className="mt-6 text-center">
                <Paragraph className="text-xs text-gray-500 dark:text-gray-400">
                    🔒 Secure checkout · 30-day money-back guarantee · Cancel anytime
                </Paragraph>
            </div>
        </div>
    );
}