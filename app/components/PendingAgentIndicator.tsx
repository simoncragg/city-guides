import React, { useState, useEffect } from "react";
import AgentAvatar from "./AgentAvatar";

const ROTATION_DURATION_MS = 750;
const avatars = ["victoria", "augustus", "claude", "marina", "otto"];

const PendingAgentIndicator: React.FC<{ lastAgent: string | undefined }> = ({
  lastAgent,
}) => {
  const initialAgent = lastAgent?.toLowerCase() || "victoria";
  const initialIndex = avatars.indexOf(initialAgent);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const timeouts: number[] = [];

    const intervalId = window.setInterval(() => {
      setRotation((r) => r + 180);

      timeouts.push(
        window.setTimeout(() => {
          setCurrentIndex((i) => (i + 1) % avatars.length);
        }, ROTATION_DURATION_MS / 2)
      );
    }, ROTATION_DURATION_MS);

    return () => {
      clearInterval(intervalId);
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="perspective-midrange">
      <div
        className="w-full h-full transform-3d"
        style={{
          transition: `transform ${(ROTATION_DURATION_MS / 1000).toFixed(2)}s ease-in-out`,
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        <AgentAvatar agent={avatars[currentIndex]} grayscale />
      </div>
    </div>
  );
};

export default PendingAgentIndicator;
