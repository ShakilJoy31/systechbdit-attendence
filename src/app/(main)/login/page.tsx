
import EnterpriseLoginForm from "@/components/authentication/LoginForm";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Login | Linuxeon",
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

const LoginPage = () => {
  return (
    <div className="bg-[#F4F6F8] dark:bg-gray-600 min-h-screen ">
     <EnterpriseLoginForm></EnterpriseLoginForm>
    </div>
  )
}

export default LoginPage;
