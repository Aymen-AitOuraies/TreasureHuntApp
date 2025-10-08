import React from "react";

export default function PlayerInfo({ 
  playerName = "Ahmed Ismail", 
  coins = 300, 
  teamName = "The Vikings", 
  ranking = 3,
  level = 3,
  currentXP = 150,
  maxXP = 225
}) {
  return (
    <div className="py-2 px-4 bg-white bg-opacity-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="font-cormorant font-medium text-[20px]">
            {playerName}
          </h2>
          <p className="font-cormorant font-bold text-[16px]">
            {teamName}
          </p>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-[20px] font-cormorant font-bold">{coins}</span>
            <img 
              src="/assets/GlobalAssets/CoinsIcon.png" 
              alt="Coins" 
              className="w-[34px] h-[34px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-[20px] font-cormorant font-bold">{ranking}</span>
            <img 
              src="/assets/GlobalAssets/RankingCoin.png" 
              alt="Ranking" 
              className="w-[34px] h-[34px]"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between items-center ">
          <span className="text-[25px] font-cormorant font-bold ">
            Level {level}
          </span>
          <span className="text-[18px] font-cormorant font-bold">
            {currentXP}/{maxXP} xp
          </span>
        </div>
        
        <div className="w-full bg-secondary rounded-full h-[12px] overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(currentXP / maxXP) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}