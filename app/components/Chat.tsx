import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { ChatMessageType } from "../types";

import ChatLog from "./ChatLog";
import InputBox from "./InputBox";
import { sendMessageAsync } from "../services/chatService";

const Chat: React.FC = () => {

  const abortController = useRef<AbortController>(new AbortController());

  const [sessionId] = useState<string | null>(uuidv4());
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  const sendMessage = async (userMessage: ChatMessageType) => {

    setIsSending(true);
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const agentMessage = await sendMessageAsync(
        sessionId, 
        userMessage, 
        abortController.current.signal
      );
      setMessages(prev => [...prev, agentMessage]);
    }
    catch(error: unknown) {
      if ((error as DOMException).name !== "AbortError") {
        console.error(error);
      }
    }
    finally {
      setIsSending(false);
    }
  };

  const abortMessage = () => {
    abortController.current.abort("user cancelled");
    abortController.current = new AbortController();
    setIsSending(false);
  };

  return (
    <div className="m-2 md:m-4 pb-16">
      <ChatLog messages={messages} />
      <InputBox 
        pinToBottom={messages.length > 0} 
        isSending={isSending} 
        onSend={sendMessage} 
        onCancel={abortMessage} />
    </div>
  );
};

export default Chat;
