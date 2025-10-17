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
        if (!isLoggedIn) {
          return <GameInProgressPage />;
        }
        return <FinishedGamePage onNavigate={setCurrentPage} />;
      
      default:
        return <GameNotStarted />;
    }
  };

  return (
    <>
      {/* --------- Desktop Warning Message (Hidden when showing GameInProgressPage for non-logged users) --------- */}
      {!(!isLoggedIn && (gameState === GAME_STATES.ARRANGING_TEAMS || gameState === GAME_STATES.IN_PROGRESS || gameState === GAME_STATES.FINISHED)) && (
        <div className="hidden lg:flex min-h-screen items-center justify-center bg-background px-6"
          style={{
            backgroundImage: "url('/assets/GlobalAssets/PaperBackground.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="text-center max-w-2xl">
            {/* --------- Pirate Icon --------- */}
            <div className="mb-8">
              <img
                src="/assets/GlobalAssets/PirateProfile.jpg"
                alt="Pirate"
                className="w-32 h-32 rounded-full mx-auto border-4 border-secondary shadow-lg"
              />
            </div>
            
            {/* --------- Title --------- */}
            <h1 className="text-5xl font-bold text-secondary font-cormorant mb-6">
              🏴‍☠️ Parley! 🏴‍☠️
            </h1>
            
            {/* --------- Message --------- */}
            <div className="bg-white/80 rounded-lg p-8 shadow-xl">
              <p className="text-2xl text-gray-800 font-cormorant mb-4">
                This treasure hunt be optimized for mobile devices!
              </p>
              <p className="text-xl text-gray-600 font-cormorant mb-6">
                Please open this adventure on yer smartphone or tablet to continue.
              </p>
              
              {/* --------- Mobile Icon --------- */}
              <div className="flex justify-center gap-8 mt-8">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 font-cormorant">Use Mobile</p>
                </div>
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 font-cormorant">Or Tablet</p>
                </div>
              </div>
            </div>
            
            {/* --------- Footer Message --------- */}
            <p className="text-gray-500 font-cormorant mt-6 text-lg">
              🏴‍☠️ The best pirate experience awaits on mobile! 🏴‍☠️
            </p>
          </div>
        </div>
      )}
      
      {/* --------- Desktop GameInProgressPage for non-logged users --------- */}
      {!isLoggedIn && (gameState === GAME_STATES.ARRANGING_TEAMS || gameState === GAME_STATES.IN_PROGRESS || gameState === GAME_STATES.FINISHED) && (
        <div className="hidden lg:block">
          <GameInProgressPage />
        </div>
      )}
      
      {/* --------- Mobile Game Content --------- */}
      <div className="block lg:hidden" key={`app-${gameState}-${isLoggedIn}`}>
        {renderCurrentPage()}
      </div>
    </>
  );
}

export default App;
