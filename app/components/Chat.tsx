import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { ChatMessageType } from "../types";

import ChatLog from "./ChatLog";
import InputBox from "./InputBox";
import { sendMessageAsync } from "../services/chatService";

const ABORT_MESSAGE_REASON = "User Cancelled";

const Chat: React.FC = () => {

  const abortController = useRef<AbortController>(new AbortController());

  const [sessionId] = useState<string | null>(uuidv4());
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const sendMessage = async (userMessage: ChatMessageType) => {

    setIsThinking(true);
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
      if (error !== ABORT_MESSAGE_REASON) {
        console.error(error);
      }
    }
    finally {
      setIsThinking(false);
    }
  };

  const abortMessage = () => {
    abortController.current.abort(ABORT_MESSAGE_REASON);
    abortController.current = new AbortController();
    setIsThinking(false);
  };

  return (
    <div className="m-2 md:m-4 pb-24">
      <ChatLog messages={messages} isThinking={isThinking} />
      <InputBox 
        pinToBottom={messages.length > 0} 
        isThinking={isThinking} 
        onSend={sendMessage} 
        onCancel={abortMessage}
      />
    </div>
  );
};

export default Chat;
