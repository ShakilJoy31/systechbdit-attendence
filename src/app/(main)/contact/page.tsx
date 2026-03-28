// import ContactBanner from "@/components/contact/ContactBanner";
import ContactSection from "@/components/contact/ContactSection";
import GoogleMap from "@/components/contact/Googlemap";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Tech Element IT | Contact",
    description: "Your Vision Our Code & Technology. Building Software to Solve, Scale, and Succeed. From sparking ideas to driving growth, we guide you through every step of product development.",
    keywords: ["tech element it", "software development", "custom software",
      "web development", "app development", "product development",
      "software solutions", "digital transformation", "scalable software",
      "tech partners", "MVP development", "SaaS", "full-stack development"],
  });
}


export default function ContactComponent() {
  return (
    <div className="mt-6">
      {/* <ContactBanner></ContactBanner> */}
      <ContactSection></ContactSection>
       <GoogleMap></GoogleMap>
    </div>
  );
}

