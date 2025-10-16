import React from "react";
import { Icon } from "@iconify/react";

export default function GameNotStarted() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/assets/GlobalAssets/PaperBackground.jpg')",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/GlobalAssets/BackgroundLayer.png')",
          opacity: 0.11,
        }}
      ></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary font-cormorant mb-8">
              Game Not Started Yet
            </h1>

            <div className="flex items-center justify-center gap-3">
              <div className="w-16 sm:w-24 h-1 bg-secondary rounded-full"></div>
              <Icon icon="game-icons:pirate-flag" className="text-3xl sm:text-4xl text-secondary" />
              <div className="w-16 sm:w-24 h-1 bg-secondary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
