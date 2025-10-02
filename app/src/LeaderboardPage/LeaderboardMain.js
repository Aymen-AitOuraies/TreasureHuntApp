import react from "react";
import Layout from "../components/Layout";
import DecorativeTitle from "../components/DecorativeTitle";
import LeaderboardCard from "./components/LeaderboardCard";
export default function LeaderboardMain({ onNavigate }) {
  const leaderboardData = [
   { rank: 1, teamName: "Hunters", level: 5, currentXP: 180, maxXP: 300 },
              { rank: 2, teamName: "Snipers", level: 4, currentXP: 220, maxXP: 250 },
              { rank: 3, teamName: "Vikings", level: 4, currentXP: 150, maxXP: 250 },
              { rank: 4, teamName: "Demons", level: 3, currentXP: 120, maxXP: 200 },
              { rank: 5, teamName: "Pirates", level: 3, currentXP: 80, maxXP: 200 },
  ];
  return (
    <Layout onNavigate={onNavigate} currentPage="leaderboard">
      <div className="-mt-14">
          <DecorativeTitle title="Global Standing" />
          <div className="mt-8 space-y-3">
            {leaderboardData.map((team) => (
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
      </div>
    </Layout>
  );
}
