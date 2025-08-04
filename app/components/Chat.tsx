import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { AgentMessageType, ChatMessageType } from "../types";

import ChatLog from "./ChatLog";
import GreetingCard from "./GreetingCard";
import InputBox, { type InputBoxHandle } from "./InputBox";
import useMarkdownDeferrer from "../hooks/useMarkdownDeferrer";
import { runMessageStream } from "../services/chatService";

const ABORT_MESSAGE_REASON = "User Cancelled";

const Chat: React.FC = () => {

  const { deferIncompleteMarkdown, flush } = useMarkdownDeferrer(); 
  const abortControllerRef = useRef<AbortController>(new AbortController());
  const inputBoxHandle = useRef<InputBoxHandle>(null);

  const [sessionId] = useState<string | null>(uuidv4());
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showGreetingCard, setShowGreetingCard] = useState<boolean>(true);

  const streamMessage = async (userMessage: ChatMessageType) => {
    setIsProcessing(true);
    setShowGreetingCard(false);
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

            case "message_thinking_status":
              handleThinkingStatusEvent(data);
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
      const content = flush();
      updateLastMessage(last => ({
        ...last, 
        content: last.content + content, 
        status: "done"
      }));
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

  const handleThinkingStatusEvent = (data: string) => {
    updateLastMessage(last => ({ 
      ...last, 
      thinkingStatus: data
    }));
  };

  const handleMessageDeltaEvent = (data: string) => {
    const { agent, content } = JSON.parse(data) as AgentMessageType;
    const delta = deferIncompleteMarkdown(content);
    updateLastMessage(last => ({ 
      ...last, 
      agent,
      content: last.content + delta,
      thinkingStatus: undefined,
      status: delta.length > 0 ? "outputting" : "deferring",
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

  const onSuggestionClicked = (suggestion: string) => {
    setShowGreetingCard(false);
    requestAnimationFrame(() => inputBoxHandle.current?.focus());
    streamMessage({ role: "user", content: suggestion});
  };

  const onGreetingCardDismissed = () => {
    setShowGreetingCard(false);
    requestAnimationFrame(() => inputBoxHandle.current?.focus());
  };

  return (
    <>
      {showGreetingCard && (
        <GreetingCard
          onSuggestionClicked={onSuggestionClicked} 
          onDismiss={onGreetingCardDismissed}
        />
      )}
    
      <div className="m-2 md:m-4 pb-24">
      
        <ChatLog messages={messages} />
        <InputBox
          ref={inputBoxHandle}
          pinToBottom={messages.length > 0 || showGreetingCard}
          isProcessing={isProcessing}
          onSend={streamMessage}
          onCancel={abortMessage}
        />
      </div>
    </>
  );
};

export default Chat;
