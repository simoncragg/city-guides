import React from "react";

import type { AgentMessageType } from "../types";
import ThinkingIndicator from "./ThinkingIndicator";
import ThinkingActivity from "./ThinkingActivity";

interface AgentMessageStatusProps {
  message: AgentMessageType;
}

const AgentMessageStatus: React.FC<AgentMessageStatusProps> = ({ message }) => {
  
  if (message.thinkingActivity) return (
    <ThinkingActivity activity={message.thinkingActivity} />
  );

  if (message.status === "thinking" || message.status === "deferring") {
    return (
      <ThinkingIndicator />
    );
  }
};

export default AgentMessageStatus;
