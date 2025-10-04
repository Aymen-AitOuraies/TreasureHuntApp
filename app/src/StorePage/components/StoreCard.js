import React from "react";

export default function StoreCard({ powerName, description, price, icon, onCardClick }) {
  const handleBuyClick = (e) => {
    e.stopPropagation();
    console.log(`Buying ${powerName}`);
  };

  return (
    <div 
      className="bg-white bg-opacity-50 rounded-[14px] h-[133px] px-4 py-4 flex border-[3px] border-secondary relative cursor-pointer hover:bg-opacity-60 transition-all"
      onClick={onCardClick}
    >
      <div className="flex space-x-4 flex-1">
        <div className="flex items-center justify-center w-[70px] h-[70px] flex-shrink-0 self-center">
            <img 
              src={icon} 
              alt={powerName} 
              className="w-[64px] h-[64px] object-contain"
            />
        </div>
        
        <div className="flex flex-col flex-1 min-w-0 justify-start self-start">
          <span className="font-cormorant font-bold text-[24px] -mb-1">
            {powerName}
          </span>
          <p className="font-cormorant font-medium text-[18px] leading-tight">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end ml-4">
        <div className="flex items-center space-x-2">
          <span className="text-secondary font-cormorant font-bold text-[20px]">{price}</span>
          <img 
            src="/assets/GlobalAssets/CoinsIcon.png" 
            alt="Coins" 
            className="w-[34px] h-[34px]"
          />
        </div>
        
        <button 
          className="bg-secondary text-background w-[71px] h-[32px] rounded-full font-cormorant font-bold text-[20px] hover:bg-secondary transition-colors"
          onClick={handleBuyClick}
        >
          Buy
        </button>
      </div>
    </div>
  );
}