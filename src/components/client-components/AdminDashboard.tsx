"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Send,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    Globe,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Activity,
    Shield,
    Bell,
    Database,
    Download,
    MoreVertical,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartPieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import { useTheme } from "next-themes";
import { getUserInfo } from "@/utils/helper/userFromToken";
import {
    useGetUserPaymentsQuery,
    useGetClientSMSQuery,
    useCreateSMSMutation
} from "@/redux/api/sms-configurations/smsApi";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
    const [timeRange, setTimeRange] = useState("monthly");
    const [isLoading, setIsLoading] = useState(true);
    const { theme, systemTheme } = useTheme();
    const [, setMounted] = useState(false);
    const [user, setUser] = useState(null);
    const [configCreated, setConfigCreated] = useState(false);
    const [showConfigSuccess, setShowConfigSuccess] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getUserInfo();
            setUser(userInfo);
        };
        fetchUser();
    }, []);

    const { data: paymentsData, isLoading: userPaymentLoading, refetch } = useGetUserPaymentsQuery(user?.id, {
        skip: !user?.id,
        pollingInterval: 30000,
    });

    // Get user's SMS configurations
    const { data: smsConfigs, isLoading: smsConfigsLoading } = useGetClientSMSQuery(
        { clientId: user?.id, limit: 1 },
        { skip: !user?.id }
    );

    // Create SMS config mutation
    const [createSMS, { isLoading: isCreatingConfig }] = useCreateSMSMutation();

    // Auto-create SMS configuration if user has balance > 1 and no config exists
    useEffect(() => {
        const createDefaultConfig = async () => {
            // Check if user exists and payments data is available
            if (!user?.id || !paymentsData?.data?.transactions || configCreated) {
                return;
            }

            // Calculate total balance from completed transactions
            const totalBalance = paymentsData.data.transactions
                .filter(t => t.status === 'completed')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            console.log('Total Balance:', totalBalance);

            // Check if balance is more than 1 taka
            if (totalBalance > 1) {
                // Check if user already has any SMS configuration
                if (!smsConfigsLoading && smsConfigs?.data?.length === 0) {
                    try {
                        // Create default SMS configuration
                        const smsConfigData = {
                            appName: "Default SMS Gateway",
                            apiKey: "C400102369708eca4d1604.85945999",
                            type: "unicode" as const,
                            senderId: "8809601017931",
                            message: "Welcome! This is a demo sms placeholder.",
                            status: true,
                            clientId: user.id
                        };

                        console.log('Creating default SMS config for user:', user.id);

                        await createSMS({
                            clientId: user.id,
                            data: smsConfigData
                        }).unwrap();

                        setConfigCreated(true);
                        setShowConfigSuccess(true);
                        toast.success('Default SMS configuration created successfully!');

                        // Hide success message after 5 seconds
                        setTimeout(() => {
                            setShowConfigSuccess(false);
                        }, 5000);

                        // Refetch payments data
                        refetch();
                    } catch (error) {
                        console.error('Failed to create SMS config:', error);
                        toast.error('Failed to create default SMS configuration');
                    }
                } else if (smsConfigs?.data?.length > 0) {
                    // User already has config, set flag to prevent future attempts
                    setConfigCreated(true);
                    console.log('User already has SMS configuration, skipping creation');
                }
            }
        };

        createDefaultConfig();
    }, [user, paymentsData, smsConfigs, smsConfigsLoading, createSMS, refetch, configCreated]);

    // Handle theme mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = theme === "system" ? systemTheme : theme;

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Calculate user-specific stats from payments data
    const calculateUserStats = () => {
        if (!paymentsData?.data?.transactions) {
            return {
                totalBalance: 0,
                completedTransactions: 0,
                failedTransactions: 0,
                pendingTransactions: 0,
                lastTransactionDate: null
            };
        }

        const transactions = paymentsData.data.transactions;
        const completed = transactions.filter(t => t.status === 'completed');
        const failed = transactions.filter(t => t.status === 'failed');
        const pending = transactions.filter(t => t.status === 'pending');

        return {
            totalBalance: completed.reduce((sum, t) => sum + parseFloat(t.amount), 0),
            completedTransactions: completed.length,
            failedTransactions: failed.length,
            pendingTransactions: pending.length,
            lastTransactionDate: completed.length > 0 ? completed[0].completedAt : null
        };
    };

    const userStats = calculateUserStats();

    // Static data for charts
    const smsVolumeData = [
        { month: "Jan", sent: 4500, delivered: 4200, failed: 300 },
        { month: "Feb", sent: 5200, delivered: 5000, failed: 200 },
        { month: "Mar", sent: 4800, delivered: 4600, failed: 200 },
        { month: "Apr", sent: 6100, delivered: 5800, failed: 300 },
        { month: "May", sent: 5700, delivered: 5500, failed: 200 },
        { month: "Jun", sent: 6300, delivered: 6100, failed: 200 },
        { month: "Jul", sent: 5900, delivered: 5700, failed: 200 },
    ];

    const revenueData = [
        { month: "Jan", revenue: 12500 },
        { month: "Feb", revenue: 14200 },
        { month: "Mar", revenue: 13500 },
        { month: "Apr", revenue: 16800 },
        { month: "May", revenue: 15500 },
        { month: "Jun", revenue: 17200 },
        { month: "Jul", revenue: 16500 },
    ];

    const gatewayDistributionData = [
        { name: "Twilio", value: 35, color: "#3B82F6" },
        { name: "Nexmo", value: 25, color: "#10B981" },
        { name: "Plivo", value: 20, color: "#8B5CF6" },
        { name: "Bandwidth", value: 15, color: "#F59E0B" },
        { name: "Others", value: 5, color: "#EF4444" },
    ];

    const countryDistributionData = [
        { country: "USA", sms: 3200, color: "#3B82F6" },
        { country: "UK", sms: 1800, color: "#10B981" },
        { country: "Canada", sms: 1500, color: "#8B5CF6" },
        { country: "Australia", sms: 1200, color: "#F59E0B" },
        { country: "Germany", sms: 900, color: "#EF4444" },
    ];

    const recentActivities = paymentsData?.data?.transactions?.map(t => ({
        id: t.id,
        user: "You",
        action: `Payment ${t.status}`,
        target: `BDT ${t.amount}`,
        time: new Date(t.createdAt).toLocaleString(),
        status: t.status === 'completed' ? 'success' : t.status === 'failed' ? 'error' : 'warning'
    })) || [];

    const topUsers = [
        { id: 1, name: "Enterprise Corp", smsSent: 12500, revenue: 42500 },
        { id: 2, name: "Tech Solutions", smsSent: 9800, revenue: 33200 },
        { id: 3, name: "Global Retail", smsSent: 7600, revenue: 25800 },
        { id: 4, name: "Health Plus", smsSent: 6200, revenue: 21000 },
        { id: 5, name: "EduTech Inc", smsSent: 5400, revenue: 18300 },
    ];

    // Stats cards data with user-specific stats
    const stats = [
        {
            title: "Total Balance",
            value: `BDT ${userStats.totalBalance.toFixed(2)}`,
            change: userStats.completedTransactions > 0 ? "+" + userStats.completedTransactions + " txns" : "0 txns",
            trend: userStats.completedTransactions > 0 ? "up" : "down",
            icon: <DollarSign className="h-6 w-6" />,
            color: "bg-blue-500 dark:bg-blue-600",
            textColor: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            description: "Total completed payments",
        },
        {
            title: "Completed Transactions",
            value: userStats.completedTransactions.toString(),
            change: userStats.completedTransactions > 0 ? "Successful" : "No transactions",
            trend: userStats.completedTransactions > 0 ? "up" : "down",
            icon: <CheckCircle className="h-6 w-6" />,
            color: "bg-green-500 dark:bg-green-600",
            textColor: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            description: "Successful payments",
        },
        {
            title: "Failed Transactions",
            value: userStats.failedTransactions.toString(),
            change: userStats.failedTransactions > 0 ? "Failed" : "No failures",
            trend: userStats.failedTransactions > 0 ? "down" : "up",
            icon: <XCircle className="h-6 w-6" />,
            color: "bg-red-500 dark:bg-red-600",
            textColor: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-50 dark:bg-red-900/20",
            description: "Failed payment attempts",
        },
        {
            title: "Pending Transactions",
            value: userStats.pendingTransactions.toString(),
            change: userStats.pendingTransactions > 0 ? "Awaiting" : "None pending",
            trend: userStats.pendingTransactions > 0 ? "up" : "down",
            icon: <Clock className="h-6 w-6" />,
            color: "bg-amber-500 dark:bg-amber-600",
            textColor: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
            description: "Pending payments",
        },
        {
            title: "SMS Configuration",
            value: smsConfigs?.data?.length > 0 ? "Active" : "Not Set",
            change: smsConfigs?.data?.length > 0 ? "Configured" : "Auto-setup pending",
            trend: smsConfigs?.data?.length > 0 ? "up" : "down",
            icon: <Send className="h-6 w-6" />,
            color: "bg-purple-500 dark:bg-purple-600",
            textColor: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            description: smsConfigs?.data?.length > 0 ? "SMS gateway ready" : "Will auto-create after payment",
        },
        {
            title: "Last Payment",
            value: userStats.lastTransactionDate ? new Date(userStats.lastTransactionDate).toLocaleDateString() : "No payments",
            change: userStats.completedTransactions > 0 ? "Recent" : "Never",
            trend: userStats.completedTransactions > 0 ? "up" : "down",
            icon: <Calendar className="h-6 w-6" />,
            color: "bg-emerald-500 dark:bg-emerald-600",
            textColor: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            description: "Most recent payment",
        },
    ];

    // Framer motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    // Chart colors based on theme
    const chartGridColor = currentTheme === "dark" ? "#374151" : "#f0f0f0";
    const chartTextColor = currentTheme === "dark" ? "#9CA3AF" : "#666";
    const chartTooltipBg = currentTheme === "dark" ? "#1F2937" : "#FFFFFF";
    const chartTooltipBorder = currentTheme === "dark" ? "#374151" : "#E5E7EB";

    if (isLoading || userPaymentLoading || smsConfigsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6"
        >
            {/* Header */}
            <motion.div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Welcome back, {user?.name || 'Admin'}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Your personal dashboard overview
                        </p>
                    </div>
                    
                    {/* Professional Loader/Success Message */}
                    <AnimatePresence mode="wait">
                        {isCreatingConfig && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800"
                            >
                                <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                                <div>
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                        Configuring SMS Gateway
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                        Setting up your default configuration...
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {showConfigSuccess && !isCreatingConfig && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800"
                            >
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                        SMS Gateway Ready
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        Configuration completed successfully
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <button className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                            <Download className="h-5 w-5" />
                            <span className="hidden md:inline">Export Report</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 mb-8"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900 transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                                {stat.icon}
                            </div>
                            <div
                                className={`flex items-center gap-1 text-sm font-medium ${
                                    stat.trend === "up"
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                )}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {stat.value}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">
                            {stat.title}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                            {stat.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* SMS Volume Chart */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                SMS Volume Analytics
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Monthly sent vs delivered
                            </p>
                        </div>
                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={smsVolumeData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={chartGridColor}
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: chartTextColor }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: chartTextColor }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: chartTooltipBg,
                                        borderColor: chartTooltipBorder,
                                        borderRadius: "0.5rem",
                                        color: currentTheme === "dark" ? "#F3F4F6" : "#111827",
                                    }}
                                />
                                <Bar
                                    dataKey="sent"
                                    fill="#3B82F6"
                                    name="Sent"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="delivered"
                                    fill="#10B981"
                                    name="Delivered"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="failed"
                                    fill="#EF4444"
                                    name="Failed"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Revenue Chart */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Revenue Growth
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Monthly revenue trends
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                Revenue
                            </span>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="#8B5CF6"
                                            stopOpacity={currentTheme === "dark" ? 0.3 : 0.1}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#8B5CF6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={chartGridColor}
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: chartTextColor }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: chartTextColor }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: chartTooltipBg,
                                        borderColor: chartTooltipBorder,
                                        borderRadius: "0.5rem",
                                        color: currentTheme === "dark" ? "#F3F4F6" : "#111827",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8B5CF6"
                                    fill="url(#colorRevenue)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Distribution & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Gateway Distribution */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 lg:col-span-1"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Gateway Distribution
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                SMS traffic by gateway
                            </p>
                        </div>
                        <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartPieChart>
                                <Pie
                                    data={gatewayDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {gatewayDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: chartTooltipBg,
                                        borderColor: chartTooltipBorder,
                                        borderRadius: "0.5rem",
                                        color: currentTheme === "dark" ? "#F3F4F6" : "#111827",
                                    }}
                                />
                            </RechartPieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Recent Activities */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 lg:col-span-2"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Recent Payment Activities
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Your latest payment transactions
                            </p>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.length > 0 ? (
                            recentActivities.slice(0, 5).map((activity) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 rounded-full ${
                                                activity.status === "success"
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                    : activity.status === "warning"
                                                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                                                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                            }`}
                                        >
                                            {activity.status === "success" ? (
                                                <CheckCircle className="h-5 w-5" />
                                            ) : activity.status === "warning" ? (
                                                <Clock className="h-5 w-5" />
                                            ) : (
                                                <XCircle className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {activity.user}{" "}
                                                <span className="font-normal text-gray-600 dark:text-gray-400">
                                                    • {activity.action}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {activity.target} • {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No recent activities found
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Users */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Top Users
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                By SMS volume and revenue
                            </p>
                        </div>
                        <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="space-y-4">
                        {topUsers.map((user, index) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.smsSent.toLocaleString()} SMS sent
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        ${user.revenue.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        +{Math.floor(Math.random() * 20) + 5}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Country Distribution */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Country Distribution
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                SMS traffic by country
                            </p>
                        </div>
                        <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="space-y-4">
                        {countryDistributionData.map((country) => (
                            <div key={country.country} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {country.country}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {country.sms.toLocaleString()} SMS
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full"
                                        style={{
                                            width: `${(country.sms / 3200) * 100}%`,
                                            backgroundColor: country.color,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Total SMS across all countries</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                8,600
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Stats Footer */}
            <motion.div
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">API Requests</p>
                            <p className="text-2xl font-bold">12.5K</p>
                        </div>
                        <Activity className="h-8 w-8 opacity-90" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Uptime</p>
                            <p className="text-2xl font-bold">99.98%</p>
                        </div>
                        <Shield className="h-8 w-8 opacity-90" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Pending Tasks</p>
                            <p className="text-2xl font-bold">42</p>
                        </div>
                        <Bell className="h-8 w-8 opacity-90" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Storage Used</p>
                            <p className="text-2xl font-bold">78%</p>
                        </div>
                        <Database className="h-8 w-8 opacity-90" />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;