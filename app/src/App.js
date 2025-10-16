import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './LoginPage/LoginMain';
import PuzzlesMain from './PuzzlesPage/PuzzlesMain';
import LeaderboardMain from './LeaderboardPage/LeaderboardMain';
import StoreMain from './StorePage/StoreMain';
import WaitingPage from './WaitingPage/WaitingPage';
import GameNotStarted from './GameNotStarted/GameNotStarted';
import ArrangingTeamsPage from './ArrangingTeamsPage/ArrangingTeamsPage';
import GameInProgressPage from './GameInProgressPage/GameInProgressPage';
import FinishedGamePage from './FinishedGamePage/FinishedGamePage';
import { isPlayerLoggedIn } from './LoginPage/services/authService';
import { getCurrentGameState } from './services/gameService';
import gameStateWsService from './services/gameStateWebSocketService';

// Game States
const GAME_STATES = {
  NOT_STARTED: 'NOT_STARTED',
  WAITING_FOR_PLAYERS: 'WAITING_FOR_PLAYERS',
  ARRANGING_TEAMS: 'ARRANGING_TEAMS',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED'
};

function App() {
  const [currentPage, setCurrentPage] = useState('puzzle');
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gameState, setGameState] = useState(() => {
    const savedState = localStorage.getItem('gameState');
    return savedState || null;
  });
  const [wsConnected, setWsConnected] = useState(false);
  const [hasReceivedInitialState, setHasReceivedInitialState] = useState(() => {
    const savedState = localStorage.getItem('gameState');
    return !!savedState; 
  });

  useEffect(() => {
    setIsLoggedIn(isPlayerLoggedIn());

    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    console.log('🎮 Game state changed to:', gameState);
    
    const loginStatus = isPlayerLoggedIn();
    console.log('🔐 Login status:', loginStatus);
    setIsLoggedIn(loginStatus);
    
    if (gameState) {
      localStorage.setItem('gameState', gameState);
    }
    
    if (gameState === GAME_STATES.NOT_STARTED) {
      console.log('🗑️ Game reset to NOT_STARTED - clearing player data');
      localStorage.removeItem('player');
      localStorage.removeItem('playerId');
      localStorage.removeItem('team');
      localStorage.removeItem('teamId');
      setIsLoggedIn(false);
    }
  }, [gameState]);

  useEffect(() => {
    console.log('🎮 Connecting to Game State WebSocket...');
    
    const fetchGameStateViaAPI = async () => {
      try {
        const state = await getCurrentGameState();
        const newState = state.state || state.gameState || state;
        console.log('✅ Game state fetched via API:', newState);
        setGameState(newState);
        setHasReceivedInitialState(true);
      } catch (error) {
        console.error('❌ Failed to fetch game state via API:', error);
        if (!gameState) {
          setGameState(GAME_STATES.NOT_STARTED);
        }
        setHasReceivedInitialState(true);
      }
    };
    
    const loadingTimeout = setTimeout(() => {
      if (!hasReceivedInitialState) {
        console.warn('⚠️ Timeout waiting for WebSocket initial game state, trying REST API...');
        fetchGameStateViaAPI();
      }
    }, 3000);
    
    gameStateWsService.connect(
      () => {
        console.log('✅ Game State WebSocket connected');
        setWsConnected(true);

        gameStateWsService.subscribeToInitialGameState((state) => {
          console.log('📋 Initial game state:', state);
          const newState = state.state || state.gameState || state;
          setGameState(newState);
          setHasReceivedInitialState(true);
          clearTimeout(loadingTimeout); 
        });

        gameStateWsService.subscribeToGameStateUpdates((state) => {
          console.log('🔄 Game state updated:', state);
          const newState = state.state || state.gameState || state;
          setGameState(newState);
        });
      },
      (error) => {
        console.error('❌ Game State WebSocket error:', error);
        setWsConnected(false);
        clearTimeout(loadingTimeout);
        fetchGameStateViaAPI();
      }
    );

    return () => {
      clearTimeout(loadingTimeout);
      gameStateWsService.disconnect();
    };
  }, []);

  const handleLoginSuccess = (playerData) => {
    console.log('Player logged in:', playerData);
    setIsLoggedIn(true);
  };

  const renderCurrentPage = () => {
    if (!hasReceivedInitialState) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
            <p className="text-secondary font-cormorant text-xl">Connecting to game server...</p>
          </div>
        </div>
      );
    }

    console.log('🎬 Rendering page for game state:', gameState, 'isLoggedIn:', isLoggedIn);

    switch(gameState) {
      case GAME_STATES.NOT_STARTED:
        return <GameNotStarted />;
      
      case GAME_STATES.WAITING_FOR_PLAYERS:
        if (!isLoggedIn) {
          return <LoginPage onLoginSuccess={handleLoginSuccess} />;
        }
        return <WaitingPage />;
      
      case GAME_STATES.ARRANGING_TEAMS:
        if (!isLoggedIn) {
          return <GameInProgressPage />;
        }
        return <ArrangingTeamsPage />;
      
      case GAME_STATES.IN_PROGRESS:
        if (!isLoggedIn) {
          return <GameInProgressPage />;
        }
        
        switch(currentPage) {
          case 'puzzle':
            return <PuzzlesMain onNavigate={setCurrentPage} />;
          case 'leaderboard':
            return <LeaderboardMain onNavigate={setCurrentPage} />;
          case 'store':
            return <StoreMain onNavigate={setCurrentPage} />;
          default:
            return <PuzzlesMain onNavigate={setCurrentPage} />;
        }
      
      case GAME_STATES.FINISHED:
        return <FinishedGamePage onNavigate={setCurrentPage} />;
      
      default:
        return <GameNotStarted />;
    }
  };

  return (
    <div className="block lg:hidden" key={`app-${gameState}-${isLoggedIn}`}>
      {renderCurrentPage()}
    </div>
  );
}

export default App;
