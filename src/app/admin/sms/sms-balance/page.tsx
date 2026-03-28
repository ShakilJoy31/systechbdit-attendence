

import PaymentHistory from "@/components/client-components/SMSconfigurations/Client/SendSMS/PaymentHistory";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
    return generateDynamicMetadata({
        title: "Balance | Linuxeon",
        description: "Linuxeon is a cutting-edge SMS and bulk messaging platform that enables businesses to send transactional, promotional, and OTP messages globally. Reliable, scalable, and feature-rich messaging solutions.",
        keywords: [
            "linuxeon", "sms service", "bulk sms", "sms marketing",
            "text messaging", "sms gateway", "transactional sms",
            "promotional sms", "otp sms", "sms platform", "messaging api",
            "sms automation", "sms campaign", "sms software", "sms provider",
            "enterprise sms", "sms reseller", "sms gateway api", "global sms"
        ],
    });
}

const Home = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Loading Client Dashboard...</p>
                </div>
            </div>
        }>
            <PaymentHistory></PaymentHistory>
        </Suspense>
    );
}

export default Home;