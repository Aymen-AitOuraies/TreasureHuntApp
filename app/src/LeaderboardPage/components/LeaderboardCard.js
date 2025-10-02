import React from "react";

export default function LeaderboardCard({ rank, teamName, level, currentXP, maxXP }) {
  return (
    <div className="bg-white bg-opacity-50 rounded-[14px] h-[80px] px-4 py-[40px] flex items-center justify-between border-[3px] border-secondary">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-[54px] h-[54px]">
          {rank === 1 && (
            <img 
              src="/assets/LeaderboardAssets/Crown.png" 
              alt="Crown" 
              className="w-[64px] h-[64px]"
            />
          )}
          {rank === 2 && (
            <img 
              src="/assets/LeaderboardAssets/Silver.png" 
              alt="Silver Medal" 
              className="w-[54px] h-[54px]"
            />
          )}
          {rank === 3 && (
            <img 
              src="/assets/LeaderboardAssets/Bronze.png" 
              alt="Bronze Medal" 
              className="w-[54px] h-[54px]"
            />
          )}
          {rank > 3 && (
            <span className="text-secondary font-corben font-bold text-[30px]">
              {rank}
            </span>
          )}
        </div>

        <span className="text-secondary font-cormorant font-bold text-[24px]">
          {teamName}
        </span>
      </div>
   
      <div className="flex flex-col items-center space-y-1">
        <span className="text-secondary font-cormorant font-bold text-[20px]">
          Level {level}
        </span>
        
        <div className="w-20">
          <div className="w-full bg-secondary rounded-full h-[8px] overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(currentXP / maxXP) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}