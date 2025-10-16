# WebSocket Integration - Waiting Page

## Overview
Real-time player tracking in the waiting room using WebSocket (STOMP over SockJS).

## Required Packages

Install the following packages:

```bash
npm install @stomp/stompjs sockjs-client
```

Or with yarn:

```bash
yarn add @stomp/stompjs sockjs-client
```

## Configuration

### Environment Variable
Create or update `.env` file:

```env
REACT_APP_WS_URL=http://localhost:8080
```

Default: `http://localhost:8080` if not set

### WebSocket Endpoint
The service connects to: `{REACT_APP_WS_URL}/ws`

## File Structure

```
src/WaitingPage/
├── WaitingPage.js              # Main component with WebSocket integration
├── components/
│   └── PlayerCard.js          # Individual player card
└── services/
    └── websocketService.js    # WebSocket service (singleton)
```

## WebSocket Topics

### Subscribe: `/topic/players`
Receives real-time updates about players joining/leaving.

**Expected Message Format:**
```json
[
  {
    "id": 1,
    "fullName": "John Doe",
    "username": "johndoe",
    "teamId": 5,
    "teamName": "Pirates"
  },
  ...
]
```

Or:
```json
{
  "players": [
    { "id": 1, "fullName": "John Doe", ... }
  ]
}
```

### Publish: `/app/players`
Sends player information when joining the waiting room.

**Message Format:**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "username": "johndoe",
  "teamId": 5,
  "teamName": "Pirates",
  "action": "join"
}
```

## WebSocket Service API

### Methods

#### `connect(onConnected, onError)`
Establishes WebSocket connection.

```javascript
wsService.connect(
  () => console.log('Connected!'),
  (error) => console.error('Error:', error)
);
```

#### `subscribeToPlayers(callback)`
Subscribes to `/topic/players`.

```javascript
wsService.subscribeToPlayers((data) => {
  console.log('Players updated:', data);
  setPlayers(data);
});
```

#### `sendToPlayers(message)`
Sends message to `/app/players`.

```javascript
wsService.sendToPlayers({
  id: 1,
  fullName: "John Doe",
  action: "join"
});
```

#### `disconnect()`
Closes WebSocket connection and unsubscribes from all topics.

```javascript
wsService.disconnect();
```

#### `isConnected()`
Checks connection status.

```javascript
if (wsService.isConnected()) {
  // Connected
}
```

## WaitingPage Component

### Features

**Real-time Updates:**
- ✅ Auto-connects to WebSocket on mount
- ✅ Subscribes to player updates
- ✅ Sends current player info on join
- ✅ Updates player list in real-time
- ✅ Auto-reconnects on connection loss

**UI Indicators:**
- 🟢 Green dot = Connected
- 🔴 Red dot = Disconnected/Connecting
- Player count display
- Error messages
- Loading animation (dots)

### State Management

```javascript
const [players, setPlayers] = useState([]);      // List of players
const [wsConnected, setWsConnected] = useState(false);  // Connection status
const [error, setError] = useState(null);        // Error messages
```

### Flow

1. **Component Mounts**
   - Connect to WebSocket server
   - Subscribe to `/topic/players`
   - Send player info to `/app/players`

2. **Receive Updates**
   - Server broadcasts to `/topic/players`
   - Component updates player list
   - UI re-renders with new players

3. **Component Unmounts**
   - Unsubscribe from topics
   - Disconnect WebSocket
   - Clean up resources

## Reconnection Logic

The service automatically attempts to reconnect:
- **Max attempts:** 5
- **Retry delay:** 5 seconds
- **Exponential backoff:** No (fixed delay)
- **Reset on success:** Yes

## Error Handling

### Connection Errors
```javascript
onError: (error) => {
  setError('Failed to connect to server. Retrying...');
}
```

### Message Parsing Errors
```javascript
try {
  const data = JSON.parse(message.body);
  callback(data);
} catch (error) {
  console.error('Error parsing message:', error);
}
```

### Network Errors
Handled by STOMP client with automatic reconnection.

## Backend Requirements

Your Spring Boot backend should:

1. **Enable WebSocket:**
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*")
                .withSockJS();
    }
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
```

2. **Handle Player Messages:**
```java
@MessageMapping("/players")
@SendTo("/topic/players")
public List<Player> handlePlayer(PlayerMessage message) {
    // Process player join/leave
    // Return updated player list
    return playerService.getAllPlayers();
}
```

## Testing

### Test WebSocket Connection
```javascript
// In browser console
wsService.connect(
  () => console.log('✅ Connected'),
  (err) => console.error('❌ Error:', err)
);
```

### Test Subscription
```javascript
wsService.subscribeToPlayers((data) => {
  console.log('📥 Received:', data);
});
```

### Test Publishing
```javascript
wsService.sendToPlayers({
  id: 1,
  fullName: "Test User",
  action: "join"
});
```

### Check Connection Status
```javascript
console.log('Connected:', wsService.isConnected());
```

## Debugging

Enable STOMP debug logs in `websocketService.js`:

```javascript
debug: (str) => {
  console.log('STOMP Debug:', str);
}
```

Check browser console for:
- Connection status
- Subscription confirmations
- Received messages
- Errors

## Common Issues

### CORS Errors
Ensure backend allows your origin:
```java
.setAllowedOrigins("http://localhost:3000")
```

### Connection Refused
Check:
- Backend is running
- WebSocket endpoint is correct (`/ws`)
- Port is accessible

### Messages Not Received
Verify:
- Subscription topic matches backend (`/topic/players`)
- Message format is correct
- Backend is broadcasting to the topic

### Auto-Reconnect Not Working
Check:
- `maxReconnectAttempts` is not exceeded
- Network connection is stable
- Backend is running

## Production Considerations

1. **WSS (Secure WebSocket)**
   ```javascript
   const WS_BASE_URL = 'https://your-domain.com';
   ```

2. **Authentication**
   Add token to connection:
   ```javascript
   connectHeaders: {
     'Authorization': `Bearer ${token}`
   }
   ```

3. **Heartbeat Configuration**
   ```javascript
   heartbeatIncoming: 4000,  // 4 seconds
   heartbeatOutgoing: 4000
   ```

4. **Connection Pooling**
   Use singleton instance (already implemented)

5. **Error Monitoring**
   Integrate with error tracking (Sentry, etc.)

## Future Enhancements

- [ ] Add typing indicators
- [ ] Show player avatars
- [ ] Display team assignments
- [ ] Add chat functionality
- [ ] Implement room capacity limits
- [ ] Add admin controls (kick, ban)
- [ ] Show connection quality indicator
- [ ] Add sound notifications for joins/leaves
