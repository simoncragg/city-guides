import React from "react";

const ThinkingIndicator: React.FC = () => {
  return (
    <span className="relative flex size-4">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
      <span className="relative inline-flex size-4 rounded-full bg-sky-500"></span>
    </span>
  );
}

export default ThinkingIndicator;
