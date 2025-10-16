import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import PlayerCard from "./components/PlayerCard";
import wsService from "./services/websocketService";
import { getPlayerFromLocalStorage } from "../LoginPage/services/authService";

export default function WaitingPage() {
  const [dots, setDots] = useState('');
  const [players, setPlayers] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    wsService.connect(
      () => {
        console.log('✅ WebSocket connected successfully');
        setWsConnected(true);
        setError(null);

        wsService.subscribeToInitialPlayers((data) => {
          console.log('📋 Initial players list received:', data);
          if (Array.isArray(data)) {
            console.log('✅ Setting initial players:', data.length, 'players');
            setPlayers(data);
          } else if (data && typeof data === 'object') {
            console.log('✅ Setting single initial player');
            setPlayers([data]);
          }
        });

        wsService.subscribeToNewPlayers((newPlayer) => {
          console.log('🎯 New player joined:', newPlayer);
          
          if (newPlayer && newPlayer.id && newPlayer.username) {
            console.log('➕ Adding new player to list');
            setPlayers(prevPlayers => {
              const exists = prevPlayers.some(p => p.id === newPlayer.id);
              if (exists) {
                console.log('⚠️ Player already exists, not adding');
                return prevPlayers;
              }
              const updated = [...prevPlayers, newPlayer];
              console.log('✅ Updated players list:', updated);
              return updated;
            });
          } else {
            console.warn('⚠️ Received unexpected data format:', newPlayer);
          }
        });
      },
      (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
        setError('Failed to connect to server. Retrying...');
      }
    );

    return () => {
      console.log('Cleaning up WebSocket connection');
      wsService.disconnect();
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative font-cormorant"
      style={{
        backgroundImage: "url('/assets/GlobalAssets/PaperBackground.jpg')",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: "url('/assets/GlobalAssets/BackgroundLayer.png')",
            opacity: 0.11,
        }}
      ></div>
        <div className="relative z-10">
        <div className="fixed top-0 left-0 right-0 z-20">
            <Header />
        </div>
          <div className="pt-24 display flex flex-col items-center h-screen px-4">
            <h1 className="text-[28px] font-bold text-secondary mb-8">
              The game will start soon{dots}
            </h1>
            
            <div className="mb-4 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-secondary font-cormorant">
                {wsConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-cormorant text-base">{error}</p>
              </div>
            )}

            <p className="text-lg text-secondary font-cormorant mb-6">
              {players.length} {players.length === 1 ? 'player' : 'players'} waiting
            </p>
            
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  playerName={player.username}
                />
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
