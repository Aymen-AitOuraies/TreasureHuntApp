import React from "react";
import Header from "../components/Header";

export default function ArrangingTeamsPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative font-cormorant"
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
      
      <div className="relative z-10">
        <div className="fixed top-0 left-0 right-0 z-20">
          <Header />
        </div>
        
        <div className="pt-24 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-2xl">
            {/* Animated Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-secondary/20 flex items-center justify-center animate-pulse">
                  <svg 
                    className="w-16 h-16 text-secondary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
              Arranging Teams
            </h1>
            
            {/* Description */}
            <p className="text-xl text-secondary/80 mb-8">
              The admin is organizing teams for the treasure hunt.
              <br />
              Please wait while teams are being formed...
            </p>

            {/* Loading Animation */}
            <div className="flex justify-center items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>

            {/* Info Box */}
            <div className="mt-12 bg-primary/10 border-2 border-primary/30 rounded-lg p-6">
              <p className="text-secondary font-cormorant text-lg">
                <strong>Note:</strong> You'll be automatically redirected once the teams are ready and the game begins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
