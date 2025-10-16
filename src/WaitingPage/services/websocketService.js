import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// WebSocket configuration
const WS_BASE_URL = process.env.REACT_APP_WS_URL;
const WS_ENDPOINT = '/ws';

/**
 * WebSocket Service for Waiting Page
 */
class WebSocketService {
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
      console.log('WebSocket already connected');
      return;
    }

    console.log('🔌 Attempting to connect to WebSocket:', `${WS_BASE_URL}${WS_ENDPOINT}`);

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}${WS_ENDPOINT}`),
      reconnectDelay: 5000,
      
      onConnect: (frame) => {
        console.log('✅ WebSocket Connected Successfully');
        console.log('Connection Frame:', frame);
        this.connected = true;
        if (onConnected) onConnected(frame);
      },
      
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
        this.connected = false;
        if (onError) onError(frame);
      },
      
      onWebSocketClose: () => {
        console.log('WebSocket connection closed');
        this.connected = false;
      },
      
      onWebSocketError: (error) => {
        console.error('WebSocket Error:', error);
        this.connected = false;
        if (onError) onError(error);
      }
    });

    this.client.activate();
  }

  /**
   * Subscribe to /app/players for initial player list
   */
  subscribeToInitialPlayers(callback) {
    if (!this.client || !this.connected || !this.client.connected) {
      console.error('❌ WebSocket not connected - cannot subscribe');
      return null;
    }

    console.log('📡 Subscribing to /app/players for initial list...');

    const subscription = this.client.subscribe('/app/players', (message) => {
      console.log('📨 Initial players list received on /app/players');
      console.log('Raw message:', message);
      try {
        const data = JSON.parse(message.body);
        console.log('✅ Initial players data:', data);
        callback(data);
      } catch (error) {
        console.error('❌ Error parsing initial players:', error);
        console.error('Message body:', message.body);
      }
    });

    this.subscriptions['app_players'] = subscription;
    console.log('✅ Successfully subscribed to /app/players');
    return subscription;
  }

  /**
   * Subscribe to /topic/players for new player updates
   */
  subscribeToNewPlayers(callback) {
    if (!this.client || !this.connected || !this.client.connected) {
      console.error('❌ WebSocket not connected - cannot subscribe');
      return null;
    }

    console.log('📡 Subscribing to /topic/players for new players...');

    const subscription = this.client.subscribe('/topic/players', (message) => {
      console.log('📨 New player received on /topic/players');
      console.log('Raw message:', message);
      try {
        const data = JSON.parse(message.body);
        console.log('✅ New player data:', data);
        console.log('⏰ Message timestamp:', new Date().toISOString());
        callback(data);
      } catch (error) {
        console.error('❌ Error parsing new player:', error);
        console.error('Message body:', message.body);
      }
    });

    this.subscriptions['topic_players'] = subscription;
    console.log('✅ Successfully subscribed to /topic/players');
    return subscription;
  }

  /**
   * Subscribe to /topic/players (legacy method - kept for compatibility)
   */
  subscribeToPlayers(callback) {
    return this.subscribeToNewPlayers(callback);
  }


  sendToPlayers(message) {
    if (!this.client || !this.connected || !this.client.connected) {
      console.error('❌ WebSocket not connected - cannot send message');
      return false;
    }

    console.log('📤 Sending message to /app/players/create:', message);
    this.client.publish({
      destination: '/app/players/create',
      body: JSON.stringify(message)
    });
    console.log('✅ Message sent successfully');
    return true;
  }


  requestAllPlayers() {
    if (!this.client || !this.connected || !this.client.connected) {
      console.error('❌ WebSocket not connected - cannot request players');
      return false;
    }

    console.log('📤 Requesting all players from /app/players');
    this.client.publish({
      destination: '/app/players',
      body: JSON.stringify({ action: 'getAll' })
    });
    console.log('✅ Request sent successfully');
    return true;
  }

  disconnect() {
    if (this.client) {
      Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
      this.subscriptions = {};
      this.client.deactivate();
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected;
  }
}

const wsService = new WebSocketService();
export default wsService;
