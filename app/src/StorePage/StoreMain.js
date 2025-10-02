import react from "react";
import Layout from "../components/Layout";
import DecorativeTitle from "../components/DecorativeTitle";
import StoreCard from "./components/StoreCard";

export default function StoreMain({ onNavigate }) {
  const powerUps = [
    {
      id: 1,
      powerName: "Freeze",
      description: "Stops the chosen team for 10 mins",
      price: 100,
      icon: "/assets/StoreAssets/FreezeIcon.png"
    },
    {
      id: 2,
      powerName: "Bomb",
      description: "Reduces target’s XP by 100",
      price: 150,
      icon: "/assets/StoreAssets/BombIcon.png"
    },
    {
      id: 3,
      powerName: "Poison",
      description: "Next puzzle gives 50% less XP",
      price: 200,
      icon: "/assets/StoreAssets/PoisonIcon.png"
    }
  ];

  return (
    <Layout onNavigate={onNavigate} currentPage="store">
      <div className="-mt-14">
        <DecorativeTitle title="Treasure Store" />
        <div className="mt-6 space-y-4">
          {powerUps.map((powerUp) => (
            <StoreCard
              key={powerUp.id}
              powerName={powerUp.powerName}
              description={powerUp.description}
              price={powerUp.price}
              icon={powerUp.icon}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}