import AnimatedText from "../reusable-components/AnimatedText";
import Heading from "../reusable-components/Heading";
import ServiceFAQComponent from "./ServiceFAQCard";

interface FAQItem {
    number: string;
    question: string;
    answer?: string;
}

const faqs: FAQItem[] = [
    {
        number: "(001)",
        question: "How quickly can I start sending SMS messages?",
        answer: "You can start sending SMS within minutes after signing up! Our platform is instant activation - just create your account, verify your identity, and you can immediately send SMS through our dashboard or API.",
    },
    {
        number: "(002)",
        question: "What's your SMS delivery rate guarantee?",
        answer: "We guarantee a 99.9% delivery rate for all SMS messages. Our platform uses multiple carrier routes and automatic failover systems to ensure your messages reach their destination reliably.",
    },
    {
        number: "(003)",
        question: "Can I send SMS internationally with your platform?",
        answer: "Yes! We support SMS delivery to over 200 countries worldwide. Different rates apply for international SMS, and we provide transparent pricing for each destination in your account dashboard.",
    },
    {
        number: "(004)",
        question: "Do you support two-way SMS conversations?",
        answer: "Absolutely! Our platform fully supports two-way SMS messaging. You can receive replies to your messages, enabling interactive conversations with your customers for support, surveys, or engagement.",
    },
    {
        number: "(005)",
        question: "What security measures protect my SMS data?",
        answer: "We implement enterprise-grade security including 256-bit SSL encryption for all data transmission, secure API authentication, GDPR compliance, and regular security audits to protect your messaging data.",
    },
    {
        number: "(006)",
        question: "Can I schedule SMS campaigns in advance?",
        answer: "Yes, our platform includes advanced scheduling features. You can schedule SMS campaigns for specific dates and times, set up recurring messages, and create automated drip campaigns for customer journeys.",
    },
    {
        number: "(007)",
        question: "What type of support is available for SMS issues?",
        answer: "We offer 24/7 support through multiple channels including email, live chat, and phone (for higher plans). All customers have access to our comprehensive knowledge base and detailed API documentation.",
    },
];

export default function ServiceFAQ() {

    return (
        <section className="bg-white dark:bg-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
                {/* Section title - moves to top on mobile */}
                <div className="lg:w-1/5">
                    <p className="text-gray-700 dark:text-gray-300 mb-4 lg:mb-2 text-sm pt-5">SMS FAQ</p>
                </div>

                {/* FAQ list */}
                <div className="lg:w-4/5">
                    <Heading className="text-4xl sm:text-5xl md:text-[60px] lg:text-[70px] font-semibold leading-tight mb-6 sm:mb-10">
                        <AnimatedText
                            text='Common Questions About Our SMS Services'
                            loop={false}
                            speed={0.02}
                        />
                    </Heading>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <ServiceFAQComponent key={index} faq={faq} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}