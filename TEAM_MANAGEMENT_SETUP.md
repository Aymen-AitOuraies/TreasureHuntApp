# Team Management System

This document explains the team management system in the Treasure Hunt App.

## Overview

The team management system allows players to:
- View their team information
- See team members
- Edit the team name
- See team stats (XP and Level)
- Receive real-time updates when team data changes

## Components

### 1. Team Services

#### `src/services/teamService.js`

REST API service for team operations:

```javascript
// Get team by player ID
getTeamByPlayerId(playerId) 
// → GET /api/v1/teams/player/{playerId}

// Update team name
updateTeamName(teamId, newName)
// → PUT /api/v1/teams/{teamId}

// localStorage helpers
saveTeamToLocalStorage(teamData)
getTeamFromLocalStorage()
clearTeamFromLocalStorage()
```

#### `src/services/teamWebSocketService.js`

WebSocket service for real-time team updates:

```javascript
// Connect to WebSocket
connect(onConnected, onError)

// Subscribe to team updates
subscribeToTeamUpdates(teamId, callback)
// → Subscribes to /topic/teams/{teamId}

// Unsubscribe from specific team
unsubscribeFromTeam(teamId)

// Disconnect
disconnect()
```

### 2. UI Components

#### `src/components/TeamModal.js`

Modal component that displays team information:

**Features:**
- Shows team name with edit button
- Displays team XP and Level
- Lists all team members
- Inline editing for team name
- Real-time updates via WebSocket
- Validation and error handling

**Props:**
- `team` - Team object to display
- `onClose` - Callback when modal is closed
- `onTeamUpdated` - Callback when team is updated

#### `src/components/Header.js`

Updated header component with team icon:

**New Props:**
- `showTeamIcon` - Boolean to show/hide team icon (default: false)

**Features:**
- Team icon with member count badge
- Fetches team data on mount
- Connects to team WebSocket
- Opens team modal on icon click
- Caches team data in localStorage
- Automatically updates when team changes

### 3. Layout Integration

#### `src/components/Layout.js`

Updated to pass `showTeamIcon` prop to Header:

```javascript
<Layout showTeamIcon={true}>
  {/* Game content */}
</Layout>
```

## Data Flow

### Initial Load (IN_PROGRESS state)

```
1. Header mounts with showTeamIcon={true}
   ↓
2. Check localStorage for cached team data
   ↓
3. Fetch team data from API: GET /api/v1/teams/player/{playerId}
   ↓
4. Save team data to localStorage
   ↓
5. Connect to team WebSocket
   ↓
6. Subscribe to /topic/teams/{teamId}
   ↓
7. Display team icon with member count
```

### Editing Team Name

```
1. User clicks team icon
   ↓
2. TeamModal opens with team data
   ↓
3. User clicks edit button
   ↓
4. User enters new name
   ↓
5. User clicks save
   ↓
6. PUT /api/v1/teams/{teamId} with new name
   ↓
7. Backend broadcasts update to /topic/teams/{teamId}
   ↓
8. All team members receive update via WebSocket
   ↓
9. Team data updates in UI automatically
```

### Real-time Updates

When ANY team member or admin updates the team:

```
Backend sends update to /topic/teams/{teamId}
   ↓
All subscribed clients receive the update
   ↓
Header component updates team state
   ↓
TeamModal updates (if open)
   ↓
localStorage updates
   ↓
UI reflects new data
```

## API Endpoints

### GET /api/v1/teams/player/{playerId}

**Request:**
```
GET /api/v1/teams/player/2
```

**Response:**
```json
{
  "message": "Team retrieved successfully",
  "success": true,
  "data": {
    "id": 1,
    "name": "Awesome Pirates",
    "xp": 150,
    "level": 3,
    "players": [
      {
        "id": 2,
        "fullName": "Aymen",
        "username": "aait-ou",
        "teamId": 1,
        "teamName": "Awesome Pirates"
      }
    ]
  }
}
```

### PUT /api/v1/teams/{id}

