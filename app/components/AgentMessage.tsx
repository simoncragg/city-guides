import React from "react";

import type { AgentMessageType } from "../types";
import AgentAvatar from "./AgentAvatar";
import AgentMessageStatus from "./AgentMessageStatus";
import PendingAgentIndicator from "./PendingAgentIndicator";
import MarkdownContent from "./MarkdownContent";

interface Props {
  message: AgentMessageType;
  lastAgent: string | undefined;
}

const AgentMessage: React.FC<Props> = ({ message, lastAgent }) => {
  return (
    <div className="flex flex-col md:flex-row gap-1 md:gap-4">
      {message.status === "pending" ? (
        <PendingAgentIndicator lastAgent={lastAgent} />
      ) : (
        message.agent && <AgentAvatar agent={message.agent} />
      )}

      <div className="flex flex-col gap-2.5 md:gap-1">
        <span className="text-xs font-semibold text-center w-[48px] md:text-left md:w-auto">
          {message.agent}
        </span>

        <div className="text-neutral-950">
          <MarkdownContent markdown={message.content} />
          <AgentMessageStatus message={message} />
        </div>
      </div>
    </div>
  );
};

export default AgentMessage;
