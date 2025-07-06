import React, { useRef } from "react";
import { FaArrowUp } from "react-icons/fa6";

interface InputBoxProps {
	onSubmit: (text: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onSubmit }) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = () => {
		const text = textareaRef?.current?.value.trim()
    if (text) {
			onSubmit(text);
		}
	};

  return (
    <div className="fixed inset-x-0 bottom-0 p-4">
			<div className="max-w-md mx-auto relative">
				<textarea
				  ref={textareaRef}
					aria-label="Ask anything"
					placeholder="Ask anything"
					rows={2}
					className="
						w-full 
						px-4 
						py-3 
						rounded-3xl 
						border border-gray-200 
						bg-gray-50 
						text-gray-700 
						shadow-sm 
						resize-none 
						focus:outline-none 
						focus:ring-2 focus:ring-sky-400
					"
				/>
				<button
					type="button"
					aria-label="Send question"
					onClick={handleSubmit}
					className="
						absolute 
						bottom-3 right-2
						p-3 
						bg-sky-500 
						text-white 
						rounded-full 
						shadow 
						hover:bg-sky-600 
						focus:outline-none 
						focus:ring-2 focus:ring-sky-400
						transition
					"
				>
					<FaArrowUp />
				</button>
			</div>
		</div>
  );
};

export default InputBox;
