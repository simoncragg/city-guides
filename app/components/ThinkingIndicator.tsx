const ThinkingIndicator = () => (
  <span
    role="status"
    aria-live="polite"
    aria-busy="true"
    aria-label="Agent is thinking"
    className="inline-block align-middle"
  >
    <span className="block -mt-0.5 h-4 w-4 rounded-full bg-current opacity-40 animate-busy-pulse" />
  </span>
);

export default ThinkingIndicator;
