import React, { useState, useEffect } from 'react';
import CongratulationsAnimation from '../components/CongratulationsAnimation';
import LeaderboardMain from '../LeaderboardPage/LeaderboardMain';
import { getTeamFromLocalStorage } from '../services/teamService';
import { getLeaderboardFromLocalStorage } from '../services/leaderboardService';
import leaderboardWsService from '../services/leaderboardWebSocketService';

export default function FinishedGamePage({ onNavigate }) {
  // Check localStorage to see if animation was already shown
  const [showCongratulations, setShowCongratulations] = useState(() => {
    const animationShown = sessionStorage.getItem('congratulationsShown');
    return animationShown !== 'true';
  });
  const [winningTeamName, setWinningTeamName] = useState('');
  const [isWinner, setIsWinner] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    console.log('🏁 Game FINISHED - Loading winner information');
    
    // --------- Get current player's team --------- //
    const currentTeam = getTeamFromLocalStorage();
    console.log('👥 Current player team:', currentTeam);
    
    // --------- First try to get leaderboard from cache --------- //
    const cachedLeaderboard = getLeaderboardFromLocalStorage();
    if (cachedLeaderboard && cachedLeaderboard.length > 0) {
      updateWinnerInfo(cachedLeaderboard, currentTeam);
    }
    
    // --------- Connect to leaderboard WebSocket to get latest data --------- //
    leaderboardWsService.connect(
      () => {
        console.log('✅ Connected to leaderboard for final results');
        
        // --------- Subscribe to get the latest leaderboard --------- //
        leaderboardWsService.subscribeToLeaderboard((leaderboardData) => {
          console.log('🏆 Final leaderboard received:', leaderboardData);
          setLeaderboard(leaderboardData);
          updateWinnerInfo(leaderboardData, currentTeam);
        });
      },
      (error) => {
        console.error('❌ Error connecting to leaderboard:', error);
      }
    );
    
    return () => {
      // --------- Cleanup is handled by the service --------- //
    };
  }, []);

  const updateWinnerInfo = (leaderboardData, currentTeam) => {
    if (!leaderboardData || leaderboardData.length === 0) {
      console.warn('⚠️ No leaderboard data available');
      return;
    }
    
    // --------- Sort by rank to ensure we get the winner (rank 1) --------- //
    const sortedLeaderboard = [...leaderboardData].sort((a, b) => a.rank - b.rank);
    const winner = sortedLeaderboard[0];
    
    if (winner) {
      console.log('🥇 Winner:', winner.name, '(Rank:', winner.rank, ')');
      setWinningTeamName(winner.name);
      
      // --------- Check if current player's team is the winner --------- //
      if (currentTeam && currentTeam.id === winner.id) {
        setIsWinner(true);
        console.log('🎉 YOU ARE THE WINNER! Your team:', currentTeam.name);
      } else {
        setIsWinner(false);
        console.log('🏆 Winner is:', winner.name, '| Your team:', currentTeam?.name || 'Unknown');
      }
    }
  };

  const handleCongratulationsComplete = () => {
    console.log('✅ Congratulations animation complete, showing final leaderboard');
    setShowCongratulations(false);
    // Mark animation as shown in sessionStorage (persists during browser session)
    sessionStorage.setItem('congratulationsShown', 'true');
  };

  // --------- Show congratulations animation if we have the winner info --------- //
  if (showCongratulations && winningTeamName) {
    return (
      <CongratulationsAnimation
        winningTeamName={winningTeamName}
        isWinner={isWinner}
        onComplete={handleCongratulationsComplete}
      />
    );
  }

  // --------- If no winner info yet, show loading --------- //
  if (!winningTeamName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-secondary font-cormorant text-xl">Loading final results...</p>
        </div>
      </div>
    );
  }

  // --------- After congratulations, show the final leaderboard --------- //
  return <LeaderboardMain onNavigate={onNavigate} />;
}
