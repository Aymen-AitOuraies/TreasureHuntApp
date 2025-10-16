import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import DecorativeTitle from "../components/DecorativeTitle";
import LeaderboardCard from "./components/LeaderboardCard";
import { saveLeaderboardToLocalStorage, getLeaderboardFromLocalStorage } from "../services/leaderboardService";
import { getGameSettings, getGameSettingsFromLocalStorage } from "../services/gameService";
import leaderboardWsService from "../services/leaderboardWebSocketService";

export default function LeaderboardMain({ onNavigate }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameSettings, setGameSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasSubscribed = useRef(false);
  const callbackRef = useRef(null); 

  useEffect(() => {
    const cachedLeaderboard = getLeaderboardFromLocalStorage();
    if (cachedLeaderboard) {
      console.log('📦 LeaderboardMain: Using cached leaderboard', cachedLeaderboard);
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
      if (callbackRef.current) {
        leaderboardWsService.removeCallback(callbackRef.current);
        hasSubscribed.current = false;
      }
    };
  }, []);

  const fetchGameSettings = async () => {
    try {
      const settings = await getGameSettings();
      setGameSettings(settings);
    } catch (error) {
      console.error('❌ LeaderboardMain: Failed to fetch game settings:', error);
      setGameSettings({ xpperLevel: 75 }); 
    }
  };

  const connectToLeaderboardWebSocket = () => {
    if (hasSubscribed.current) {
      console.log('⚠️ LeaderboardMain: Already subscribed');
      return;
    }

    leaderboardWsService.connect(
      () => {
        console.log('✅ LeaderboardMain: Leaderboard WebSocket connected');
        subscribeToLeaderboard();
      },
      (error) => {
        console.error('❌ LeaderboardMain: Leaderboard WebSocket connection error:', error);
        setLoading(false);
      }
    );
  };

  const subscribeToLeaderboard = () => {
    if (hasSubscribed.current) {
      return;
    }

    const callback = (leaderboardData) => {
      console.log('🔄 LeaderboardMain: Leaderboard updated via WebSocket:', leaderboardData);
      setLeaderboard(leaderboardData);
      saveLeaderboardToLocalStorage(leaderboardData);
      setLoading(false);
    };
    
    callbackRef.current = callback;
    leaderboardWsService.subscribeToLeaderboard(callback);

    hasSubscribed.current = true;
  };

  const calculateMaxXP = (level) => {
    const xpPerLevel = gameSettings?.xpperLevel || 75;
    return level * xpPerLevel;
  };

  if (loading && leaderboard.length === 0) {
    return (
      <Layout onNavigate={onNavigate} currentPage="leaderboard">
        <div className="-mt-14">
          <DecorativeTitle title="Leaderboard" />
          <div className="mt-8 flex justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
              <p className="text-secondary font-cormorant text-xl">Loading leaderboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onNavigate={onNavigate} currentPage="leaderboard">
      <div className="-mt-14">
        <DecorativeTitle title="Leaderboard" />
        <div className="mt-8 space-y-3">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
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
    </Layout>
  );
}
