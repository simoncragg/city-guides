import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { FaArrowUp, FaStop } from "react-icons/fa6";

import type { ChatMessageType } from "../types";
import { buildUserMessage } from "../builders/messageBuilder";

interface InputBoxProps {
  isProcessing: boolean;
  onSend: (message: ChatMessageType) => void;
  onCancel: () => void;
}

export type InputBoxHandle = {
  focus: () => void;
};

const InputBox = forwardRef<InputBoxHandle, InputBoxProps>((props, ref) => {

  const { isProcessing, onSend, onCancel } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }));

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

  const handleKeypress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isProcessing && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleActionButtonClick();
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
          className="w-full pr-14 pl-4 py-3 rounded-3xl border border-gray-200 bg-gray-50/75 backdrop-blur-xl text-neutral-950 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
          onKeyDown={handleKeypress}
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
});

export default InputBox;
