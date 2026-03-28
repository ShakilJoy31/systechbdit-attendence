"use client"

import { useState, useEffect } from "react";
import Heading from "../reusable-components/Heading";
import Paragraph from "../reusable-components/Paragraph";
import OrderSummery from "./OrderSummery";
import BackupPlan from "./DatabaseBackupPlan";
import { theRequiredStar } from "../reusable-components/RequiredStrar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { handleGeneratePassword } from "@/utils/helper/passwordGenerator";

export default function PricingCheckout() {
    const [selectedPlan, setSelectedPlan] = useState("basic");
    const [serverType, setServerType] = useState("shared");
    const [storageType, setStorageType] = useState("50gb");
    const [dataProtection, setDataProtection] = useState(false);
    const [userCount, setUserCount] = useState("2");
    const [bandwidth, setBandwidth] = useState("100gb");
    const [ipv4, setIpv4] = useState("1");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('pricingConfiguration');
        if (savedData) {
            const config = JSON.parse(savedData);
            setSelectedPlan(config.selectedPlan || "basic");
            setServerType(config.serverType || "shared");
            setStorageType(config.storageType || "50gb");
            setDataProtection(config.dataProtection || false);
            setUserCount(config.userCount || "2");
            setBandwidth(config.bandwidth || "100gb");
            setIpv4(config.ipv4 || "1");
            setUsername(config.username || "");
            setPassword(config.password || "");
            setConfirmPassword(config.confirmPassword || "");
        }
    }, []);

    // Save to localStorage whenever any configuration changes
    useEffect(() => {
        const configData = {
            selectedPlan,
            serverType,
            storageType,
            dataProtection,
            userCount,
            bandwidth,
            ipv4,
            username,
            password,
            confirmPassword
        };
        localStorage.setItem('pricingConfiguration', JSON.stringify(configData));
    }, [selectedPlan, serverType, storageType, dataProtection, userCount, bandwidth, ipv4, username, password, confirmPassword]);

    const pricingPlans = [
        {
            id: "basic",
            duration: 1,
            name: "Basic Plan",
            price: 9.99,
            discountedPrice: 8.99,
            features: ["Up to 5 projects", "Basic support", "1GB storage", "Standard templates", "Custom domain", "Standard templates", "Standard templates", "Standard templates", "Standard templates", "Standard templates", "Standard templates", "Standard templates", "Standard templates"],
            description: "Perfect for small projects and startups"
        },
        {
            id: "standard",
            duration: 3,
            name: "Standard Plan",
            price: 19.99,
            discountedPrice: 17.99,
            features: ["Up to 15 projects", "Priority support", "5GB storage", "Advanced templates", "Custom domain"],
            description: "Ideal for growing businesses"
        },
        {
            id: "premium",
            duration: 6,
            name: "Premium Plan",
            price: 29.99,
            discountedPrice: 26.99,
            features: ["Unlimited projects", "24/7 support", "20GB storage", "All templates", "Custom domain", "Advanced analytics"],
            description: "For agencies and established businesses"
        },
        {
            id: "enterprise",
            duration: 12,
            name: "Enterprise Plan",
            price: 49.99,
            discountedPrice: 44.99,
            features: ["Unlimited projects", "Dedicated support", "100GB storage", "All templates", "Multiple domains", "Advanced analytics", "White-labeling"],
            description: "Tailored for large organizations"
        },
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

    const selectedPlanData = pricingPlans.find(plan => plan.id === selectedPlan);
    const selectedServerType = serverTypes.find(server => server.id === serverType);
    const selectedStorageType = storageTypes.find(storage => storage.id === storageType);
    const selectedUserOption = userOptions.find(user => user.id === userCount);
    const selectedBandwidthOption = bandwidthOptions.find(bw => bw.id === bandwidth);
    const selectedIpv4Option = ipv4Options.find(ip => ip.id === ipv4);

    const configurationData = {
        selectedPlan: selectedPlanData,
        serverType: selectedServerType,
        storageType: selectedStorageType,
        dataProtection,
        userCount: selectedUserOption,
        bandwidth: selectedBandwidthOption,
        ipv4: selectedIpv4Option,
        username,
        password,
    };

    const handleGenerateNewPassword = () => {
        const generatedPassword = handleGeneratePassword();
        setPassword(generatedPassword);
        setConfirmPassword(generatedPassword);
    }

    return (
        <section className="px-4 lg:px-0 py-8">
            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-300 shadow-sm rounded-sm px-1 ">
                <div>
                    <Heading className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white ">Basic Plan</Heading>

                    <div className="mt-4">
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                            {pricingPlans[0].features.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                    <svg
                                        className="h-4 w-4 text-green-500 mr-2 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    No Setup Fee
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Pricing selection - Takes 2/3 width on large screens */}
                <div className="lg:col-span-2">

                    <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Select Your Term Length </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                            {pricingPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`relative px-4 py-3 border-2 rounded-xl transition-all duration-200 cursor-pointer ${selectedPlan === plan.id
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                                        }`}
                                    onClick={() => setSelectedPlan(plan.id)}
                                >
                                    {/* Discount badge */}
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        SAVE 10%
                                    </div>

                                    <div className="flex items-center text-center">
                                        {/* Radio button */}
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id
                                            ? "border-blue-600 bg-blue-600"
                                            : "border-gray-300"
                                            }`}>
                                            {selectedPlan === plan.id && (
                                                <div className="h-2 w-2 rounded-full bg-white"></div>
                                            )}
                                        </div>

                                        {/* Price in center */}
                                        <div className="block mx-auto ">
                                            <div className="flex items-baseline justify-center">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    ${plan.discountedPrice.toFixed(2)}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-1">/month</span>
                                            </div>
                                            {/* <div className="text-sm text-gray-400 line-through">
                                                ${plan.price.toFixed(2)}
                                            </div> */}
                                        </div>

                                    </div>

                                    <div className="absolute bottom-[-13px] left-1/2 transform -translate-x-1/2 bg-white dark:bg-black text-black dark:text-white text-xs font-bold py-1 ">
                                        {plan.duration} {plan.duration > 1 ? "Months" : "Month"}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Server type */}
                    <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                        <Heading className="text-xl font-semibold text-gray-800 dark:text-white">Server Type</Heading>
                        <Paragraph className="mb-4 text-gray-500 dark:text-gray-300 ">You can now choose either NVMe or SSD</Paragraph>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {serverTypes.map((server) => (
                                <div
                                    key={server.id}
                                    className={`px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${serverType === server.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    onClick={() => setServerType(server.id)}
                                >
                                    <div className="flex items-center">
                                        <div className={`h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${serverType === server.id
                                            ? "border-blue-600 bg-blue-600"
                                            : "border-gray-300"
                                            }`}>
                                            {serverType === server.id && (
                                                <div className="h-2 w-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <div>
                                            <div className={`font-medium ${serverType === server.id ? 'dark:text-black text-gray-600' : 'dark:text-gray-300 text-gray-600'}`}>{server.name}</div>
                                            <div className={`text-sm ${serverType === server.id ? 'dark:text-black text-gray-600' : 'dark:text-gray-300 text-gray-600'}`}>
                                                {server.price > 0 ? `+$${server.price.toFixed(2)}/month` : "Free"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Storage type */}
                    <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Storage Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {storageTypes.map((storage) => (
                                <div
                                    key={storage.id}
                                    className={`px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${storageType === storage.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    onClick={() => setStorageType(storage.id)}
                                >
                                    <div className="flex items-center">
                                        <div className={`h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${storageType === storage.id
                                            ? "border-blue-600 bg-blue-600"
                                            : "border-gray-300"
                                            }`}>
                                            {storageType === storage.id && (
                                                <div className="h-2 w-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <div>
                                            <div className={`font-medium ${storageType === storage.id ? 'dark:text-black text-gray-600' : 'dark:text-gray-300 text-gray-600'} `}>{storage.name}</div>
                                            <div className="text-sm text-gray-600">
                                                {storage.price > 0 ? `+$${storage.price.toFixed(2)}/month` : "Free"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-6 ">Data Protection with Auto Backup</h3>
                    <BackupPlan dataProtection={dataProtection} setDataProtection={setDataProtection}></BackupPlan>

                    {/* User, Bandwidth, and IPv4 in flex */}
                    <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Networking</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* User */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Users
                                </label>
                                <select
                                    value={userCount}
                                    onChange={(e) => setUserCount(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200
                 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                >
                                    {userOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name} {option.price > 0 ? `(+$${option.price.toFixed(2)})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Bandwidth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Bandwidth
                                </label>
                                <select
                                    value={bandwidth}
                                    onChange={(e) => setBandwidth(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200
                 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                >
                                    {bandwidthOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name} {option.price > 0 ? `(+$${option.price.toFixed(2)})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* IPv4 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    IPv4 Addresses
                                </label>
                                <select
                                    value={ipv4}
                                    onChange={(e) => setIpv4(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200
                 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                >
                                    {ipv4Options.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name} {option.price > 0 ? `(+$${option.price.toFixed(2)})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>

                    {/* Login password for your server */}
                    <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Login password for your Service </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username {theRequiredStar}</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password (Min 8 charecter) {theRequiredStar} </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash className="h-4 w-4 text-gray-500 hover:cursor-pointer " /> : <FaEye className="h-4 w-4 text-gray-500 hover:cursor-pointer " />}
                                    </button>
                                </div>
                                <button onClick={handleGenerateNewPassword} aria-label="We're not able to know your generated password" title="We're not able to know your generated password" className="mt-1 block text-sm font-medium text-[#1776BB] dark:text-white hover:cursor-pointer hover:underline ">Generate New Password</button>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password {theRequiredStar}</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm password"
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash className="h-4 w-4 text-gray-500 hover:cursor-pointer " /> : <FaEye className="h-4 w-4 text-gray-500 hover:cursor-pointer " />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Order Summary - Fixed on the right side */}
                <div className="lg:col-span-1 relative">
                    <OrderSummery configuration={configurationData} username={username} password={password} confirmPassword={confirmPassword} />
                </div>
            </div>
        </section>
    );
}