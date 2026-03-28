"use client";

import Image from "next/image";
import trustedImage from "@/assets/Icons/partner (1).svg";
import trustedImage2 from "@/assets/Icons/partner (2).svg";
import trustedImage3 from "@/assets/Icons/partner (3).svg";
import trustedImage4 from "@/assets/Icons/partner (4).svg";
import trustedImage5 from "@/assets/Icons/partner (5).svg";
import trustedImage6 from "@/assets/Icons/partner (6).svg";
import trustedImage7 from "@/assets/Icons/partner (7).svg";
import trustedImage8 from "@/assets/Icons/partner (8).svg";
import trustedImage9 from "@/assets/Icons/partner (9).svg";
import trustedImage11 from "@/assets/Icons/trusted-team (2).svg";
import trustedImage12 from "@/assets/Icons/trusted-team (3).svg";
import trustedImage13 from "@/assets/Icons/trusted-team (4).svg";
import Heading from "../reusable-components/Heading";

export default function TrustedByTeam() {
  const logos = [
    trustedImage.src,
    trustedImage2.src,
    trustedImage3.src,
    trustedImage4.src,
    trustedImage5.src,
    trustedImage6.src,
    trustedImage7.src,
    trustedImage8.src,
    trustedImage9.src,
    trustedImage11.src,
    trustedImage12.src,
    trustedImage13.src,
  ];

  return (
    <section className="bg-white dark:bg-cyan-500 py-10 overflow-hidden h-[279px] mb-[6px] ">
      <Heading className="text-center text-gray-500 dark:text-black text-[16px] mb-[50px] font-bold">
        Trusted by businesses worldwide
      </Heading>

      <div className='slider'>
        <div className='slideTrack'>
          {[...logos, ...logos].map((logo, idx) => (
            <div key={idx} className='slide'>
              <Image
                src={logo}
                alt={`Logo ${idx}`}
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}