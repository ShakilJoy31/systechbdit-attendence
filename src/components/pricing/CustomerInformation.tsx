"use client";

import Paragraph from "@/components/reusable-components/Paragraph";
import React, { useState } from "react";
import Button from "../reusable-components/Button";
import { motion, AnimatePresence } from "framer-motion";
import { theRequiredStar } from "../reusable-components/RequiredStrar";
import OrderSummery from "./OrderSummery";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CustomerInformationFields: React.FC = () => {
    const [customerType, setCustomerType] = useState("new");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [alreadyCustomer, setAlreadyCustomer] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [existingCustomerData, setExistingCustomerData] = useState({
        businessName: "",
        salutation: "",
        firstName: "",
        lastName: "",
        addressLine1: "",
        city: "",
        postcode: "",
        country: "",
        telephone: "",
        taxNumber: "",
        email: "",
        confirmEmail: "",
        password: "" // Add this
    });
    const [newCustomerData, setNewCustomerData] = useState({
        salutation: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postcode: "",
        country: "",
        telephone: "",
        email: "",
        confirmEmail: ""
    });

    const handleNewCustomerChange = (e) => {
        const { name, value } = e.target;
        setNewCustomerData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExistingCustomerChange = (e) => {
        const { name, value } = e.target;
        setExistingCustomerData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Animation variants
    const tabContentVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    const statusSelectionVariants = {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 }
    };

    return (
        <div className="mt-16 max-w-[1280px] mx-auto px-2 py-8 flex justify-between">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 relative">
                    <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-gray-200 p-6">

                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">Customer Information</h3>

                        <div className="flex border-b border-gray-200 gap-x-6">
                            <button
                                className={`py-3 hover:cursor-pointer font-medium text-sm ${(!alreadyCustomer) ? "border-b-2 mb-[-1.5px] border-blue-500 text-blue-600" : "text-gray-500"}`}
                                onClick={() => {
                                    setAlreadyCustomer(false);
                                    setCustomerType("new")
                                }}
                            >
                                I am new to Tech Element IT
                            </button>

                            <button onClick={() => {
                                setCustomerType("existing")
                                setAlreadyCustomer(true)
                            }}
                                className={`py-3 hover:cursor-pointer font-medium text-sm ${alreadyCustomer ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                            >
                                I am Tech Element IT customer
                            </button>
                        </div>

                        <Paragraph className="my-4 text-gray-500 dark:text-gray-300 ">Enter your details below or Login <span onClick={() => {
                            setCustomerType("existing")
                            setAlreadyCustomer(true)
                        }} className="hover:underline hover:cursor-pointer text-[#1776BB] ">Here if you&apos;re already a customer. </span></Paragraph>

                        {/* The status */}
                        <AnimatePresence mode="wait">
                            {!alreadyCustomer && (
                                <motion.div
                                    key="status-section"
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    variants={statusSelectionVariants}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white dark:bg-background my-4 overflow-hidden"
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Select Your Status</h3>
                                    <div className="grid grid-cols-2 gap-4">

                                        <motion.div
                                            whileTap={{ scale: 0.90 }}
                                            className={`px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${customerType === "new"
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            onClick={() => setCustomerType("new")}
                                        >
                                            <div className="flex items-center">
                                                <div className={`h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${customerType === "new"
                                                    ? "border-blue-600 bg-blue-600"
                                                    : "border-gray-300"
                                                    }`}>
                                                    {customerType === "new" && (
                                                        <div className="h-2 w-2 rounded-full bg-white"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${customerType === "new" ? 'dark:text-black' : 'dark:text-white'}`}>Private Individual</div>
                                                    <div className="text-sm text-gray-600">For personal use</div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileTap={{ scale: 0.90 }}
                                            className={`px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${customerType === "existing"
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            onClick={() => setCustomerType("existing")}
                                        >
                                            <div className="flex items-center">
                                                <div className={`h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${customerType === "existing"
                                                    ? "border-blue-600 bg-blue-600"
                                                    : "border-gray-300"
                                                    }`}>
                                                    {customerType === "existing" && (
                                                        <div className="h-2 w-2 rounded-full bg-white"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${customerType === "existing" ? 'dark:text-black' : 'dark:text-white'}`}>Business</div>
                                                    <div className="text-sm text-gray-600">For commercial use</div>
                                                </div>
                                            </div>
                                        </motion.div>

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {!alreadyCustomer ? (
                                <motion.div
                                    key={customerType}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    variants={tabContentVariants}
                                    transition={{ duration: 0.3 }}
                                >
                                    {customerType === "new" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* Salutation, First Name, and Last Name */}
                                            <div className="md:col-span-2">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salutation</label>
                                                        <select
                                                            name="salutation"
                                                            value={newCustomerData.salutation}
                                                            onChange={handleNewCustomerChange}
                                                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="mr">Mr.</option>
                                                            <option value="mrs">Mrs.</option>
                                                            <option value="ms">Ms.</option>
                                                            <option value="dr">Dr.</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name {theRequiredStar}</label>
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            value={newCustomerData.firstName}
                                                            onChange={handleNewCustomerChange}
                                                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name {theRequiredStar}</label>
                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            value={newCustomerData.lastName}
                                                            onChange={handleNewCustomerChange}
                                                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address {theRequiredStar}</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={newCustomerData.address}
                                                    onChange={handleNewCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City {theRequiredStar}</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={newCustomerData.city}
                                                    onChange={handleNewCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Postcode {theRequiredStar}</label>
                                                <input
                                                    type="text"
                                                    name="postcode"
                                                    value={newCustomerData.postcode}
                                                    onChange={handleNewCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country {theRequiredStar} </label>
                                                <select
                                                    name="country"
                                                    value={newCustomerData.country}
                                                    onChange={handleNewCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="bn">Bangladesh</option>
                                                    <option value="us">United States</option>
                                                    <option value="uk">United Kingdom</option>
                                                    <option value="ca">Canada</option>
                                                    <option value="au">Australia</option>
                                                    <option value="de">Germany</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telephone {theRequiredStar}</label>
                                                <input
                                                    type="tel"
                                                    name="telephone"
                                                    value={newCustomerData.telephone}
                                                    onChange={handleNewCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email {theRequiredStar}</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={newCustomerData.email}
                                                    onChange={handleNewCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Email {theRequiredStar}</label>
                                                <input
                                                    type="email"
                                                    name="confirmEmail"
                                                    value={newCustomerData.confirmEmail}
                                                    onChange={handleNewCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Name {theRequiredStar}</label>
                                                <input
                                                    type="text"
                                                    name="businessName"
                                                    value={existingCustomerData.businessName}
                                                    onChange={handleExistingCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salutation</label>
                                                        <select
                                                            name="salutation"
                                                            value={newCustomerData.salutation}
                                                            onChange={handleNewCustomerChange}
                                                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="mr">Mr.</option>
                                                            <option value="mrs">Mrs.</option>
                                                            <option value="ms">Ms.</option>
                                                            <option value="dr">Dr.</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name {theRequiredStar}</label>
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            value={customerType === "existing" ? "John" : newCustomerData.firstName}
                                                            onChange={handleNewCustomerChange}
                                                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name {theRequiredStar}</label>
                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            value={customerType === "existing" ? "Doe" : newCustomerData.lastName}
                                                            onChange={handleNewCustomerChange}
                                                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Line 1 {theRequiredStar}</label>
                                                <input
                                                    type="text"
                                                    name="addressLine1"
                                                    value={existingCustomerData.addressLine1}
                                                    onChange={handleExistingCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City {theRequiredStar}</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={existingCustomerData.city}
                                                    onChange={handleExistingCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Postcode {theRequiredStar}</label>
                                                <input
                                                    type="text"
                                                    name="postcode"
                                                    value={existingCustomerData.postcode}
                                                    onChange={handleExistingCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country {theRequiredStar}</label>
                                                <select
                                                    name="country"
                                                    value={existingCustomerData.country}
                                                    onChange={handleExistingCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="bn">Bangladesh</option>
                                                    <option value="us">United States</option>
                                                    <option value="uk">United Kingdom</option>
                                                    <option value="ca">Canada</option>
                                                    <option value="au">Australia</option>
                                                    <option value="de">Germany</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telephone {theRequiredStar}</label>
                                                <input
                                                    type="tel"
                                                    name="telephone"
                                                    value={existingCustomerData.telephone}
                                                    onChange={handleExistingCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax Number (Optional)</label>
                                                <input
                                                    type="text"
                                                    name="taxNumber"
                                                    value={existingCustomerData.taxNumber}
                                                    onChange={handleExistingCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email {theRequiredStar}</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={existingCustomerData.email}
                                                    onChange={handleExistingCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Email {theRequiredStar}</label>
                                                <input
                                                    type="email"
                                                    name="confirmEmail"
                                                    value={existingCustomerData.confirmEmail}
                                                    onChange={handleExistingCustomerChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="existing-customer-login"
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    variants={tabContentVariants}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                >
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email {theRequiredStar}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={existingCustomerData.email}
                                            onChange={handleExistingCustomerChange}
                                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Password {theRequiredStar}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={existingCustomerData.password}
                                                onChange={handleExistingCustomerChange}
                                                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <FaEyeSlash className="h-4 w-4" />
                                                ) : (
                                                    <FaEye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <Paragraph className="md:col-span-2 text-md text-gray-600 dark:text-gray-300">If you have forgotten your password, <span className="text-[#1776BB] hover:underline hover:cursor-pointer">please click here to reset it.</span></Paragraph>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center ">
                            {
                                !alreadyCustomer ? <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="h-5 w-5 text-blue-600 rounded mt-1 hover:cursor-pointer "
                                    />
                                    <label htmlFor="terms" className="ml-3 text-gray-700 dark:text-white">
                                        <div className="font-medium">I agree to the Terms and Conditions</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 ">By checking this box, you agree to our Terms of Service and Privacy Policy.</div>
                                    </label>
                                </div> : ''
                            }


                            <div className={`${alreadyCustomer ? 'flex justify-end w-full ' : ''}`}>
                                <Button
                                    disabled={
                                        // For new customers (not already customer)
                                        !alreadyCustomer ? !termsAccepted :
                                            // For existing customers
                                            !existingCustomerData.email || !existingCustomerData.password
                                    }
                                    className={`bg-[#1776BB] hover:cursor-pointer hover:bg-[#0f5ed1] text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium flex items-center gap-2 mx-auto lg:mx-0 transition text-sm sm:text-base ${
                                        // For new customers
                                        (!alreadyCustomer && !termsAccepted) ||
                                            // For existing customers
                                            (alreadyCustomer && (!existingCustomerData.email || !existingCustomerData.password))
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                        }`}
                                >
                                    Submit
                                </Button>
                            </div>


                        </div>

                    </div>
                </div>


                <div className="lg:col-span-1 relative">
                    {/* Don't pass configuration prop - component will load from localStorage */}
                    <OrderSummery configuration={undefined} username={undefined} password={undefined} confirmPassword={undefined} />
                </div>
            </div>

        </div>
    );
};

export default CustomerInformationFields;