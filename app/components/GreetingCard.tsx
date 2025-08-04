import React from "react";

interface GreetingCardProps {
  onSuggestionClicked: (suggestion: string) => void;
}

const suggestions = [
  "Best street food in Berlin", 
  "24 hrs in Paris", 
  "Hidden jazz bars in Rome"
];

const GreetingCard: React.FC<GreetingCardProps> = ({ onSuggestionClicked }) => {

  return (
    <div
      className={`
        flex flex-col items-center gap-6
        mx-auto 
        px-4 md:px-6 
        pt-4 pb-6
        w-full md:max-w-screen-sm 
        rounded-md
      `}
      role="dialog"
      aria-labelledby="greeting-title"
    >
      <h2 id="greeting-title" className="text-lg font-semibold">
        👋 Planning a trip?
      </h2>
      <p className="mb-1 text-md leading-5 text-center">
        Talk to our local experts for London, Paris, Rome, Berlin or Barcelona.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
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
