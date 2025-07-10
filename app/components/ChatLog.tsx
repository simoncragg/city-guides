import React from "react";
import type { ChatMessage } from "../types";

interface ChatLogProps {
  messages: ChatMessage[];
};

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {

  return (
    <ul className="grid gap-2 relative">
      {messages.map(({ role, content }, idx) => (
        <li key={idx} className="flex">
          {role === "user" ? (
            <p className="inline-block px-4 py-2 rounded-2xl max-w-[60%] bg-sky-800/50 text-gray-100 ml-auto">
              {content}
            </p>
           ) : (
            <p className="p-2 text-gray-70">{content}</p>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ChatLog;
