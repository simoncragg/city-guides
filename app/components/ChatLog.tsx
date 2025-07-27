import React, { useEffect, useRef } from "react";

import type { AgentMessageType, ChatMessageType } from "../types";
import AgentMessage from "./AgentMessage";
import UserMessage from "./UserMessage";

interface ChatLogProps {
  messages: ChatMessageType[];
}

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {
  const lastMessageRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = lastMessageRef.current;
    if (el) {
      const offset = 16;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [messages]);

  let currentAgent: string | undefined;

  return (
    <ul className="grid gap-10 md:gap-16 relative">
      {messages.map((message, idx) => {
        const lastAgent = currentAgent;

        if (message.role === "assistant") {
          currentAgent = (message as AgentMessageType).agent;
        }

        const isLast = idx === messages.length - 1;

        return (
          <li 
            key={idx} 
            ref={isLast ? lastMessageRef : null}
            className="grid items-start gap-2">
            {message.role === "user" ? (
              <UserMessage message={message} />
            ) : (
              <AgentMessage
                message={message as AgentMessageType}
                lastAgent={lastAgent}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ChatLog;
