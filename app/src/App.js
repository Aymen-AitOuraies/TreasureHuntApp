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
import { isPlayerLoggedIn } from './LoginPage/services/authService';
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

  useEffect(() => {
    setIsLoggedIn(isPlayerLoggedIn());

    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (gameState) {
      localStorage.setItem('gameState', gameState);
    }
  }, [gameState]);

  useEffect(() => {
    console.log('🎮 Connecting to Game State WebSocket...');
    
    gameStateWsService.connect(
      () => {
        console.log('✅ Game State WebSocket connected');
        setWsConnected(true);

        // Subscribe to initial game state
        gameStateWsService.subscribeToInitialGameState((state) => {
          console.log('📋 Initial game state:', state);
          const newState = state.state || state.gameState || state;
          setGameState(newState);
        });

        // Subscribe to game state updates
        gameStateWsService.subscribeToGameStateUpdates((state) => {
          console.log('🔄 Game state updated:', state);
          const newState = state.state || state.gameState || state;
          setGameState(newState);
        });
      },
      // onError
      (error) => {
        console.error('❌ Game State WebSocket error:', error);
        setWsConnected(false);
      }
    );

    return () => {
      gameStateWsService.disconnect();
    };
  }, []);

  const handleLoginSuccess = (playerData) => {
    console.log('Player logged in:', playerData);
    setIsLoggedIn(true);
  };

  const renderCurrentPage = () => {
    if (!gameState && !wsConnected) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
            <p className="text-secondary font-cormorant text-xl">Connecting to game server...</p>
          </div>
        </div>
      );
    }


    switch(gameState) {
      case GAME_STATES.NOT_STARTED:
        return <GameNotStarted />;
      
      case GAME_STATES.WAITING_FOR_PLAYERS:
        if (!isLoggedIn) {
          return <LoginPage onLoginSuccess={handleLoginSuccess} />;
        }
        return <WaitingPage />;
      
      case GAME_STATES.ARRANGING_TEAMS:
        return <ArrangingTeamsPage />;
      
      case GAME_STATES.IN_PROGRESS:
        if (!isLoggedIn) {
          return <LoginPage onLoginSuccess={handleLoginSuccess} />;
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
        return <LeaderboardMain onNavigate={setCurrentPage} />;
      
      default:
        return <GameNotStarted />;
    }
  };

  return (
    <div className="block lg:hidden">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
