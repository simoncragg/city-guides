import React, { useEffect, useRef } from "react";

import type { AgentMessageType, ChatMessageType } from "../types";
import AgentMessage from "./AgentMessage";
import UserMessage from "./UserMessage";

interface ChatLogProps {
  messages: ChatMessageType[];
};

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {

  const bottomRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ul className="grid gap-8 relative">
      {messages.map((message, idx) => (
        <li key={idx} className="grid items-start gap-2">
          {message.role === "user" ? (
            <UserMessage message={message} />
          ) : (
            <AgentMessage message={message as AgentMessageType} />
          )}
        </li>
      ))}
      <li ref={bottomRef} />
    </ul>
  );
};

export default ChatLog;
