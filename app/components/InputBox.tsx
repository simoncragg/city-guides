import React, { useRef } from "react";
import { FaArrowUp } from "react-icons/fa6";

import type { ChatMessageType } from "../types";
import { buildUserMessage } from "../builders/messageBuilder";

interface InputBoxProps {
  onSubmit: (message: ChatMessageType) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onSubmit }) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const text = textareaRef?.current?.value.trim()
    if (text) {
      const message = buildUserMessage(text);
      onSubmit(message);
      textareaRef!.current!.value = "";
    }
  };

  return (
    <div className="fixed inset-x-0 p-4 bottom-0">
      <div className="max-w-md mx-auto relative">
        <textarea
          ref={textareaRef}
          aria-label="Ask anything"
          placeholder="Ask anything"
          rows={2}
          className="w-full px-4 py-3 rounded-3xl border border-gray-200 bg-gray-50 text-neutral-950 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
          autoFocus
        />
        <button
          type="button"
          aria-label="Send question"
          onClick={handleSubmit}
          className="absolute bottom-3 right-2 p-3 bg-sky-500 text-white rounded-full shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};

export default InputBox;
