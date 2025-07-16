import React from "react";

const AgentAvatar: React.FC<{ agent: string, grayscale?: boolean }> = ({ agent, grayscale }) => {
  return (
    <img
      src={`${import.meta.env.VITE_PUBLIC_URL}/avatars/${agent.toLowerCase()}-sm-min.png`} 
      className={`-mt-1 w-[48px] h-[50px] ${grayscale && "grayscale"}`}
      alt={agent}
    />
  );
};

export default AgentAvatar;
