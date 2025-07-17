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
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const streamMessage = async (userMessage: ChatMessageType) => {
    setIsProcessing(true);
    pushMessage(userMessage);

    try {
      pushMessage({ role: "assistant", content: "", status: "pending" });

      await runMessageStream(
        sessionId,
        userMessage,
        abortControllerRef.current.signal,
        (event, data) => {
          switch (event) {
            case "message_agent":
              handleMessageAgentEvent(data);
              break;

            case "message_delta":
              handleMessageDeltaEvent(data);
              break;
          }
        }
      );
    } catch (error) {
      if (error !== ABORT_MESSAGE_REASON) {
        console.error(error);
      }
    } finally {
      updateLastMessage(last => ({ ...last, status: "done" }));
      setIsProcessing(false);
    }
  };

  const handleMessageAgentEvent = (data: string) => {
    updateLastMessage(last => ({ 
      ...last, 
      agent: data, 
      status: "thinking"
    }));
  };

  const handleMessageDeltaEvent = (data: string) => {
    const { agent, content } = JSON.parse(data);
    updateLastMessage(last => ({ 
      ...last, 
      agent, 
      content: last.content + content, 
      status: "outputting"
    }));
  };

  const pushMessage = (msg: ChatMessageType | AgentMessageType) => {
    setMessages(prev => [...prev, msg]);
  };

  const updateLastMessage = (updater: (last: AgentMessageType) => AgentMessageType) =>
    setMessages(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      const updated = updater(last as AgentMessageType);
      return [...prev.slice(0, -1), updated];
    });

  const abortMessage = () => {
    abortControllerRef.current.abort(ABORT_MESSAGE_REASON);
    abortControllerRef.current = new AbortController();
    updateLastMessage(last => ({ ...last, status: "done" }));
    setIsProcessing(false);
  };

  return (
    <div className="m-2 md:m-4 pb-24">
      <ChatLog messages={messages} />
      <InputBox
        pinToBottom={messages.length > 0}
        isProcessing={isProcessing}
        onSend={streamMessage}
        onCancel={abortMessage}
      />
    </div>
  );
};

export default Chat;
