import React from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import PlayerInfo from "../components/PlayerInfo";

export default function PuzzlesMain({ puzzleNumber = 1 }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/assets/GlobalAssets/PaperBackground.jpg')",
      }}
    >
      {/* Background Layer Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/GlobalAssets/BackgroundLayer.png')",
          opacity: 0.11,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <PlayerInfo />

        <main className="pb-20 px-4">
          {/* Puzzle Header */}
          <div className="flex justify-between items-center mb-4 mt-6">
            <h2 className="text-secondary text-[28px] font-cormorant font-bold">
              Puzzle {puzzleNumber}
            </h2>

            {/* Hint Button */}
            <div className="relative">
              {/* Cost Ticket */}
              <div className="absolute -top-3 -left-3 flex items-center bg-background border-[1px] border-secondary w-[50px] h-[21px] rounded z-10 text-center justify-center">
                <span className="text-secondary font-inknut font-regular mr-1 text-[14px]">
                  150
                </span>
                <img
                  src="/assets/GlobalAssets/CoinsIcon.png"
                  alt="Coins"
                  className="w-[16px] h-[16px]"
                />
              </div>

              {/* Hint Button */}
              <button className="flex items-center justify-center bg-secondary text-background w-[96px] h-[38px] rounded-full font-cormorant font-bold">
                <span className="mr-1 text-[24px] ">Hint</span>
                <img
                  src="/assets/PuzzlesAssets/HintBulb.png"
                  alt="Hint"
                  className="w-[30px] h-[30px"
                />
              </button>
            </div>
          </div>

          {/* Puzzle Content Section */}
          <div className="flex flex-col items-center space-y-2 mt-8">
            {/* Puzzle Image */}
            <div className="w-full max-w-sm px-8">
              <img
                src={`/assets/GlobalAssets/BackgroundLayer.png`}
                alt={`Puzzle ${puzzleNumber}`}
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            {/* Puzzle Text/Description */}
            <div className="px-8 mb-4">
              <p className="text-secondary font-cormorant text-[20px] font-semibold ">
                Red is first, blue is last, Green hides where shadows are cast.
                Put them in order.{" "}
              </p>
            </div>

            {/* Spacer */}
            {/* <div className="h-1"></div> */}

            {/* Answer Input and Submit */}
            <div className="flex flex-col items-center w-full">
              {/* Answer Label */}
              <label className="text-secondary font-cormorant text-[20px] font-bold self-start ml-2 mb-1">
                Answer
              </label>
              
              <input
                type="text"
                placeholder="Enter your answer"
                className="bg-primary border-none outline-none p-3 rounded-md w-[100%] placeholder:text-background text-background font-cormorant text-xl"
              />
              
              <div className="h-4"></div>
              
              <button
                type="submit"
                className="bg-secondary text-background text-[24px] font-cormorant p-3 rounded-[27px] w-[100%] cursor-pointer"
              >
                Submit Answer
              </button>
            </div>
          </div>
        </main>

        {/* Spacer between main and navbar */}
        <div className="h-8"></div>

        <NavBar />
      </div>
    </div>
  );
}
