# WebSocket Connection Fix Summary

## Issue: "There is no underlying STOMP connection"

This error occurs when trying to subscribe to a WebSocket topic before the STOMP client is fully connected.

## Root Cause

The connection check `if (!this.client || !this.connected)` was insufficient because:
1. `this.connected` is our internal flag that gets set immediately in `onConnect`
2. However, the STOMP client's own `this.client.connected` might still be `false` for a brief moment
3. This creates a race condition where subscriptions are attempted before the client is fully ready

## Solution Applied

### Triple Connection Check
Changed all subscription methods to use:
```javascript
if (!this.client || !this.connected || !this.client.connected) {
  // Handle pending subscription
  return null;
}
```

This checks:
1. `!this.client` - Client object exists
2. `!this.connected` - Our internal connection flag
3. `!this.client.connected` - STOMP client's own connection state

## Files Fixed

### ✅ Complete - All WebSocket Services Updated

1. **leaderboardWebSocketService.js**
   - `subscribeToLeaderboard()` - Triple connection check added
   - `onConnect` - Added 100ms delay for pending callbacks
   - `onConnect` - Added 50ms delay for onConnected callback

2. **gameStateWebSocketService.js**
   - `subscribeToInitialGameState()` - Triple connection check added
   - `subscribeToGameStateUpdates()` - Triple connection check added

3. **puzzleWebSocketService.js**
   - `subscribeToPuzzleUpdates()` - Triple connection check added

4. **teamWebSocketService.js** (Already had this fix)
   - `subscribeToTeamUpdates()` - Triple connection check present

5. **websocketService.js** (WaitingPage)
   - `subscribeToInitialPlayers()` - Triple connection check added
   - `subscribeToNewPlayers()` - Triple connection check added
   - `sendToPlayers()` - Triple connection check added
   - `requestAllPlayers()` - Triple connection check added

## Additional Fixes

### App.js - Page Refresh Issue
**Problem**: Players had to refresh when game state changed to IN_PROGRESS

**Solution**: Added key prop to force component remounting
```javascript
<div className="block lg:hidden" key={`app-${gameState}-${isLoggedIn}`}>
  {renderCurrentPage()}
</div>
```

This ensures that when `gameState` or `isLoggedIn` changes, React completely remounts the component tree, preventing stale state issues.

### Environment Variables
All services now have fallback values:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080';
```

This prevents "Unexpected token '<'" errors when environment variables aren't loaded.

## Testing Checklist

- [ ] Login to waiting page - no errors
- [ ] Game state changes to ARRANGING_TEAMS - automatically shows arranging page
- [ ] Game state changes to IN_PROGRESS - automatically shows puzzles/game
- [ ] Submit puzzle - leaderboard updates in all components
- [ ] PlayerInfo shows correct rank without refresh
- [ ] New visitors see correct page without "Connecting to server..." stuck
- [ ] No "There is no underlying STOMP connection" errors in console

## Prevention

To prevent this error in future WebSocket services:

1. Always use triple connection check before subscribing:
   ```javascript
   if (!this.client || !this.connected || !this.client.connected) {
     // Queue subscription for later
     return null;
   }
   ```

2. Add small delays in `onConnect`:
   ```javascript
   onConnect: (frame) => {
     this.connected = true;
     setTimeout(() => {
       // Process pending subscriptions
     }, 100);
     if (onConnected) setTimeout(() => onConnected(frame), 50);
   }
   ```

3. Always implement a pending subscription queue for subscriptions attempted before connection is ready

## Date Fixed
October 16, 2025
