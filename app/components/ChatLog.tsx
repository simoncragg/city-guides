import React, { useEffect, useRef } from "react";
import { marked } from "marked";

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
    <ul className="grid gap-8 relative">
      {messages.map((message, idx) => (
        <li key={idx} className="grid items-start gap-2">
          {message.role === "user" ? (
            <div className="px-4 py-3 rounded-2xl bg-gray-100 ml-auto">
              {message.content}
            </div>
          ) : (
            <div className="flex flex-row gap-6">
              <img 
                src={`/app/assets/avatars/${(message as AgentMessage).agent}-sm-min.png`} 
                className="w-[48px] h-[50px]"
                alt={(message as AgentMessage).agent}>
              </img>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold">{(message as AgentMessage).agent}</span>
                <div className="text-neutral-950 space-y-4" dangerouslySetInnerHTML={{ __html: marked.parse(message.content) as string }} />
              </div>
            </div>
          )}
        </li>
      ))}
      <li ref={bottomRef} />
    </ul>
  );
};

export default ChatLog;
