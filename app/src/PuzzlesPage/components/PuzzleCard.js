import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function PuzzleCard({ puzzleName, puzzleNumber, description, isSolved, onSubmit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(puzzleNumber, answer);
    }
  };

  return (
    <div className="bg-white bg-opacity-50 rounded-[14px] border-[3px] border-secondary overflow-hidden">
      <div 
        className="px-4 py-4 flex items-center justify-between cursor-pointer"
        onClick={() => !isSolved && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="text-secondary font-corben font-bold text-[30px]">
            {puzzleNumber}
          </span>
          <span className="text-secondary font-cormorant font-bold text-[24px]">
            {puzzleName}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isSolved && (
            <Icon 
              icon="mdi:check-circle" 
              className="text-secondary text-[36px]"
            />
          )}
          {!isSolved && (
            <Icon 
              icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"} 
              className="text-secondary text-[32px]"
            />
          )}
        </div>
      </div>

      {isExpanded && !isSolved && (
        <div className="px-4 pb-4 pt-2 border-t-2 border-secondary">
          <div className="flex flex-col items-center w-full mt-2">
            <label className="text-secondary font-cormorant text-[20px] font-bold self-start mb-1">
              Answer
            </label>

            <input
              type="text"
              placeholder="Enter your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="bg-primary border-none outline-none p-3 rounded-md w-full placeholder:text-background text-background font-cormorant text-xl"
            />

            <div className="h-3"></div>

            <button
              onClick={handleSubmit}
              className="bg-secondary text-background text-[24px] font-cormorant p-3 rounded-[27px] w-full cursor-pointer"
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
