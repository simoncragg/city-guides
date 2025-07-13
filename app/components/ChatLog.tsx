import React, { useEffect, useRef } from "react";

import type { AgentMessageType, ChatMessageType } from "../types";
import AgentMessage from "./AgentMessage";
import ThinkingIndicator from "./ThinkingPulse";
import UserMessage from "./UserMessage";

interface ChatLogProps {
  messages: ChatMessageType[];
  isThinking: boolean;
};

const ChatLog: React.FC<ChatLogProps> = ({ messages, isThinking }) => {

  const bottomRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ul className="grid gap-10 md:gap-16 relative">
      {messages.map((message, idx) => (
        <li key={idx} className="grid items-start gap-2">
          {message.role === "user" ? (
            <UserMessage message={message} />
          ) : (
            <AgentMessage message={message as AgentMessageType} />
          )}
        </li>
      ))}
      <li ref={bottomRef}>
        {isThinking && (
          <div className="ml-0 md:ml-16">
            <ThinkingIndicator />
          </div>
        )}
      </li>
    </ul>
  );
};

export default ChatLog;
