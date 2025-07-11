import React from "react";

import type { AgentMessageType } from "../types";

import AgentAvatar from "./AgentAvatar";
import { marked } from "marked";

const AgentMessage: React.FC<{ message: AgentMessageType }> = ({ message }) => {
  return (
    <div className="flex flex-row gap-6">
      <AgentAvatar name={message.agent} />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold">{message.agent}</span>
        <div className="text-neutral-950 space-y-4" dangerouslySetInnerHTML={{ __html: marked.parse(message.content) as string }} />
      </div>
    </div>
  );
}

export default AgentMessage;
