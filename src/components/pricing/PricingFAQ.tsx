"use client";
import AnimatedText from "../reusable-components/AnimatedText";
import ServiceFAQComponent from "../service/ServiceFAQCard";

interface FAQItem {
    number: string;
    question: string;
    answer?: string;
}

const faqs: FAQItem[] = [
    {
        number: "(001)",
        question: "Can I buy SMS credits instead of a monthly plan?",
        answer: "Yes! We offer a Pay As You Go option where you purchase SMS credits in bulk at discounted rates. Credits never expire and you only pay for what you use. This is perfect for businesses with variable SMS volumes or seasonal campaigns.",
    },
    {
        number: "(002)",
        question: "How do I switch to a different SMS plan?",
        answer: "You can upgrade or downgrade your plan anytime from your account dashboard. Upgrades take effect immediately, while downgrades apply at the start of your next billing cycle. All unused SMS credits are carried over when you change plans.",
    },
    {
        number: "(003)",
        question: "What payment methods do you accept for SMS services?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and digital payments. Enterprise customers can request invoicing with net-30 terms. All transactions are secured with 256-bit SSL encryption.",
    },
    {
        number: "(004)",
        question: "What happens if I exceed my monthly SMS limit?",
        answer: "If you reach your monthly SMS limit, we automatically apply overage rates at $0.02 per additional SMS. You can also upgrade your plan mid-month or purchase additional SMS credits. We'll send alerts when you reach 80%, 90%, and 100% of your limit.",
    },
    {
        number: "(005)",
        question: "Do you offer custom pricing for high-volume SMS senders?",
        answer: "Absolutely! For businesses sending 100,000+ SMS per month, we provide custom enterprise pricing with volume discounts, dedicated account management, SLAs, and custom features. Contact our sales team for a personalized quote based on your specific needs.",
    },
    {
        number: "(006)",
        question: "Is there a setup fee or contract required?",
        answer: "No setup fees and no long-term contracts required. All our plans are month-to-month with the option for annual billing at a discount. You can cancel anytime with no penalties. Enterprise plans may require annual commitments for custom features.",
    },
    {
        number: "(007)",
        question: "Do SMS credits expire or roll over?",
        answer: "SMS credits purchased through Pay As You Go never expire. For monthly plans, unused SMS do not roll over to the next month. We recommend choosing a plan that matches your average monthly usage or using the Pay As You Go option for flexibility.",
    },
    {
        number: "(008)",
        question: "What support is included with each pricing plan?",
        answer: "All plans include email support. Business and higher plans include priority chat support. Enterprise plans include 24/7 phone support and dedicated account management. All customers have access to our comprehensive knowledge base and API documentation.",
    },
];


export default function PricingFAQ() {
    return (
        <section className="bg-white dark:bg-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
                {/* Section title - moves to top on mobile */}
                <div className="lg:w-1/5">
                    <p className="text-gray-500 dark:text-gray-300 pt-5 text-sm">SMS FAQ</p>
                </div>

                {/* FAQ list */}
                <div className="lg:w-4/5">
                 <AnimatedText className="text-4xl sm:text-5xl md:text-[60px] lg:text-[70px] font-semibold leading-tight mb-6 sm:mb-10"
                            text="SMS Pricing Questions Answered"
                            loop={false}
                            
                        />
                    {/* <h2 className="text-4xl sm:text-5xl md:text-[60px] lg:text-[70px] font-semibold leading-tight mb-6 sm:mb-10">
                        
                    </h2> */}

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