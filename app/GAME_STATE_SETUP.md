# Game State Management

This document explains how the game state WebSocket system works in the Treasure Hunt App.

## Game States

The application supports 5 different game states:

1. **NOT_STARTED** - Game has not been initiated yet
2. **WAITING_FOR_PLAYERS** - Players can join and wait in the lobby
3. **ARRANGING_TEAMS** - Admin is organizing teams
4. **IN_PROGRESS** - Game is actively running
5. **FINISHED** - Game has ended

## How It Works

### Backend (Spring Boot)

The backend provides WebSocket endpoints for game state management:

```java
@SubscribeMapping("/game/state")
public GameStateResponse subscribeGameState() {
    // Returns current game state when client subscribes
    return gameService.getCurrentGameState();
}

@MessageMapping("/game/set-state")
@SendTo("/topic/game/state")
public GameStateResponse setGameState(GameStateUpdateRequest request) {
    // Updates game state and broadcasts to all clients
    return gameService.updateGameState(request);
}
```

### Frontend (React)

#### WebSocket Service

Location: `src/services/gameStateWebSocketService.js`

Provides methods to:
- Connect to game state WebSocket
- Subscribe to initial game state (`/game/state`)
- Subscribe to game state updates (`/topic/game/state`)
- Disconnect and cleanup

#### App.js Integration

The main App component:
1. Connects to game state WebSocket on mount
2. Subscribes to both initial state and updates
3. Renders different pages based on current game state

#### State Flow

```
NOT_STARTED
    ↓
WAITING_FOR_PLAYERS → Login Page (if not logged in)
    ↓                 → Waiting Page (if logged in)
ARRANGING_TEAMS → Arranging Teams Page
    ↓
IN_PROGRESS → Puzzle/Leaderboard/Store Pages
    ↓
FINISHED → Final Leaderboard
```

## Pages

### 1. GameNotStarted (`src/GameNotStarted/GameNotStarted.js`)
- **State**: NOT_STARTED
- **Display**: Message indicating game hasn't started yet

### 2. LoginPage (`src/LoginPage/LoginMain.js`)
- **State**: WAITING_FOR_PLAYERS (if not logged in)
- **Display**: Login form with fullname and username inputs

### 3. WaitingPage (`src/WaitingPage/WaitingPage.js`)
- **State**: WAITING_FOR_PLAYERS (if logged in)
- **Display**: Real-time list of all players waiting
- **WebSocket**: Subscribes to player updates

### 4. ArrangingTeamsPage (`src/ArrangingTeamsPage/ArrangingTeamsPage.js`)
- **State**: ARRANGING_TEAMS
- **Display**: Loading animation with team arrangement message
- **Behavior**: Automatically redirects when state changes to IN_PROGRESS

### 5. Game Pages (Puzzles, Leaderboard, Store)
- **State**: IN_PROGRESS
- **Display**: Main game interface
- **Navigation**: Can switch between puzzle, leaderboard, and store pages

### 6. LeaderboardMain (Final)
- **State**: FINISHED
- **Display**: Final rankings and results

## WebSocket Subscriptions

### Initial State Subscription

```javascript
gameStateWsService.subscribeToInitialGameState((state) => {
  console.log('Initial game state:', state);
  setGameState(state.state);
});
```

Subscribes to: `/game/state`
- Receives: Current game state when connecting
- Triggered: Once upon subscription

### State Updates Subscription

```javascript
gameStateWsService.subscribeToGameStateUpdates((state) => {
  console.log('Game state updated:', state);
  setGameState(state.state);
});
```

Subscribes to: `/topic/game/state`
- Receives: Game state whenever it changes
- Triggered: Every time admin updates the state

## Admin Control

Admins can change the game state by sending a message to `/app/game/set-state`:

```javascript
{
  "state": "WAITING_FOR_PLAYERS"  // or any valid state
}
```

This broadcasts the new state to all connected clients via `/topic/game/state`.

## Console Logs

The system provides detailed logging:

- 🔌 Connection attempts
- ✅ Successful connections/subscriptions
- 📋 Initial game state received
- 🔄 Game state updates
- ❌ Errors

Example console output:
```
🎮 Connecting to Game State WebSocket...
🔌 Connecting to Game WebSocket: http://localhost:8080/ws
✅ Game WebSocket Connected
📡 Subscribing to /game/state for initial state...
✅ Subscribed to /game/state
📋 Initial game state: { state: 'WAITING_FOR_PLAYERS' }
📡 Subscribing to /topic/game/state for updates...
✅ Subscribed to /topic/game/state
🔄 Game state updated: { state: 'IN_PROGRESS' }
```

## Error Handling

If WebSocket connection fails:
- Service attempts to reconnect every 5 seconds (automatically via STOMP client)
- App shows loading state while connecting
- Falls back to NOT_STARTED page if state cannot be determined

## Testing

To test the game state flow:

1. Start with backend in `NOT_STARTED` state
2. Admin changes to `WAITING_FOR_PLAYERS`
3. Players can log in and join waiting room
4. Admin changes to `ARRANGING_TEAMS`
5. Players see arranging teams page
6. Admin changes to `IN_PROGRESS`
7. Players are automatically redirected to game pages
8. Admin changes to `FINISHED`
9. Players see final leaderboard

## Best Practices

1. **Always check login status** before showing game pages
2. **Handle null states gracefully** with loading indicators
3. **Clean up WebSocket connections** on component unmount
4. **Use constants for state names** to avoid typos
5. **Log state changes** for debugging

## Files Modified/Created

- ✅ `src/services/gameStateWebSocketService.js` - Game state WebSocket service
- ✅ `src/ArrangingTeamsPage/ArrangingTeamsPage.js` - Arranging teams page
- ✅ `src/App.js` - Updated with game state management
- ✅ `GAME_STATE_SETUP.md` - This documentation file
