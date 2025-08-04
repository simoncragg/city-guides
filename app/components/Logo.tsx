
import React from "react";

interface LogoProps {
  customClasses?: string;
}

const Logo: React.FC<LogoProps> = ({ customClasses = "" }) => {
  return (
    <div className={`flex flex-col items-center pt-4 ${customClasses}`}>
      <img 
        src={`${import.meta.env.VITE_PUBLIC_URL}/logo-min.png`} 
        className="text-9xl mb-3 md:max-w-[600px]"
        alt="City Guides"
      />
      <h1 className="text-4xl font-serif font-bold text-gray-700">
        City Guides
      </h1>
    </div>
  );
}

export default Logo;