**Request:**
```
PUT /api/v1/teams/1
Content-Type: application/json

{
  "name": "Super Pirates"
}
```

**Response:**
```json
{
  "message": "Team updated successfully",
  "success": true,
  "data": {
    "id": 1,
    "name": "Super Pirates",
    "xp": 150,
    "level": 3,
    "players": [...]
  }
}
```

## WebSocket Topics

### /topic/teams/{teamId}

**Subscribe:** All team members should subscribe to receive updates

**Message Format:**
```json
{
  "id": 1,
  "name": "Updated Team Name",
  "xp": 200,
  "level": 4,
  "players": [...]
}
```

**Triggered When:**
- Team name is updated
- Team XP changes
- Team level changes
- Players join/leave team
- Any team data modification

## Usage in App

### Show Team Icon (IN_PROGRESS state)

The team icon is automatically shown in the Header when the game is IN_PROGRESS. This is handled in App.js:

```javascript
case GAME_STATES.IN_PROGRESS:
  // Header in Layout component will show team icon
  switch(currentPage) {
    case 'puzzle':
      return <PuzzlesMain onNavigate={setCurrentPage} />;
    // ... other pages
  }
```

### Hide Team Icon (Other states)

For pages that use Header directly (WaitingPage, ArrangingTeamsPage):

```javascript
<Header showTeamIcon={false} />
```

Or simply:
```javascript
<Header />  // defaults to false
```

## Console Logs

The system provides detailed logging:

**Team Service:**
- 🔍 Fetching team for player
- ✅ Team data received
- ✏️ Updating team name
- ❌ Errors

**Team WebSocket:**
- 🔌 Connecting to Team WebSocket
- ✅ Team WebSocket Connected
- 📡 Subscribing to /topic/teams/{id}
- 📨 Team update received
- ✅ Team data updated

**Header:**
- 📦 Using cached team data
- ✅ Team WebSocket connected in Header
- 🔄 Team updated via WebSocket

## Error Handling

1. **No Player Data:** If no player found in localStorage, error is logged and team icon won't work
2. **API Errors:** Errors are caught and logged, cached data is used as fallback
3. **WebSocket Errors:** Connection errors are logged, automatic reconnection via STOMP client
4. **Validation:** Empty team names are rejected with error message
5. **Network Errors:** User-friendly error messages displayed in modal

## localStorage Keys

- `team` - JSON string of team object
- `teamId` - Team ID as string
- `player` - Player object (from auth)
- `playerId` - Player ID (from auth)

## Best Practices

1. **Always check player login** before fetching team data
2. **Use cached data** for instant UI while fetching fresh data
3. **Clean up WebSocket subscriptions** when component unmounts
4. **Handle null states** gracefully
5. **Validate user input** before sending to API
6. **Provide user feedback** during async operations
7. **Revert changes** on error to maintain consistency

## Testing Checklist

- [ ] Team icon appears in IN_PROGRESS state
- [ ] Team icon shows correct member count
- [ ] Clicking icon opens modal with team data
- [ ] Team stats (XP, Level) display correctly
- [ ] All team members listed
- [ ] Edit button enables name editing
- [ ] Save button updates team name via API
- [ ] Cancel button reverts changes
- [ ] Empty names are rejected
- [ ] WebSocket updates are received in real-time
- [ ] Multiple team members see simultaneous updates
- [ ] Cached data loads instantly on refresh
- [ ] WebSocket reconnects after connection loss
- [ ] Modal closes properly
- [ ] Error messages display for failures

## Files Created/Modified

- ✅ `src/services/teamService.js` - Team REST API service
- ✅ `src/services/teamWebSocketService.js` - Team WebSocket service
- ✅ `src/components/TeamModal.js` - Team information modal
- ✅ `src/components/Header.js` - Updated with team icon
- ✅ `src/components/Layout.js` - Updated to pass showTeamIcon prop
- ✅ `TEAM_MANAGEMENT_SETUP.md` - This documentation
