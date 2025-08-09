import React, { useId, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import type { ThinkingActivityType } from "../types";
import ThinkingStatusIcon from "./ThinkingStatusIcon";
import { TextShimmer } from "./TextShimmer";

interface ThinkingActivityProps {
  activity: ThinkingActivityType;
}

const ThinkingActivity: React.FC<ThinkingActivityProps> = ({ activity }) => {
  const { status, description, actions } = activity;

  const [open, setOpen] = useState(false);
  const actionsCount = actions.length;
  const canToggle = actionsCount > 1;
  
  const baseId = useId();
  const buttonId = `${baseId}-toggle`;
  const panelId = `${baseId}-panel`;

  return (
    <div className="flex items-start gap-1">
      <div className="self-start">
        <ThinkingStatusIcon thinkingStatus={status} size={6} />
      </div>

      <div className="flex-1">
        {canToggle ? (
          <button
            id={buttonId}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(v => !v)}
            className="inline-flex items-center gap-1 rounded-md p-1 -m-1 hover:bg-neutral-100 focus:outline-none focus:ring-0"
          >
            <TextShimmer>{description}</TextShimmer>
            <FiChevronDown
              className={`transition-transform duration-200 ease-out ${open ? "rotate-180" : "rotate-0"}`}
              aria-hidden="true"
            />
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <TextShimmer>{description}</TextShimmer>
          </div>
        )}

        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          aria-hidden={!open || !canToggle}
          className={`mt-1 grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
            open && canToggle ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <ul className="overflow-hidden list-disc pl-5 text-neutral-600">
            {actions.map((action, i) => (
              <li key={`thinking-action-${i}`} className="wrap-break-word">
                <span className="font-mono">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThinkingActivity;
