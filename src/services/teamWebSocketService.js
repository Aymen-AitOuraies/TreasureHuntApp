import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = process.env.REACT_APP_WS_URL;
const WS_ENDPOINT = 'ws';


class TeamWebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = {};
    this.callbacks = {}; 
    this.connected = false;
    this.pendingSubscriptions = [];
  }


  connect(onConnected, onError) {
    if (this.client && this.connected) {
      console.log('👥 Team WebSocket already connected');
      if (onConnected) {
        setTimeout(() => onConnected(), 0);
      }
      return;
    }

    console.log('🔌 Connecting to Team WebSocket:', `${WS_BASE_URL}${WS_ENDPOINT}`);

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}${WS_ENDPOINT}`),
      reconnectDelay: 5000,
      
      onConnect: (frame) => {
        console.log('✅ Team WebSocket Connected');
        this.connected = true;
        
        if (onConnected) onConnected(frame);
        
        if (this.pendingSubscriptions.length > 0) {
          console.log(`📋 Processing ${this.pendingSubscriptions.length} pending subscription(s)...`);
          setTimeout(() => {
            this.pendingSubscriptions.forEach(({ teamId, callback }) => {
              this.subscribeToTeamUpdates(teamId, callback);
            });
            this.pendingSubscriptions = [];
          }, 100);
        }
      },
      
      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame);
        this.connected = false;
        if (onError) onError(frame);
      },
      
      onWebSocketClose: () => {
        console.log('🔌 Team WebSocket connection closed');
        this.connected = false;
      },
      
      onWebSocketError: (error) => {
        console.error('❌ Team WebSocket Error:', error);
        this.connected = false;
        if (onError) onError(error);
      }
    });

    this.client.activate();
  }


  subscribeToTeamUpdates(teamId, callback) {
    if (!this.client || !this.connected || !this.client.connected) {
      console.warn('⚠️ WebSocket not connected yet - will subscribe when connected');
      if (!this.pendingSubscriptions) {
        this.pendingSubscriptions = [];
      }
      this.pendingSubscriptions.push({ teamId, callback });
      return null;
    }

    if (!this.callbacks[teamId]) {
      this.callbacks[teamId] = [];
    }

    this.callbacks[teamId].push(callback);
    console.log(`📡 Added callback for team ${teamId}. Total callbacks: ${this.callbacks[teamId].length}`);

    const key = `team_${teamId}`;
    if (!this.subscriptions[key]) {
      console.log(`📡 Subscribing to /topic/teams/${teamId} for updates...`);

      const subscription = this.client.subscribe(`/topic/teams/${teamId}`, (message) => {
        console.log('📨 Team update received for team:', teamId);
        try {
          const data = JSON.parse(message.body);
          console.log('✅ Team data updated:', data);
          
          if (this.callbacks[teamId]) {
            this.callbacks[teamId].forEach(cb => cb(data));
          }
        } catch (error) {
          console.error('❌ Error parsing team update:', error);
        }
      });

      this.subscriptions[key] = subscription;
      console.log(`✅ Subscribed to /topic/teams/${teamId}`);
    } else {
      console.log(`ℹ️ Already subscribed to /topic/teams/${teamId}, added new callback`);
    }

    return key;
  }


  unsubscribeFromTeam(teamId) {
    const key = `team_${teamId}`;
    if (this.subscriptions[key]) {
      this.subscriptions[key].unsubscribe();
      delete this.subscriptions[key];
      delete this.callbacks[teamId]; 
      console.log(`✅ Unsubscribed from /topic/teams/${teamId}`);
    }
  }


  disconnect() {
    if (this.client) {
      Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
      this.subscriptions = {};
      this.callbacks = {}; 
      this.pendingSubscriptions = [];
      this.client.deactivate();
      this.connected = false;
      console.log('🔌 Team WebSocket disconnected');
    }
  }


  isConnected() {
    return this.connected;
  }
}

const teamWsService = new TeamWebSocketService();
export default teamWsService;
