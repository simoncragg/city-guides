import React, { useRef } from "react";
import { FaArrowUp, FaStop } from "react-icons/fa6";

import type { ChatMessageType } from "../types";
import { buildUserMessage } from "../builders/messageBuilder";

interface InputBoxProps {
  pinToBottom: boolean;
  isProcessing: boolean;
  onSend: (message: ChatMessageType) => void;
  onCancel: () => void;
}

const InputBox: React.FC<InputBoxProps> = ({ pinToBottom, isProcessing, onSend, onCancel }) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleActionButtonClick = () => {

    if (isProcessing) {
      onCancel();
      return;
    }

    const text = textareaRef?.current?.value.trim()
    if (text) {
      const message = buildUserMessage(text);
      onSend(message);
      textareaRef!.current!.value = "";
    }
  };

  return (
    <div className={`fixed inset-x-0 p-4 ${pinToBottom ? "bottom-0" : "bottom-1/2 translate-y-1/2"} transition-all duration-300 ease-in-out`}>
      <div className="max-w-md mx-auto relative">
        <textarea
          ref={textareaRef}
          aria-label="Ask anything"
          placeholder="Ask anything"
          rows={2}
          className="w-full px-4 py-3 rounded-3xl border border-gray-200 bg-gray-50/75 backdrop-blur-xl text-neutral-950 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
          autoFocus
        />
        <button
          type="button"
          aria-label={isProcessing ? "Stop" : "Send"}
          onClick={handleActionButtonClick}
          className="absolute bottom-3 right-2 p-3 bg-sky-500 text-white rounded-full shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
        >
          {isProcessing ? <FaStop /> : <FaArrowUp />}
        </button>
      </div>
    </div>
  );
};

export default InputBox;
