import React from "react";

import type { AgentMessageType } from "../types";
import ThinkingIndicator from "./ThinkingIndicator";
import ThinkingStatus from "./ThinkingStatus";

interface AgentMessageStatusProps {
  message: AgentMessageType;
}

const AgentMessageStatus: React.FC<AgentMessageStatusProps> = ({ message }) => {
  
  if (message.thinkingStatus) return (
    <ThinkingStatus thinkingStatus={message.thinkingStatus} />
  );

  if (message.status === "thinking" || message.status === "deferring") {
    return (
      <ThinkingIndicator />
    );
  }
};

export default AgentMessageStatus;
