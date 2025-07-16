import React, { useState, useEffect, useRef } from "react";
import AgentAvatar from "./AgentAvatar";
import useImagePreloader from "../hooks/useImagePreloader";

const rotationDurationMs = 750;
const agents = ["victoria", "augustus", "claude", "marina", "otto"];

const PendingAgentIndicator: React.FC<{ lastAgent?: string }> = ({ lastAgent }) => {
  const initialAgent = lastAgent?.toLowerCase() || "victoria";
  const idx = agents.indexOf(initialAgent);
  const initialIndex = idx >= 0 ? idx : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [rotation, setRotation] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const avatarUrls = agents.map(agent => `/avatars/${agent}-sm-min.png`);
  const loadedImages = useImagePreloader(avatarUrls);

  const rafIdRef = useRef<number | null>(null);
  const nextFlipRef = useRef<number>(0);
  const nextSwapRef = useRef<number>(0);

  useEffect(() => {
    if (!loadedImages) return;

    const zoomTimeout = window.setTimeout(() => setZoomed(true), 50);

    let mounted = true;
    const start = performance.now();
    
    nextFlipRef.current = start + rotationDurationMs;
    nextSwapRef.current = nextFlipRef.current + rotationDurationMs / 2;

    const animate = (timestamp: number) => {
      if (!mounted) return;

      if (timestamp >= nextSwapRef.current) {
        setCurrentIndex(i => (i + 1) % agents.length);
        nextSwapRef.current += rotationDurationMs;
      }

      if (timestamp >= nextFlipRef.current) {
        setRotation(r => r + 180);
        nextFlipRef.current += rotationDurationMs;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      mounted = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      clearTimeout(zoomTimeout);
    };
  }, [loadedImages]);

  const rotationDurationSecs = (rotationDurationMs / 1000).toFixed(2);

  return (
    <div 
      role="status"
      aria-label="Waiting for agent"
      className="perspective-midrange"
      style={{
        transition: `transform 0.2s ease-out`,
        transform: `scale(${zoomed ? 1 : 0})`,
      }}
    >
      <div
        className="w-full h-full transform-3d"
        style={{
          transition: `transform ${rotationDurationSecs}s ease-in-out`,
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        <AgentAvatar agent={agents[currentIndex]} grayscale />
      </div>
    </div>
  );
};

export default PendingAgentIndicator;
