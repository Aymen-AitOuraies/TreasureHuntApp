import React from "react";
import Layout from "../components/Layout";
import DecorativeTitle from "../components/DecorativeTitle";
import LeaderboardCard from "../LeaderboardPage/components/LeaderboardCard";
import { useState, useEffect, useRef } from "react";
import { saveLeaderboardToLocalStorage, getLeaderboardFromLocalStorage } from "../services/leaderboardService";
import { getGameSettings, getGameSettingsFromLocalStorage } from "../services/gameService";
import leaderboardWsService from "../services/leaderboardWebSocketService";

export default function GameInProgressPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameSettings, setGameSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasSubscribed = useRef(false);

  useEffect(() => {
    const cachedLeaderboard = getLeaderboardFromLocalStorage();
    if (cachedLeaderboard) {
      console.log('📦 GameInProgressPage: Using cached leaderboard', cachedLeaderboard);
      setLeaderboard(cachedLeaderboard);
      setLoading(false);
    }

    const cachedSettings = getGameSettingsFromLocalStorage();
    if (cachedSettings) {
      setGameSettings(cachedSettings);
    } else {
      fetchGameSettings();
    }

    connectToLeaderboardWebSocket();

    return () => {
      if (hasSubscribed.current) {
        leaderboardWsService.unsubscribe();
        hasSubscribed.current = false;
      }
    };
  }, []);

  const fetchGameSettings = async () => {
    try {
      const settings = await getGameSettings();
      setGameSettings(settings);
    } catch (error) {
      console.error('❌ GameInProgressPage: Failed to fetch game settings:', error);
      setGameSettings({ xpperLevel: 75 });
    }
  };

  const connectToLeaderboardWebSocket = () => {
    if (hasSubscribed.current) {
      console.log('⚠️ GameInProgressPage: Already subscribed');
      return;
    }

    leaderboardWsService.connect(
      () => {
        console.log('✅ GameInProgressPage: Leaderboard WebSocket connected');
        subscribeToLeaderboard();
      },
      (error) => {
        console.error('❌ GameInProgressPage: Leaderboard WebSocket connection error:', error);
        setLoading(false);
      }
    );
  };

  const subscribeToLeaderboard = () => {
    if (hasSubscribed.current) {
      return;
    }

    leaderboardWsService.subscribeToLeaderboard((leaderboardData) => {
      console.log('🔄 GameInProgressPage: Leaderboard updated via WebSocket:', leaderboardData);
      setLeaderboard(leaderboardData);
      saveLeaderboardToLocalStorage(leaderboardData);
      setLoading(false);
    });

    hasSubscribed.current = true;
  };

  const calculateMaxXP = (level) => {
    const xpPerLevel = gameSettings?.xpperLevel || 75;
    return level * xpPerLevel;
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-secondary font-cormorant text-xl">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img 
          src="/assets/GlobalAssets/PaperBackground.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: "url('/assets/GlobalAssets/BackgroundLayer.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white bg-opacity-80 rounded-lg p-6 mb-6 text-center shadow-lg">
            <h1 className="text-3xl font-cormorant font-bold text-secondary mb-3">
              Game in Progress
            </h1>
            <p className="text-lg font-cormorant text-gray-700">
              The game is currently being played. You can view the live leaderboard below.
            </p>
          </div>

          <div className="-mt-0">
            <DecorativeTitle title="Leaderboard" />
            <div className="mt-8 space-y-3">
              {leaderboard.length === 0 ? (
                <div className="bg-white bg-opacity-80 rounded-lg p-8 text-center">
                  <p className="text-secondary font-cormorant text-xl">No teams yet</p>
                </div>
              ) : (
                leaderboard.map((team) => (
                  <LeaderboardCard
                    key={team.id}
                    rank={team.rank}
                    teamName={team.name}
                    level={team.level}
                    currentXP={team.xp}
                    maxXP={calculateMaxXP(team.level)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
