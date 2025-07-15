import React from "react";

const AgentAvatar: React.FC<{ name: string }> = ({ name }) => {
  return (
    <img 
      src={`${import.meta.env.VITE_PUBLIC_URL}/avatars/${name.toLowerCase()}-sm-min.png`} 
      className="-mt-1 w-[48px] h-[50px]"
      alt={name}
    />
  )
};

export default AgentAvatar;
