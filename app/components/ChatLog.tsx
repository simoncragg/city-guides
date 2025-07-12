import React, { useEffect, useRef } from "react";
import type { AgentMessage, ChatMessage } from "../types";

interface ChatLogProps {
  messages: (ChatMessage | AgentMessage)[];
};

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {

  const bottomRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ul className="grid gap-2 relative">
      {messages.map((message, idx) => (
        <li key={idx} className="flex">
          {message.role === "user" ? (
            <p className="inline-block px-4 py-2 rounded-2xl max-w-[60%] bg-sky-800/50 text-gray-100 ml-auto">
              {message.content}
            </p>
           ) : (
            <p className="p-2 text-gray-70">{(message as AgentMessage).agent}: {message.content}</p>
          )}
        </li>
      ))}
      <li ref={bottomRef} />
    </ul>
  );
};

export default ChatLog;
