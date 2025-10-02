import React from "react";
import { Icon } from "@iconify/react";

export default function NavBar({ onNavigate, currentPage = "puzzle" }) {
  const navItems = [
    {
      id: "puzzle",
      name: "Puzzle",
      iconOutline: "game-icons:jigsaw-piece",
      iconFilled: "game-icons:jigsaw-piece"
    },
    {
      id: "leaderboard", 
      name: "Leaderboard",
      iconOutline: "mingcute:trophy-line",
      iconFilled: "mingcute:trophy-fill"
    },
    {
      id: "store",
      name: "Store", 
      iconOutline: "mingcute:shopping-bag-2-line",
      iconFilled: "mingcute:shopping-bag-2-fill"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background to-white/70">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate && onNavigate(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentPage === item.id
                ? "text-black"
                : "text-black/70"
            }`}
          >
            <Icon 
              icon={currentPage === item.id ? item.iconFilled : item.iconOutline}
              className={`text-4xl mb-1 ${
                currentPage === item.id ? "text-black" : "text-black/70"
              }`}
            />
            <span className="font-cormorant font-bold" style={{ fontSize: '18px' }}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}