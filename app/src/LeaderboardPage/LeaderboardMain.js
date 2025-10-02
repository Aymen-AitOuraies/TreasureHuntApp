import react from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import PlayerInfo from "../components/PlayerInfo";
import DecorativeTitle from "../components/DecorativeTitle";
import LeaderboardCard from "./components/LeaderboardCard";
export default function LeaderboardMain() {
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

        <main className="pb-20 px-4 -mt-16">
          <DecorativeTitle title="Global Standing" />
          {/* Leaderboard Content */}
          <div className="mt-8 space-y-3">
            {/* Sample leaderboard data */}
            {[
              { rank: 1, teamName: "Hunters", level: 5, currentXP: 180, maxXP: 300 },
              { rank: 2, teamName: "Snipers", level: 4, currentXP: 220, maxXP: 250 },
              { rank: 3, teamName: "Vikings", level: 4, currentXP: 150, maxXP: 250 },
              { rank: 4, teamName: "Demons", level: 3, currentXP: 120, maxXP: 200 },
              { rank: 5, teamName: "Pirates", level: 3, currentXP: 80, maxXP: 200 },
            ].map((team) => (
              <LeaderboardCard
                key={team.rank}
                rank={team.rank}
                teamName={team.teamName}
                level={team.level}
                currentXP={team.currentXP}
                maxXP={team.maxXP}
              />
            ))}
          </div>
        </main>

        <div className="h-8"></div>
        <NavBar />
      </div>
    </div>
  );
}
