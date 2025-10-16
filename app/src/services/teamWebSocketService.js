import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// WebSocket configuration
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080';
const WS_ENDPOINT = '/ws';

/**
 * WebSocket Service for Team Updates
 */
class TeamWebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = {};
    this.connected = false;
  }

  /**
   * Connect to WebSocket server
   */
  connect(onConnected, onError) {
    if (this.client && this.connected) {
      console.log('👥 Team WebSocket already connected');
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

  /**
   * Subscribe to /topic/teams/{teamId} for team updates
   */
  subscribeToTeamUpdates(teamId, callback) {
    if (!this.client || !this.connected) {
      console.error('❌ WebSocket not connected - cannot subscribe to team updates');
      return null;
    }

    console.log(`📡 Subscribing to /topic/teams/${teamId} for updates...`);

    const subscription = this.client.subscribe(`/topic/teams/${teamId}`, (message) => {
      console.log('📨 Team update received');
      try {
        const data = JSON.parse(message.body);
        console.log('✅ Team data updated:', data);
        callback(data);
      } catch (error) {
        console.error('❌ Error parsing team update:', error);
      }
    });

    this.subscriptions[`team_${teamId}`] = subscription;
    console.log(`✅ Subscribed to /topic/teams/${teamId}`);
    return subscription;
  }

  /**
   * Unsubscribe from a specific team
   */
  unsubscribeFromTeam(teamId) {
    const key = `team_${teamId}`;
    if (this.subscriptions[key]) {
      this.subscriptions[key].unsubscribe();
      delete this.subscriptions[key];
      console.log(`✅ Unsubscribed from /topic/teams/${teamId}`);
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.client) {
      Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
      this.subscriptions = {};
      this.client.deactivate();
      this.connected = false;
      console.log('🔌 Team WebSocket disconnected');
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected() {
    return this.connected;
  }
}

// Export singleton instance
const teamWsService = new TeamWebSocketService();
export default teamWsService;
