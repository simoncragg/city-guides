import React, { useState } from "react";

interface GreetingCardProps {
  onSuggestionClicked: (suggestion: string) => void;
  onDismiss: () => void;
}

const suggestions = [
  "Best street food in Berlin", 
  "24 hrs in Paris", 
  "Hidden jazz bars in Rome"
];

const GreetingCard: React.FC<GreetingCardProps> = ({ onSuggestionClicked, onDismiss }) => {

  const [visible, setVisible] = useState(true);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(), 300);
  };

  return (
    <div
      className={`
        -mt-16 
        md:mx-auto 
        px-4 md:px-6 
        pt-4 pb-6
        w-full md:max-w-screen-sm 
        rounded-lg 
        bg-gray-50 border border-gray-200 drop-shadow-md 
        ${visible ? "animate-fade-in" : "animate-fade-out"}
        `.trim()
      }
      role="dialog"
      aria-labelledby="greeting-title"
    >
      <button
        type="button"
        aria-label="Dismiss greeting panel"
        className="absolute p-3 right-1 top-1 text-2xl text-gray-500 leading-6 focus:outline-none hover:cursor-pointer"
        onClick={dismiss}
      >
        ×
      </button>
      <h2 id="greeting-title" className="mb-4 text-lg font-semibold">
        👋 Planning a trip?
      </h2>
      <p className="mb-5 text-md leading-5">
        Talk to our local experts for London, Paris, Rome, Berlin or Barcelona.
      </p>
      <div className="flex flex-wrap gap-3">
        {suggestions.map(
          suggestion => (
            <button
              key={suggestion}
              className={`
                rounded-full border border-sky-600 px-4 py-2 text-sm text-sky-600 font-semibold 
                hover:cursor-pointer hover:shadow-md transition-shadow duration-300
              `.trim()
              }
              onClick={() => onSuggestionClicked(suggestion)}
            >
              {suggestion}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default GreetingCard;
