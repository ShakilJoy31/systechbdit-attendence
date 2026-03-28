// components/PaymentGateway.tsx
import Image from "next/image";
import paymentGateWay from '@/assets/Logo/payment-gateway (1).png'
import paymentGateWay2 from '@/assets/Logo/payment-gateway (2).png'
import paymentGateWay3 from '@/assets/Logo/payment-gateway (3).png'
import paymentGateWay4 from '@/assets/Logo/payment-gateway (4).png'
import paymentGateWay5 from '@/assets/Logo/payment-gateway (5).png'
import AnimatedText from "../reusable-components/AnimatedText";

export default function PaymentGateway() {
    const gateways = [
        { src: paymentGateWay.src, alt: "Stripe" },
        { src: paymentGateWay2.src, alt: "PayPal" },
        { src: paymentGateWay3.src, alt: "bKash" },
        { src: paymentGateWay4.src, alt: "Nagad" },
        { src: paymentGateWay5.src, alt: "Rocket" },
    ];

    return (
        <section className="bg-white dark:bg-black py-8">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-0 text-center">
                {/* Title */}
                <AnimatedText
                    text='Payment Gateway'
                    loop={false}
                    className="text-2xl font-semibold mb-12"
                />

                {/* Logo Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-20 gap-y-10">
                    {gateways.map((gateway, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <Image
                                src={gateway.src}
                                alt={gateway.alt}
                                width={100}
                                height={50}
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
