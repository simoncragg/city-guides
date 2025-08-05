import React, { useEffect, useRef } from "react";

import type { AgentMessageType, ChatMessageType } from "../types";
import AgentMessage from "./AgentMessage";
import UserMessage from "./UserMessage";

interface ChatLogProps {
  messages: ChatMessageType[];
}

const TALL_MESSAGE_THRESHOLD = 0.3;
const SCROLL_MARGIN_TOP_SM = 16
const SCROLL_MARGIN_TOP_LG = 48;

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {
  const lastUserMessageRef = useRef<HTMLLIElement>(null);

  const lastUserIndex = messages.reduce<number>(
    (prev, msg, i) => (msg.role === "user" ? i : prev),
    -1
  );

  useEffect(() => {
    if (lastUserIndex < 0 || !lastUserMessageRef.current) return;

    const el = lastUserMessageRef.current;
    const isTall = el.offsetHeight > window.innerHeight * TALL_MESSAGE_THRESHOLD;
    const offset = isTall ? 0 - el.offsetHeight + SCROLL_MARGIN_TOP_LG : SCROLL_MARGIN_TOP_SM;

    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [lastUserIndex]);

  let currentAgent: string | undefined;

  return (
    <div className={`grid gap-10 md:gap-16 relative ${messages.length > 0 ? "mb-[90vh]" : ""}`}>

      {messages.map((message, idx) => {
        const lastAgent = currentAgent;
        const isLastUserMessage = idx === lastUserIndex;

        if (message.role === "assistant") {
          currentAgent = (message as AgentMessageType).agent;
        }

        return (
          <article 
            key={idx} 
            ref={isLastUserMessage ? lastUserMessageRef : null}
            className="grid items-start gap-2">
            {message.role === "user"
              ? <UserMessage message={message} />
              : <AgentMessage message={message as AgentMessageType} lastAgent={lastAgent} />
            }
          </article>
        );
      })}
    </div>
  );
};

export default ChatLog;
