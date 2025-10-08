import React from "react";

export default function PlayerCard({ playerName, className = "" }) {
  const nameParts = playerName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className={`w-[100px] h-[100px] border-[3px] border-primary rounded-full flex items-center justify-center bg-white bg-opacity-50 ${className}`}>
      <div 
        className="text-secondary font-cormorant font-bold text-[24px] text-center px-2 w-full"
        title={playerName}
      >
        <div className="truncate leading-tight">
          {firstName}
        </div>
        {lastName && (
          <div className="truncate leading-tight">
            {lastName}
          </div>
        )}
      </div>
    </div>
  );
}