import react, { useState, useEffect } from "react";
import Header from "../components/Header";
import PlayerCard from "./components/PlayerCard";
export default function WaitingPage() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const players = [
    { id: 1, name: "Aymen Aitourais" },
    { id: 2, name: "Amine Edarkaoui" },
    { id: 3, name: "Aaaaaaaa Bbbbbbbbb" },
    { id: 4, name: "PPPPPP OOOOO" },
  ];
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
          <div className="pt-24 display flex flex-col items-center h-screen px-4">
            <h1 className="text-[28px] font-bold text-secondary mb-8">
              The game will start soon{dots}
            </h1>
            
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  playerName={player.name}
                />
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
