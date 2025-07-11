import React from "react";

const AgentAvatar: React.FC<{ name: string }> = ({ name }) => {
  return (
    <img 
      src={`/app/assets/avatars/${name}-sm-min.png`} 
      className="w-[48px] h-[50px]"
      alt={name}>
    </img>
  )
};

export default AgentAvatar;
