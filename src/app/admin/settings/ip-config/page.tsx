import WifiIpConfigList from "@/components/ipconfig/WifiIpConfigList";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
    return generateDynamicMetadata({
        title: "WiFi IP Configuration | Attendance Management System",
        description: "Manage office WiFi IP addresses for attendance verification. Add, edit, and configure trusted networks.",
        keywords: [
            "wifi ip", "ip configuration", "office network", "attendance network",
            "trusted networks", "ip management", "network security"
        ],
    });
}

const WifiIpConfigPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Loading WiFi IP Configuration...</p>
                </div>
            </div>
        }>
            <div className="min-h-screen p-4 md:p-6 lg:p-8">
                <WifiIpConfigList />
            </div>
        </Suspense>
    );
};

export default WifiIpConfigPage;