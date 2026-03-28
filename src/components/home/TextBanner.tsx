
import banner from "@/assets/Home/knot2 1.png";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PopupButton } from "react-calendly";
import Heading from "../reusable-components/Heading";
import Link from "next/link";

const TextBanner = () => {
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const animateText = () => {
            if (headingRef.current) {
                const text = headingRef.current.innerText;
                headingRef.current.innerHTML = text
                    .split("")
                    .map((char, index) => <span key={index}>${char}</span>)
                    .join("");

                const chars = headingRef.current.children;

                gsap.fromTo(
                    chars,
                    { opacity: 0, y: 20, color: "orange" },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.05,
                        duration: 1,
                        ease: "power2.out",
                        onUpdate: function () {
                            Array.from(chars).forEach((char, index) => {
                                gsap.to(char, {
                                    color: index === Math.floor(this.progress() * chars.length) ? "orange" : "black",
                                    duration: 0.1,
                                });
                            });
                        },
                        onComplete: () => {
                            setTimeout(() => animateText(), 3000);
                        },
                    }
                );
            }
        };
        
        animateText();
    }, []);

    return (
        <div
            style={{
                backgroundImage: `url(${banner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "45vh",
                color: "white",
            }}
            className="flex justify-center"
        >
            <div className="md:w-2/5 pt-10">
                <Heading
                    ref={headingRef}
                    className="text-2xl md:text-4xl font-bold text-black text-center"
                >
                    Building Software to <br /> Solve, Scale, and Succeed.
                </Heading>
                <p className="px-4 md:px-0 mt-5 text-xs font-semibold text-black text-center">
                    From sparking ideas to driving growth, we guide you through every step of product development.
                    Partner with a team truly dedicated to your success in conquering the market.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    {/* Book an Appointment Button with Calendly Popup */}
                    <PopupButton
                        url="https://calendly.com/techelementit"
                        rootElement={document.getElementById("root") || document.body}
                        text="Book an appointment"
                        className="bg-[#1C75BC] hover:bg-tertiary font-semibold text-xs px-4 py-2 text-white animate-pulse hover:animate-none duration-700 rounded"
                    />

                    {/* See Company Profile Button */}
                    <Link href={'/about'}>
                    <button className="border border-[#1C75BC] duration-300 font-semibold hover:bg-tertiary hover:text-white text-xs px-4 py-2 text-[#1C75BC] rounded">
                        See Company Profile
                    </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TextBanner;