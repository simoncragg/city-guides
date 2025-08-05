import React from "react";

import type { ThinkingStatusType } from "../types";
import ThinkingStatusIcon from "./ThinkingStatusIcon";
import { TextShimmer } from "./TextShimmer";

interface ThinkingStatusProps {
  thinkingStatus: ThinkingStatusType;
}

const ThinkingStatus: React.FC<ThinkingStatusProps> = ({ thinkingStatus }) => {
  return (
    <div className="flex items-center gap-1">
      <ThinkingStatusIcon thinkingStatus={thinkingStatus} size={5.5} />
      <TextShimmer>{thinkingStatus}</TextShimmer>
    </div>
  );
};

export default ThinkingStatus;
