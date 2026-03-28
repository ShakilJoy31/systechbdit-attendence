import Banner from "@/components/home/Banner";
import CustomServices from "@/components/home/CustomServices";
import IndustryExpertise from "@/components/home/IndustryExpertise";
import KeyServices from "@/components/home/KeyServices";
import MeetingComponent from "@/components/home/MeetingComponent";
import PortfolioSlider from "@/components/home/PortfolioSlider";
// import ReviewSection from "@/components/home/ReviewSection";
import StartBuilding from "@/components/home/StartBuilding";
import TrustedByTeam from "@/components/home/TrustedByTeam";
import WhyTechElement from "@/components/home/WhyTechElement";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Linuxeon | Professional SMS & Bulk Messaging Platform",
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
    <div className="bg-[#F4F6F8] dark:bg-gray-600 overflow-x-hidden ">
      <Banner></Banner>
      <div className="dark:bg-black mt-12 md:mt-0 ">
        <CustomServices></CustomServices>
      </div>
      <KeyServices></KeyServices>
      <PortfolioSlider></PortfolioSlider>
      <div className="lg:m-4 md:m-2 m-1">
        <IndustryExpertise></IndustryExpertise>
      </div>
      <MeetingComponent></MeetingComponent>
      <WhyTechElement></WhyTechElement>
      <TrustedByTeam></TrustedByTeam>
      <StartBuilding></StartBuilding>
    </div>
  )
}

export default Home;
