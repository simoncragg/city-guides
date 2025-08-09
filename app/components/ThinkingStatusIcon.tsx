import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { IoCameraOutline } from "react-icons/io5";

import type { ThinkingStatusType } from "../types";

interface ThinkingStatusIconProps {
  thinkingStatus: ThinkingStatusType,
  size: number;
}

const ThinkingStatusIcon: React.FC<ThinkingStatusIconProps> = ({ thinkingStatus, size }) => {

  const classes = `w-${size} h-${size} text-gray-700 mt-1`;

  switch (thinkingStatus) {
    case "FindingPlaces": 
      return (<IoLocationOutline className={classes} />);
    case "GettingPhotos":
      return (<IoCameraOutline className={classes} />);
  }
};

export default ThinkingStatusIcon;
