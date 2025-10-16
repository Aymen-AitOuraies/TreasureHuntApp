import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = process.env.REACT_APP_WS_URL;
const WS_ENDPOINT = 'ws';


class GameStateWebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = {};
    this.connected = false;
  }


  connect(onConnected, onError) {
    if (this.client && this.connected) {
      console.log('🎮 Game WebSocket already connected');
      if (onConnected) onConnected();
      return;
    }

    console.log('🔌 Connecting to Game WebSocket:', `${WS_BASE_URL}${WS_ENDPOINT}`);

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}${WS_ENDPOINT}`),
      reconnectDelay: 5000,
      
      onConnect: (frame) => {
        console.log('✅ Game WebSocket Connected');
        this.connected = true;
        if (onConnected) onConnected(frame);
      },
      
      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame);
        this.connected = false;
        if (onError) onError(frame);
      },
      
      onWebSocketClose: () => {
        console.log('🔌 Game WebSocket connection closed');
        this.connected = false;
      },
      
      onWebSocketError: (error) => {
        console.error('❌ Game WebSocket Error:', error);
        this.connected = false;
        if (onError) onError(error);
      }
    });

    this.client.activate();
  }


  subscribeToInitialGameState(callback) {
    if (!this.client || !this.connected || !this.client.connected) {
      console.error('❌ WebSocket not connected - cannot subscribe to initial game state');
      return null;
    }

    console.log('📡 Subscribing to /app/game/state for initial state...');

    const subscription = this.client.subscribe('/app/game/state', (message) => {
      console.log('📨 Initial game state received');
      try {
        const data = JSON.parse(message.body);
        console.log('✅ Initial game state:', data);
        callback(data);
      } catch (error) {
        console.error('❌ Error parsing initial game state:', error);
      }
    });

    this.subscriptions['game_state'] = subscription;
    console.log('✅ Subscribed to /app/game/state');
    return subscription;
  }


  subscribeToGameStateUpdates(callback) {
    if (!this.client || !this.connected || !this.client.connected) {
      console.error('❌ WebSocket not connected - cannot subscribe to game state updates');
      return null;
    }

    console.log('📡 Subscribing to /topic/game/state for updates...');

    const subscription = this.client.subscribe('/topic/game/state', (message) => {
      console.log('📨 Game state update received');
      try {
        const data = JSON.parse(message.body);
        console.log('🎮 New game state:', data);
        callback(data);
      } catch (error) {
        console.error('❌ Error parsing game state update:', error);
      }
    });

    this.subscriptions['topic_game_state'] = subscription;
    console.log('✅ Subscribed to /topic/game/state');
    return subscription;
  }


  disconnect() {
    if (this.client) {
      Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
      this.subscriptions = {};
      this.client.deactivate();
      this.connected = false;
      console.log('🔌 Game WebSocket disconnected');
    }
  }


  isConnected() {
    return this.connected;
  }
}

const gameStateWsService = new GameStateWebSocketService();
export default gameStateWsService;
