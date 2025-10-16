# Leaderboard System Documentation

## Overview
The leaderboard system displays team rankings with real-time updates, showing each team's rank, level, XP progress, and position in the competition.

## Files Structure

### Services
- **`services/leaderboardWebSocketService.js`** - WebSocket for real-time leaderboard updates
- **`services/leaderboardService.js`** - localStorage caching utilities

### Components
- **`LeaderboardPage/LeaderboardMain.js`** - Main leaderboard page component
- **`LeaderboardPage/components/LeaderboardCard.js`** - Individual team card component

## WebSocket Topics

### `/app/leaderboard`
Request-response endpoint for initial leaderboard data.

**Usage:** Subscribe once on connection to get current leaderboard state.

**Response Format:**
```json
{
  "message": "string",
  "success": true,
  "data": [
    {
      "id": 0,
      "name": "string",
      "xp": 0,
      "level": 0,
      "rank": 0
    }
  ],
  "metaData": {},
  "fieldsErrors": {}
}
```

### `/topic/leaderboard`
Broadcast topic for leaderboard updates.

**Use Cases:**
- Team solves puzzle (XP changes)
- Team levels up
- Team ranking changes
- New team joins

**Message Format:** Same as `/app/leaderboard` response

## Features

### 1. **Dual Subscription Pattern**
- **`/app/leaderboard`** - Initial data on connection
- **`/topic/leaderboard`** - Real-time updates
- Single WebSocket connection for both

### 2. **Real-time Updates**
- All clients see leaderboard changes instantly
- Rankings update automatically when teams gain XP
- No manual refresh needed

### 3. **Caching Strategy**
- **localStorage** with key: `leaderboard`
- Cache-then-fetch pattern
- Instant UI rendering from cache
- Background WebSocket updates

### 4. **Dynamic XP Calculation**
- Uses `xpperLevel` from game settings
- `maxXP = level × xpPerLevel`
- Consistent with PlayerInfo component

### 5. **Multiple Callbacks**
- Supports multiple components subscribing
- Single WebSocket subscription
- All callbacks notified on update

## Component Usage

### LeaderboardMain
```jsx
<LeaderboardMain onNavigate={setCurrentPage} />
```

**State Management:**
- `leaderboard` - Array of teams with rankings
- `gameSettings` - Game configuration for XP calculations
- `loading` - Loading state for initial fetch
- `hasSubscribed` - Prevents duplicate subscriptions

**Lifecycle:**
1. Mount → Load from localStorage (instant UI)
2. Load game settings (for XP calculations)
3. Connect to leaderboard WebSocket
4. Subscribe to `/app/leaderboard` (initial data)
5. Subscribe to `/topic/leaderboard` (updates)
6. Unmount → Unsubscribe and cleanup

## Data Mapping

### API Response → Component Props
```javascript
{
  id: 1,           // Team ID
  name: "Pirates", // teamName prop
  xp: 180,         // currentXP prop
  level: 5,        // level prop
  rank: 1          // rank prop
}
// maxXP calculated: level × xpPerLevel
```

## localStorage Schema

### Key: `leaderboard`
**Value:** Array of team objects
```json
[
  {
    "id": 1,
    "name": "Pirates",
    "xp": 180,
    "level": 5,
    "rank": 1
  },
  {
    "id": 2,
    "name": "Vikings",
    "xp": 150,
    "level": 4,
    "rank": 2
  }
]
```

## WebSocket Service API

### Methods

#### `connect(onConnected, onError)`
Establishes WebSocket connection.

**Parameters:**
- `onConnected` - Callback when connected
- `onError` - Callback on connection error

#### `subscribeToLeaderboard(callback)`
Subscribes to both initial data and updates.

**Parameters:**
- `callback(leaderboardData)` - Called with array of teams

**Returns:** `true` on success, `null` if pending

#### `unsubscribe()`
Unsubscribes from all leaderboard topics.

#### `disconnect()`
Closes WebSocket connection and cleans up.

#### `isConnected()`
Returns connection status.

## Debug Logging

Emoji logging for easy debugging:

- 🏆 Leaderboard operations
- 📦 Cache hit
- ✅ Success operations
- ❌ Errors
- 🔄 WebSocket update
- 📡 Subscribing to topics
- 🔌 Connection status
- 📨 Message received

## Data Flow

### Initial Load
```
LeaderboardMain → localStorage → subscribeToLeaderboard() → 
/app/leaderboard → setState → Render
```

### Real-time Update
```
Backend → /topic/leaderboard → WebSocket callback → 
setState → Re-render with new rankings
```

## Integration with Other Systems

### Game Settings
- Uses `gameSettings.xpperLevel` for max XP calculation
- Shares game settings with PlayerInfo component

### Team System
- Teams automatically appear in leaderboard
- Ranking based on XP and level
- Real-time updates when team XP changes

### Puzzle System
- When puzzle solved → Team XP increases → Leaderboard updates
- Broadcast to all connected clients

## Error Handling

- Loading state with spinner
- "No teams yet" message for empty leaderboard
- Fallback to default `xpPerLevel: 75`
- Console logging for debugging
- Graceful WebSocket reconnection

## Testing Checklist

- [ ] Leaderboard loads from cache immediately
- [ ] Initial data fetched from `/app/leaderboard`
- [ ] Real-time updates from `/topic/leaderboard`
- [ ] Rankings update when teams gain XP
- [ ] Multiple clients see same leaderboard state
- [ ] Max XP calculated correctly (level × xpPerLevel)
- [ ] Empty state shows "No teams yet"
- [ ] Loading state shows spinner
- [ ] WebSocket reconnects automatically
- [ ] Cache persists on page refresh

## Performance Optimizations

1. **Single Subscription Per Topic**
   - Multiple callbacks on one subscription
   - Reduces WebSocket overhead

2. **localStorage Caching**
   - Instant UI rendering
   - Reduces API calls
   - Survives page refreshes

3. **Pending Callbacks Queue**
   - Handles subscriptions before connection
   - No race conditions
   - Automatic processing on connect

## Future Enhancements

- [ ] Team icons/avatars on leaderboard cards
- [ ] Medal icons for top 3 teams
- [ ] Animated ranking changes
- [ ] Smooth transitions when order changes
- [ ] Historical data (XP gained today/week)
- [ ] Team details modal on card click
- [ ] Filter/search teams
- [ ] Export leaderboard as image
- [ ] Achievement badges display
- [ ] Real-time XP gain notifications
