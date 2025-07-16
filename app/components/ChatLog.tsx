import React, { useEffect, useRef } from "react";

import type { AgentMessageType, ChatMessageType } from "../types";
import AgentMessage from "./AgentMessage";
import UserMessage from "./UserMessage";

interface ChatLogProps {
  messages: ChatMessageType[];
}

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  let currentAgent: string | undefined;

  return (
    <ul className="grid gap-10 md:gap-16 relative">
      {messages.map((message, idx) => {
        const lastAgent = currentAgent;

        if (message.role === "assistant") {
          currentAgent = (message as AgentMessageType).agent;
        }

        return (
          <li key={idx} className="grid items-start gap-2">
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
      <li ref={bottomRef} />
    </ul>
  );
};

export default ChatLog;
