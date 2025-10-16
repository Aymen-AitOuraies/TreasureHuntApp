import React from "react";
import Header from "./Header";
import PlayerInfo from "./PlayerInfo";
import NavBar from "./NavBar";

export default function Layout({ children, onNavigate, currentPage, showTeamIcon = true }) {
  console.log('📐 Layout rendered with showTeamIcon:', showTeamIcon);
  
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

      <div className="relative z-10">
        <div className="fixed top-0 left-0 right-0 z-20">
          <Header showTeamIcon={showTeamIcon} />
        </div>
        
        <div className="pt-20">
          <PlayerInfo />
          <main className="px-4">
            {children}
          </main>

          <div className="h-24"></div>
          <NavBar onNavigate={onNavigate} currentPage={currentPage} />
        </div>
      </div>
    </div>
  );
}