import React from "react";

export default function Header() {
  return (
    <header className="bg-secondary flex justify-between items-center px-6 py-4 shadow-lg">
      <h1 className="text-background text-2xl font-cormorant font-bold">Treasure Hunt</h1>
      <img 
        src="/assets/GlobalAssets/PirateProfile.jpg" 
        alt="Pirate Profile" 
        className="w-12 h-12 rounded-full border-2 border-background object-cover"
      />
    </header>
  );
}