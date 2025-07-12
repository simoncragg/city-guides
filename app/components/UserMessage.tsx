import React from "react";

import type { ChatMessageType } from "../types";

const UserMessage: React.FC<{ message: ChatMessageType }> = ({ message }) => {
  return (
    <div className="px-4 py-3 rounded-2xl bg-gray-100 ml-auto">
      {message.content}
    </div>
  );
}

export default UserMessage;
