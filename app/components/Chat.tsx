import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { AgentMessageType, ChatMessageType } from "../types";

import ChatLog from "./ChatLog";
import InputBox from "./InputBox";
import { runMessageStream } from "../services/chatService";

const ABORT_MESSAGE_REASON = "User Cancelled";

const Chat: React.FC = () => {

  const abortControllerRef = useRef<AbortController>(new AbortController());

  const [sessionId] = useState<string | null>(uuidv4());
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const streamMessage = async (userMessage: ChatMessageType) => {
    
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    try {
      await runMessageStream(sessionId, userMessage, abortControllerRef.current.signal, (_, data) => {
        const { agent, content } = JSON.parse(data); 
        setIsThinking(false);
        setIsStreaming(true);

        setMessages(prev => {
          if (!prev.length || prev[prev.length - 1].role !== "assistant") {
            return [
              ...prev,
              {
                role: "assistant",
                content,
                agent
              } as AgentMessageType,
            ];
          }

          const last   = prev[prev.length - 1] as AgentMessageType;
          const merged = {
            ...last,
            agent: last.agent ?? agent,
            content: last.content + content,
          };

          return [...prev.slice(0, -1), merged];
        });
      });
    } catch (error) {
      if (error !== ABORT_MESSAGE_REASON) {
        console.error(error);
      }
    } finally {
      setIsThinking(false)
      setIsStreaming(false)
    }
  };

  const abortMessage = () => {
    abortControllerRef.current.abort(ABORT_MESSAGE_REASON);
    abortControllerRef.current = new AbortController();
    setIsThinking(false);
    setIsStreaming(false);
  };

  return (
    <div className="m-2 md:m-4 pb-24">
      <ChatLog messages={messages} isThinking={isThinking} />
      <InputBox 
        pinToBottom={messages.length > 0} 
        isProcessing={isThinking || isStreaming} 
        onSend={streamMessage} 
        onCancel={abortMessage}
      />
    </div>
  );
};

export default Chat;
