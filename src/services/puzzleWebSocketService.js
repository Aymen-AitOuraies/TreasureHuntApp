import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = process.env.REACT_APP_WS_URL;
const WS_ENDPOINT = '/ws';


class PuzzleWebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = {};
    this.connected = false;
    this.pendingSubscriptions = [];
  }


  connect(onConnected, onError) {
    if (this.client && this.connected) {
      console.log('🧩 Puzzle WebSocket already connected');
      if (onConnected) onConnected();
      return;
    }

    console.log('🔌 Connecting to Puzzle WebSocket:', `${WS_BASE_URL}${WS_ENDPOINT}`);

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}${WS_ENDPOINT}`),
      reconnectDelay: 5000,
      
      onConnect: (frame) => {
        console.log('✅ Puzzle WebSocket Connected');
        this.connected = true;
        
        if (this.pendingSubscriptions.length > 0) {
          console.log(`📋 Processing ${this.pendingSubscriptions.length} pending puzzle subscription(s)...`);
          this.pendingSubscriptions.forEach(({ teamId, callback }) => {
            this.subscribeToPuzzleUpdates(teamId, callback);
          });
          this.pendingSubscriptions = [];
        }
        
        if (onConnected) onConnected(frame);
      },
      
      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame);
        this.connected = false;
        if (onError) onError(frame);
      },
      
      onWebSocketClose: () => {
        console.log('🔌 Puzzle WebSocket connection closed');
        this.connected = false;
      },
      
      onWebSocketError: (error) => {
        console.error('❌ Puzzle WebSocket Error:', error);
        this.connected = false;
        if (onError) onError(error);
      }
    });

    this.client.activate();
  }


  subscribeToPuzzleUpdates(teamId, callback) {
    if (!this.client || !this.connected || !this.client.connected) {
      console.warn('⚠️ Puzzle WebSocket not connected yet - will subscribe when connected');
      this.pendingSubscriptions.push({ teamId, callback });
      return null;
    }

    console.log(`📡 Subscribing to /topic/team/${teamId}/puzzles for updates...`);

    const subscription = this.client.subscribe(`/topic/team/${teamId}/puzzles`, (message) => {
      console.log('📨 Puzzle update received');
      try {
        const data = JSON.parse(message.body);
        console.log('✅ Puzzles data updated:', data);
        callback(data);
      } catch (error) {
        console.error('❌ Error parsing puzzle update:', error);
      }
    });

    this.subscriptions[`puzzles_${teamId}`] = subscription;
    console.log(`✅ Subscribed to /topic/team/${teamId}/puzzles`);
    return subscription;
  }

 
  unsubscribeFromPuzzles(teamId) {
    const key = `puzzles_${teamId}`;
    if (this.subscriptions[key]) {
      this.subscriptions[key].unsubscribe();
      delete this.subscriptions[key];
      console.log(`✅ Unsubscribed from /topic/team/${teamId}/puzzles`);
    }
  }


  disconnect() {
    if (this.client) {
      Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
      this.subscriptions = {};
      this.pendingSubscriptions = [];
      this.client.deactivate();
      this.connected = false;
      console.log('🔌 Puzzle WebSocket disconnected');
    }
  }

  isConnected() {
    return this.connected;
  }
}

const puzzleWsService = new PuzzleWebSocketService();
export default puzzleWsService;
