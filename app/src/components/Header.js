import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TeamModal from "./TeamModal";
import { getTeamByPlayerId, saveTeamToLocalStorage, getTeamFromLocalStorage } from "../services/teamService";
import { getPlayerFromLocalStorage } from "../LoginPage/services/authService";
import teamWsService from "../services/teamWebSocketService";

export default function Header({ showTeamIcon = false }) {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log('🎯 Header rendered with showTeamIcon:', showTeamIcon);
  console.log('👥 Current team state:', team);
  console.log('🔄 Loading state:', loading);

  // Fetch team data when component mounts (if showTeamIcon is true)
  useEffect(() => {
    console.log('🔍 Header useEffect - showTeamIcon:', showTeamIcon);
    if (showTeamIcon) {
      console.log('✅ showTeamIcon is true, fetching team data...');
      fetchTeamData();
      connectToTeamWebSocket();
    } else {
      console.log('❌ showTeamIcon is false, not fetching team data');
    }

    return () => {
      // Cleanup WebSocket on unmount
      if (team?.id) {
        teamWsService.unsubscribeFromTeam(team.id);
      }
    };
  }, [showTeamIcon]);

  const fetchTeamData = async () => {
    // First try to get from localStorage
    const cachedTeam = getTeamFromLocalStorage();
    if (cachedTeam) {
      console.log('📦 Using cached team data');
      setTeam(cachedTeam);
    }

    // Then fetch fresh data from API
    const player = getPlayerFromLocalStorage();
    if (!player?.id) {
      console.error('❌ No player found in localStorage');
      return;
    }

    setLoading(true);
    try {
      const teamData = await getTeamByPlayerId(player.id);
      setTeam(teamData);
      saveTeamToLocalStorage(teamData);
    } catch (error) {
      console.error('❌ Failed to fetch team data:', error);
      
      // If player not assigned to team, don't show the icon
      if (error.message && error.message.includes('not assigned to any team')) {
        console.log('ℹ️ Player not assigned to a team yet');
        setTeam(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const connectToTeamWebSocket = () => {
    teamWsService.connect(
      // onConnected
      () => {
        console.log('✅ Team WebSocket connected in Header');
        
        // Subscribe to team updates once we have team data
        const cachedTeam = getTeamFromLocalStorage();
        if (cachedTeam?.id) {
          subscribeToTeamUpdates(cachedTeam.id);
        }
      },
      // onError
      (error) => {
        console.error('❌ Team WebSocket connection error:', error);
      }
    );
  };

  const subscribeToTeamUpdates = (teamId) => {
    teamWsService.subscribeToTeamUpdates(teamId, (updatedTeam) => {
      console.log('🔄 Team updated via WebSocket:', updatedTeam);
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

  const handleTeamIconClick = () => {
    console.log('🖱️ Pirate icon clicked!');
    console.log('👥 Team data:', team);
    setShowDropdown(!showDropdown);
  };

  const handleEditTeamClick = () => {
    console.log('✏️ Edit team clicked from dropdown');
    setShowDropdown(false);
    setShowTeamModal(true);
  };

  const handleTeamUpdated = (updatedTeam) => {
    console.log('🔄 Team updated callback:', updatedTeam);
    setTeam(updatedTeam);
    saveTeamToLocalStorage(updatedTeam);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  console.log('🎨 Rendering Header - showTeamModal:', showTeamModal);
  console.log('📋 Dropdown state:', showDropdown);
  console.log('🎯 showTeamIcon:', showTeamIcon);
  console.log('👥 team exists:', !!team);
  console.log('🆔 team.id:', team?.id);
  console.log('✅ Should show dropdown?', showDropdown && showTeamIcon && team && team.id);

  return (
    <>
      <header className="bg-secondary flex justify-between items-center px-6 py-4 shadow-lg">
        <h1 className="text-background text-2xl font-cormorant font-bold">Treasure Hunt</h1>
        
        <div className="flex items-center gap-4">
          {/* Profile Picture with Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={handleTeamIconClick}
              className="focus:outline-none"
            >
              <img 
                src="/assets/GlobalAssets/PirateProfile.jpg" 
                alt="Pirate Profile" 
                className="w-12 h-12 rounded-full border-2 border-background object-cover cursor-pointer hover:border-primary transition-colors"
              />
            </button>

            {/* Dropdown Menu */}
            {console.log('🔍 Checking dropdown conditions:', { showDropdown, showTeamIcon, hasTeam: !!team, teamId: team?.id })}
            {showDropdown && showTeamIcon && team && team.id && (
              <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-xl border-2 border-secondary/20 overflow-hidden z-50">
                {console.log('✅ Rendering dropdown menu')}
                <div className="py-2">
                  {/* Team Name Display */}
                  <div className="px-4 py-2 border-b border-secondary/10">
                    <p className="text-xs text-secondary/60 font-cormorant">Team</p>
                    <p className="text-sm font-bold text-secondary font-cormorant truncate">
                      {team.name}
                    </p>
                  </div>
                  
                  {/* Edit Button */}
                  <button
                    onClick={handleEditTeamClick}
                    className="w-full px-4 py-3 text-left hover:bg-secondary/10 transition-colors flex items-center gap-3"
                  >
                    <Icon icon="mdi:pencil" className="w-5 h-5 text-secondary" />
                    <span className="text-secondary font-cormorant font-semibold">
                      Edit Team Name
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Team Modal */}
      {showTeamModal && team && (
        <TeamModal
          team={team}
          onClose={() => setShowTeamModal(false)}
          onTeamUpdated={handleTeamUpdated}
        />
      )}
    </>
  );
}