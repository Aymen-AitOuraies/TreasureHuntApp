import React, { useState, useEffect, useRef } from "react";
import { getTeamByPlayerId, saveTeamToLocalStorage, getTeamFromLocalStorage } from "../services/teamService";
import { getPlayerFromLocalStorage } from "../LoginPage/services/authService";
import { getGameSettings, saveGameSettingsToLocalStorage, getGameSettingsFromLocalStorage } from "../services/gameService";
import { getLeaderboardFromLocalStorage } from "../services/leaderboardService";
import teamWsService from "../services/teamWebSocketService";
import leaderboardWsService from "../services/leaderboardWebSocketService";

export default function PlayerInfo() {
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null);
  const [teamRank, setTeamRank] = useState(null);
  const [gameSettings, setGameSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasSubscribed = useRef(false); 
  const hasSubscribedLeaderboard = useRef(false);
  const leaderboardCallbackRef = useRef(null);

  useEffect(() => {
    const playerData = getPlayerFromLocalStorage();
    console.log('👤 PlayerInfo: Player data from localStorage:', playerData);
    setPlayer(playerData);

    fetchGameSettings();
    
    const cachedLeaderboard = getLeaderboardFromLocalStorage();
    if (cachedLeaderboard) {
      console.log('📦 PlayerInfo: Checking cached leaderboard for rank');
      updateTeamRank(cachedLeaderboard);
    }

    if (playerData?.id) {
      console.log('✅ PlayerInfo: Player ID found:', playerData.id);
      fetchTeamData(playerData.id);
      connectToTeamWebSocket();
      connectToLeaderboardWebSocket();
    } else {
      console.error('❌ PlayerInfo: No player ID found in localStorage');
      setLoading(false);
    }

    return () => {
      if (team?.id) {
        teamWsService.unsubscribeFromTeam(team.id);
      }
      if (leaderboardCallbackRef.current) {
        leaderboardWsService.removeCallback(leaderboardCallbackRef.current);
      }
    };
  }, []);

  const fetchGameSettings = async () => {
    const cachedSettings = getGameSettingsFromLocalStorage();
    if (cachedSettings) {
      console.log('📦 PlayerInfo: Using cached game settings', cachedSettings);
      setGameSettings(cachedSettings);
    }

    try {
      const settings = await getGameSettings();
      console.log('✅ PlayerInfo: Game settings fetched', settings);
      setGameSettings(settings);
      saveGameSettingsToLocalStorage(settings);
    } catch (error) {
      console.error('❌ PlayerInfo: Failed to fetch game settings:', error);
      if (!cachedSettings) {
        setGameSettings({ xpPerLevel: 75 }); 
      }
    }
  };

  const fetchTeamData = async (playerId) => {
    const cachedTeam = getTeamFromLocalStorage();
    if (cachedTeam) {
      console.log('📦 PlayerInfo: Using cached team data', cachedTeam);
      setTeam(cachedTeam);
      setLoading(false);
    }

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
    teamWsService.connect(
      () => {
        console.log('✅ PlayerInfo: Team WebSocket connected');
        
        const cachedTeam = getTeamFromLocalStorage();
        if (cachedTeam?.id && !hasSubscribed.current) {
          subscribeToTeamUpdates(cachedTeam.id);
        }
      },
      (error) => {
        console.error('❌ PlayerInfo: Team WebSocket connection error:', error);
      }
    );
  };

  const subscribeToTeamUpdates = (teamId) => {
    if (hasSubscribed.current) {
      console.log('⚠️ PlayerInfo: Already subscribed to team updates');
      return;
    }
    
    console.log('📡 PlayerInfo: Subscribing to team updates for team:', teamId);
    teamWsService.subscribeToTeamUpdates(teamId, (updatedTeam) => {
      console.log('🔄 PlayerInfo: Team updated via WebSocket:', updatedTeam);
      setTeam(updatedTeam);
      saveTeamToLocalStorage(updatedTeam);
    });
    hasSubscribed.current = true;
  };

  const connectToLeaderboardWebSocket = () => {
    if (hasSubscribedLeaderboard.current) {
      console.log('⚠️ PlayerInfo: Already subscribed to leaderboard');
      return;
    }

    leaderboardWsService.connect(
      () => {
        console.log('✅ PlayerInfo: Leaderboard WebSocket connected');
        subscribeToLeaderboard();
      },
      (error) => {
        console.error('❌ PlayerInfo: Leaderboard WebSocket connection error:', error);
      }
    );
  };

  const subscribeToLeaderboard = () => {
    if (hasSubscribedLeaderboard.current) {
      return;
    }
    const callback = (leaderboardData) => {
      console.log('🔄 PlayerInfo: Leaderboard updated via WebSocket', leaderboardData);
      
      updateTeamRank(leaderboardData);
    };
    
    leaderboardCallbackRef.current = callback;
    leaderboardWsService.subscribeToLeaderboard(callback);

    hasSubscribedLeaderboard.current = true;
  };

  const updateTeamRank = (leaderboardData) => {
    const currentTeam = getTeamFromLocalStorage();
    if (currentTeam?.id && leaderboardData) {
      const teamInLeaderboard = leaderboardData.find(t => t.id === currentTeam.id);
      if (teamInLeaderboard) {
        console.log(`🏆 PlayerInfo: Team rank updated to ${teamInLeaderboard.rank}`);
        console.log(`📊 PlayerInfo: Team XP: ${teamInLeaderboard.xp}, Level: ${teamInLeaderboard.level}`);
        
        setTeamRank(teamInLeaderboard.rank);
        
        setTeam(prevTeam => {
          if (!prevTeam) return prevTeam;
          
          const updatedTeam = {
            ...prevTeam,
            xp: teamInLeaderboard.xp,
            level: teamInLeaderboard.level
          };
          
          saveTeamToLocalStorage(updatedTeam);
          
          return updatedTeam;
        });
      } else {
        console.log('⚠️ PlayerInfo: Team not found in leaderboard');
      }
    }
  };

  useEffect(() => {
    if (team?.id && !hasSubscribed.current) {
      subscribeToTeamUpdates(team.id);
      
      const cachedLeaderboard = getLeaderboardFromLocalStorage();
      if (cachedLeaderboard && !teamRank) {
        console.log('📦 PlayerInfo: Updating rank from cached leaderboard after team loaded');
        updateTeamRank(cachedLeaderboard);
      }
    }
  }, [team?.id]);

  const xpPerLevel = gameSettings?.xpperLevel || 75; 
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
        
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <span className="text-[20px] font-cormorant font-bold">
              {teamRank !== null ? `#${teamRank}` : '-'}
            </span>
            <img 
              src="/assets/GlobalAssets/RankingCoin.png" 
              alt="Team Rank" 
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