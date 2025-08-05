import React from "react";

import type { AgentMessageType } from "../types";
import ThinkingIndicator from "./ThinkingIndicator";
import { TextShimmer } from "./TextShimmer";

interface AgentMessageStatusProps {
  message: AgentMessageType;
}

const AgentMessageStatus: React.FC<AgentMessageStatusProps> = ({ message }) => {
  return (
    <>
      {message.thinkingStatus
        ? <TextShimmer>{message.thinkingStatus}</TextShimmer>
        : (message.status === "thinking" || message.status === "deferring") && <ThinkingIndicator />
      }
    </>
  );
};

export default AgentMessageStatus;
