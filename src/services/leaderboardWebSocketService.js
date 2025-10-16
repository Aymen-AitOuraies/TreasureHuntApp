import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = process.env.REACT_APP_WS_URL;
const WS_ENDPOINT = 'ws';


class LeaderboardWebSocketService {
  constructor() {
    this.client = null;
    this.initialSubscription = null;
    this.updatesSubscription = null;
    this.callbacks = []; 
    this.connected = false;
    this.pendingCallbacks = [];
  }

  connect(onConnected, onError) {
    if (this.client && this.connected) {
      console.log('🏆 Leaderboard WebSocket already connected');
      if (onConnected) onConnected();
      return;
    }

    console.log('🔌 Connecting to Leaderboard WebSocket:', `${WS_BASE_URL}${WS_ENDPOINT}`);

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}${WS_ENDPOINT}`),
      reconnectDelay: 5000,
      
      onConnect: (frame) => {
        console.log('✅ Leaderboard WebSocket Connected');
        this.connected = true;
        
        if (this.pendingCallbacks.length > 0) {
          console.log(`📋 Processing ${this.pendingCallbacks.length} pending leaderboard callback(s)...`);
          setTimeout(() => {
            this.pendingCallbacks.forEach(callback => {
              this.subscribeToLeaderboard(callback);
            });
            this.pendingCallbacks = [];
          }, 100);
        }
        
        if (onConnected) {
          setTimeout(() => onConnected(frame), 50);
        }
      },
      
      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame);
        this.connected = false;
        if (onError) onError(frame);
      },
      
      onWebSocketClose: () => {
        console.log('🔌 Leaderboard WebSocket connection closed');
        this.connected = false;
      },
      
      onWebSocketError: (error) => {
        console.error('❌ Leaderboard WebSocket Error:', error);
        this.connected = false;
        if (onError) onError(error);
      }
    });

    this.client.activate();
  }

 
  subscribeToLeaderboard(callback) {
    if (!this.client || !this.connected || !this.client.connected) {
      console.warn('⚠️ Leaderboard WebSocket not connected yet - will subscribe when connected');
      if (!this.pendingCallbacks.includes(callback)) {
        this.pendingCallbacks.push(callback);
      }
      return null;
    }

    if (!this.callbacks.includes(callback)) {
      this.callbacks.push(callback);
      console.log(`📡 Added leaderboard callback. Total callbacks: ${this.callbacks.length}`);
    } else {
      console.log('⚠️ Callback already registered, skipping duplicate');
    }

    if (!this.initialSubscription) {
      console.log('📡 Subscribing to /app/leaderboard for initial data...');
      
      this.initialSubscription = this.client.subscribe('/app/leaderboard', (message) => {
        console.log('📨 Initial leaderboard data received');
        try {
          const response = JSON.parse(message.body);
          console.log('✅ Leaderboard initial data:', response);
          
          const leaderboardData = response.data || response;
          
          this.callbacks.forEach(cb => cb(leaderboardData));
        } catch (error) {
          console.error('❌ Error parsing initial leaderboard data:', error);
        }
      });
      
      console.log('✅ Subscribed to /app/leaderboard');
    }

    if (!this.updatesSubscription) {
      console.log('📡 Subscribing to /topic/leaderboard for updates...');
      
      this.updatesSubscription = this.client.subscribe('/topic/leaderboard', (message) => {
        console.log('📨 Leaderboard update received');
        try {
          const response = JSON.parse(message.body);
          console.log('✅ Leaderboard updated:', response);
          
          const leaderboardData = response.data || response;
          
          this.callbacks.forEach(cb => cb(leaderboardData));
        } catch (error) {
          console.error('❌ Error parsing leaderboard update:', error);
        }
      });
      
      console.log('✅ Subscribed to /topic/leaderboard');
    } else {
      console.log('ℹ️ Already subscribed to leaderboard updates, added new callback');
    }

    return true;
  }


  removeCallback(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
      console.log(`🗑️ Removed leaderboard callback. Remaining callbacks: ${this.callbacks.length}`);
    }
  }


  unsubscribe() {
    if (this.initialSubscription) {
      this.initialSubscription.unsubscribe();
      this.initialSubscription = null;
      console.log('✅ Unsubscribed from /app/leaderboard');
    }
    
    if (this.updatesSubscription) {
      this.updatesSubscription.unsubscribe();
      this.updatesSubscription = null;
      console.log('✅ Unsubscribed from /topic/leaderboard');
    }
    
    this.callbacks = [];
  }

 
  disconnect() {
    if (this.client) {
      this.unsubscribe();
      this.pendingCallbacks = [];
      this.client.deactivate();
      this.connected = false;
      console.log('🔌 Leaderboard WebSocket disconnected');
    }
  }

  isConnected() {
    return this.connected;
  }
}

const leaderboardWsService = new LeaderboardWebSocketService();
export default leaderboardWsService;
