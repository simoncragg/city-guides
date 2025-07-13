import React from "react";

import type { ChatMessageType } from "../types";

const UserMessage: React.FC<{ message: ChatMessageType }> = ({ message }) => {
  return (
    <div className="px-4 py-3 rounded-2xl bg-gray-100 ml-auto max-w-7/10">
      {message.content}
    </div>
  );
}

export default UserMessage;
