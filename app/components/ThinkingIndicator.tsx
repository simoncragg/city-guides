const ThinkingIndicator = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Agent is thinking"
      aria-busy="true"
      className="inline-flex items-center pointer-events-none text-muted-foreground"
    >
      <span className="block h-4 w-4 rounded-full bg-current opacity-40 animate-busy-pulse motion-reduce:animate-none motion-reduce:opacity-100"></span>
    </div>
  );
};

export default ThinkingIndicator;
