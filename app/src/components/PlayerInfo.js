import React, { useState, useEffect } from "react";
import { getTeamByPlayerId, saveTeamToLocalStorage, getTeamFromLocalStorage } from "../services/teamService";
import { getPlayerFromLocalStorage } from "../LoginPage/services/authService";
import { getGameSettings, saveGameSettingsToLocalStorage, getGameSettingsFromLocalStorage } from "../services/gameService";
import teamWsService from "../services/teamWebSocketService";

export default function PlayerInfo() {
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null);
  const [gameSettings, setGameSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get player from localStorage
    const playerData = getPlayerFromLocalStorage();
    console.log('👤 PlayerInfo: Player data from localStorage:', playerData);
    setPlayer(playerData);

    // Fetch game settings
    fetchGameSettings();

    if (playerData?.id) {
      console.log('✅ PlayerInfo: Player ID found:', playerData.id);
      fetchTeamData(playerData.id);
      connectToTeamWebSocket();
    } else {
      console.error('❌ PlayerInfo: No player ID found in localStorage');
      setLoading(false);
    }

    return () => {
      // Cleanup WebSocket on unmount
      if (team?.id) {
        teamWsService.unsubscribeFromTeam(team.id);
      }
    };
  }, []);

  const fetchGameSettings = async () => {
    // First try to get from localStorage
    const cachedSettings = getGameSettingsFromLocalStorage();
    if (cachedSettings) {
      console.log('📦 PlayerInfo: Using cached game settings', cachedSettings);
      setGameSettings(cachedSettings);
    }

    // Then fetch fresh data from API
    try {
      const settings = await getGameSettings();
      console.log('✅ PlayerInfo: Game settings fetched', settings);
      setGameSettings(settings);
      saveGameSettingsToLocalStorage(settings);
    } catch (error) {
      console.error('❌ PlayerInfo: Failed to fetch game settings:', error);
      // Use default if no cached settings
      if (!cachedSettings) {
        setGameSettings({ xpPerLevel: 75 }); // Default fallback
      }
    }
  };

  const fetchTeamData = async (playerId) => {
    // First try to get from localStorage
    const cachedTeam = getTeamFromLocalStorage();
    if (cachedTeam) {
      console.log('📦 PlayerInfo: Using cached team data', cachedTeam);
      setTeam(cachedTeam);
      setLoading(false);
    }

    // Then fetch fresh data from API
    try {
      console.log('🔄 PlayerInfo: Fetching team data for player:', playerId);
      const teamData = await getTeamByPlayerId(playerId);
      console.log('✅ PlayerInfo: Team data fetched successfully', teamData);
      setTeam(teamData);
      saveTeamToLocalStorage(teamData);
      setLoading(false);
    } catch (error) {
      console.error('❌ PlayerInfo: Failed to fetch team data:', error);
      console.error('❌ PlayerInfo: Error details:', error.message);
      
      // If no cached data, set a fallback based on error
      if (!cachedTeam) {
        if (error.message && error.message.includes('not assigned to any team')) {
          setTeam({
            id: null,
            name: "No Team Assigned",
            xp: 0,
            level: 1,
            players: []
          });
        } else {
          setTeam({
            id: null,
            name: "No Team",
            xp: 0,
            level: 1,
            players: []
          });
        }
      }
      setLoading(false);
    }
  };

  const connectToTeamWebSocket = () => {
    if (!teamWsService.isConnected()) {
      teamWsService.connect(
        // onConnected
        () => {
          console.log('✅ PlayerInfo: Team WebSocket connected');
          
          // Subscribe to team updates once we have team data
          const cachedTeam = getTeamFromLocalStorage();
          if (cachedTeam?.id) {
            subscribeToTeamUpdates(cachedTeam.id);
          }
        },
        // onError
        (error) => {
          console.error('❌ PlayerInfo: Team WebSocket connection error:', error);
        }
      );
    } else {
      // Already connected, just subscribe
      const cachedTeam = getTeamFromLocalStorage();
      if (cachedTeam?.id) {
        subscribeToTeamUpdates(cachedTeam.id);
      }
    }
  };

  const subscribeToTeamUpdates = (teamId) => {
    teamWsService.subscribeToTeamUpdates(teamId, (updatedTeam) => {
      console.log('🔄 PlayerInfo: Team updated via WebSocket:', updatedTeam);
      setTeam(updatedTeam);
      saveTeamToLocalStorage(updatedTeam);
    });
  };

  // Subscribe to team updates when team data is loaded
  useEffect(() => {
    if (team?.id && teamWsService.isConnected()) {
      subscribeToTeamUpdates(team.id);
    }
  }, [team?.id]);

  // Calculate XP for next level (simple formula: level * xpPerLevel)
  const xpPerLevel = gameSettings?.xpperLevel || 75; // Note: API returns 'xpperLevel' (lowercase 'p')
  const maxXP = team?.level ? team.level * xpPerLevel : xpPerLevel;
  const currentXP = team?.xp || 0;

  return (
    <div className="py-2 px-4 bg-white bg-opacity-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="font-cormorant font-medium text-[20px]">
            {player?.fullName || "Loading..."}
          </h2>
          <p className="font-cormorant font-bold text-[16px]">
            {team?.name || "Loading team..."}
          </p>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-[20px] font-cormorant font-bold">{team?.xp || 0}</span>
            <img 
              src="/assets/GlobalAssets/CoinsIcon.png" 
              alt="XP" 
              className="w-[34px] h-[34px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-[20px] font-cormorant font-bold">{team?.id || '-'}</span>
            <img 
              src="/assets/GlobalAssets/RankingCoin.png" 
              alt="Team ID" 
              className="w-[34px] h-[34px]"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between items-center ">
          <span className="text-[25px] font-cormorant font-bold ">
            Level {team?.level || 1}
          </span>
          <span className="text-[18px] font-cormorant font-bold">
            {currentXP}/{maxXP} xp
          </span>
        </div>
        
        <div className="w-full bg-secondary rounded-full h-[12px] overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.min((currentXP / maxXP) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}