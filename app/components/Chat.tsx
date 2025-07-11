import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { ChatMessageType } from "../types";

import ChatLog from "./ChatLog";
import InputBox from "./InputBox";
import { sendMessageAsync } from "../services/chatService";

const Chat: React.FC = () => {

  const [sessionId] = useState<string | null>(uuidv4());
  const [messages, setMessages] = useState<ChatMessageType[]>([]);

  const sendUserMessage = async (userMessage: ChatMessageType) => {
    setMessages(prev => [...prev, userMessage]);
    const agentMessage = await sendMessageAsync(sessionId, userMessage);
    setMessages(prev => [...prev, agentMessage]);
  };

  return (
    <div className="m-4 pb-16">
      <ChatLog messages={messages} />
      <InputBox pinToBottom={messages.length > 0} onSubmit={sendUserMessage} />
    </div>
  );
};

export default Chat;
