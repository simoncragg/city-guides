import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { IoCameraOutline } from "react-icons/io5";

import type { ThinkingStatusType } from "../types";

interface ThinkingStatusIconProps {
  thinkingStatus: ThinkingStatusType,
  size: number;
}

const ThinkingStatusIcon: React.FC<ThinkingStatusIconProps> = ({ thinkingStatus, size }) => {

  const classes = `w-${size} h-${size} text-gray-700`;

  switch (thinkingStatus) {
    case "Fetching location info": 
      return (<IoLocationOutline className={classes} />);
    case "Getting photos":
      return (<IoCameraOutline className={classes} />);
  }
};

export default ThinkingStatusIcon;
