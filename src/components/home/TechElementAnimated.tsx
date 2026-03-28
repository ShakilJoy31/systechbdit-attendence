"use client";

import Lottie from 'lottie-react';


const TechElementAnimated = ({ProgrammingAnimation, loop}) => {
  return (
    <>
    <Lottie animationData={ProgrammingAnimation} loop={loop} />
    </>
  );
};

export default TechElementAnimated;
