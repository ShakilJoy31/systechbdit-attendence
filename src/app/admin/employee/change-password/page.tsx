// app/(dashboard)/employees/change-password/page.tsx
import EmployeePasswordChange from "@/components/client-components/EmployeePasswordChange";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Change Password | Employee Portal | Linuxeon",
    description: "Securely change your employee account password. Linuxeon is a cutting-edge SMS and bulk messaging platform that enables businesses to send transactional, promotional, and OTP messages globally.",
    keywords: [
      "linuxeon", "employee password", "change password", "security",
      "sms service", "bulk sms", "sms marketing", "text messaging",
      "sms gateway", "transactional sms", "promotional sms", "otp sms",
      "sms platform", "messaging api", "enterprise sms"
    ],
  });
}

const EmployeeChangePasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <EmployeePasswordChange />
    </Suspense>
  );
}

export default EmployeeChangePasswordPage;