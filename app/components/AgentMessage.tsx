import React from "react";

import type { AgentMessageType } from "../types";
import AgentAvatar from "./AgentAvatar";
import PendingAgentIndicator from "./PendingAgentIndicator";
import ThinkingIndicator from "./ThinkingIndicator";
import { marked } from "marked";
import { TextShimmer } from "./TextShimmer";

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
          <span
            className={`
              [&_ul]:mb-4 [&_ol]:mb-4
              [&_ul>li]:mt-4 [&_ol>li]:mt-4
              [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2.5
              [&_p]:inline
            [&_a]:text-sky-800
              [&_img]:rounded-xl [&_img]:my-4
            `}
            dangerouslySetInnerHTML={{
              __html: marked.parse(message.content) as string,
            }}
          />
          {message.thinkingStatus
            ? <p><TextShimmer>{message.thinkingStatus}</TextShimmer></p>
            : (message.status === "thinking" || message.status === "deferring") && <ThinkingIndicator />
          }
        </div>
      </div>
    </div>
  );
};

export default AgentMessage;
