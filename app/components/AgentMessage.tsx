import React from "react";

import type { AgentMessageType } from "../types";
import AgentAvatar from "./AgentAvatar";
import PendingAgentIndicator from "./PendingAgentIndicator";
import ThinkingIndicator from "./ThinkingIndicator";
import { marked } from "marked";

const AgentMessage: React.FC<{
  message: AgentMessageType;
  lastAgent: string | undefined;
}> = ({ message, lastAgent }) => {
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
          <span
            className={`
              [&_ul>li]:mt-2.5 [&_ol>li]:mt-2.5
              [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6
              [&_p]:inline [&_p]:m-0
              [&_a]:text-sky-800
              [&_img]:rounded-xl [&_img]:mt-4 [&_img]:mb-8
            `}
            dangerouslySetInnerHTML={{
              __html: marked.parse(message.content) as string,
            }}
          />
          {(message.status === "thinking" || message.status === "deferring") && <ThinkingIndicator />}
        </div>
      </div>
    </div>
  );
};

export default AgentMessage;
