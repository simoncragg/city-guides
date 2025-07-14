import React from "react";
import avatarMap from "../utils/avatarMap";

const AgentAvatar: React.FC<{ name: string }> = ({ name }) => {
  return (
    <img 
      src={avatarMap[name.toLowerCase()]} 
      className="-mt-1 w-[48px] h-[50px]"
      alt={name}
    />
  )
};

export default AgentAvatar;
