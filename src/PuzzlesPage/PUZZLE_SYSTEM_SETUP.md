# Puzzle System Documentation

## Overview
The puzzle system manages team puzzles with real-time updates, allowing teams to view, attempt, and solve puzzles during the game.

## Files Structure

### Services
- **`services/puzzleService.js`** - REST API for puzzle operations
- **`services/puzzleWebSocketService.js`** - WebSocket for real-time puzzle updates

### Components
- **`PuzzlesPage/PuzzlesMain.js`** - Main puzzles page component
- **`PuzzlesPage/components/PuzzleCard.js`** - Individual puzzle card component
- **`PuzzlesPage/components/SuccessAnimation.js`** - Success animation overlay

### Styling
- **`index.css`** - Custom animations (checkmark, scaleIn, fadeIn)

## API Endpoints

### GET `/api/v1/team-puzzles/team/{teamId}`
Fetches all puzzles for a specific team.

**Response:**
```json
{
  "message": "string",
  "success": true,
  "data": [
    {
      "id": 0,
      "teamId": 0,
      "teamName": "string",
      "puzzleId": 0,
      "puzzleTitle": "string",
      "puzzleDescription": "string",
      "puzzlePhotoUrl": "string",
      "puzzlePoints": 0,
      "puzzleXp": 0,
      "solved": true,
      "nextCooldown": "2025-10-16T08:37:14.780Z",
      "attempts": 0
    }
  ]
}
```

### POST `/api/v1/team-puzzles/submit-answer`
Submits an answer for a puzzle.

**Request Body:**
```json
{
  "teamId": 0,
  "puzzleId": 0,
  "answer": "string"
}
```

**Response:**
```json
{
  "message": "Correct answer!" | "Incorrect answer",
  "success": true | false
}
```

## WebSocket Topic

### `/topic/team/{teamId}/puzzles`
Broadcasts puzzle updates to all team members.

**Use Cases:**
- Puzzle is solved by any team member
- Puzzle cooldown expires
- New puzzle becomes available
- Puzzle state changes

**Message Format:**
Same as GET endpoint response (array of puzzles)

## Features

### 1. **Real-time Updates**
- WebSocket connection subscribes to team-specific puzzle updates
- All team members see solved puzzles instantly
- Automatic UI refresh when puzzle state changes

### 2. **Caching Strategy**
- **localStorage** caching with key: `teamPuzzles_{teamId}`
- Cache-then-fetch pattern for instant UI rendering
- Fresh data fetched from API in background

### 3. **Success Animation**
- Beautiful animated checkmark on correct answer
- Auto-dismisses after 3 seconds
- Shows server response message
- No annoying alerts!

### 4. **Error Handling**
- Loading states with spinner
- "No team assigned" fallback
- "No puzzles available" message
- Error alerts for failed submissions
- Console logging with emojis for debugging

## Component Usage

### PuzzlesMain
```jsx
<PuzzlesMain onNavigate={setCurrentPage} />
```

**State Management:**
- `puzzles` - Array of team puzzles
- `loading` - Loading state for initial fetch
- `team` - Current team data from localStorage
- `showSuccess` - Controls success animation visibility
- `successMessage` - Message to display in animation

**Lifecycle:**
1. Mount → Get team from localStorage
2. Fetch puzzles (cache + API)
3. Connect to puzzle WebSocket
4. Subscribe to `/topic/team/{teamId}/puzzles`
5. Unmount → Unsubscribe and cleanup

### SuccessAnimation
```jsx
<SuccessAnimation 
  message="Correct answer!" 
  onClose={handleCloseSuccess} 
/>
```

**Props:**
- `message` - Success message to display
- `onClose` - Callback when animation closes

**Behavior:**
- Fades in with overlay
- Scales in card with checkmark
- Animated checkmark drawing effect
- Auto-closes after 3 seconds

## CSS Animations

### Added to `index.css`:

```css
@keyframes scaleIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes checkmark {
  0% {
    stroke-dasharray: 0, 100;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 100, 100;
    stroke-dashoffset: 0;
  }
}
```

**Classes:**
- `.animate-scaleIn` - Scale in animation (0.4s)
- `.animate-checkmark` - Checkmark drawing effect (0.6s)
- `.checkmark-path` - SVG path styling

## Data Flow

1. **Initial Load:**
   ```
   PuzzlesMain → localStorage → getTeamPuzzles() → setState → Render
   ```

2. **Submit Answer:**
   ```
   PuzzleCard → handleSubmitAnswer() → submitPuzzleAnswer() → Success Animation
   ```

3. **WebSocket Update:**
   ```
   Backend → /topic/team/{teamId}/puzzles → subscribeToPuzzleUpdates() → setState → Re-render
   ```

## localStorage Schema

### Key: `teamPuzzles_{teamId}`
**Value:** Array of puzzle objects
```json
[
  {
    "id": 1,
    "puzzleId": 1,
    "puzzleTitle": "The Color Sequence",
    "puzzleDescription": "Red is first...",
    "solved": false,
    "puzzlePoints": 100,
    "puzzleXp": 50,
    "attempts": 2,
    "nextCooldown": "2025-10-16T10:30:00Z"
  }
]
```

## Debug Logging

All services use emoji logging for easy debugging:

- 🧩 Fetching/Loading puzzles
- 📦 Cache hit
- ✅ Success operations
- ❌ Errors
- 📝 Submitting answer
- 🔄 WebSocket update
- 📡 Subscribing to WebSocket
- 🔌 Connection status

## Integration with Other Systems

### Team System
- Uses `getTeamFromLocalStorage()` to get current team
- Team ID required for all puzzle operations

### Game State
- Puzzles only accessible during `IN_PROGRESS` state
- Managed by parent App.js routing

### XP/Points System
- Each puzzle has `puzzleXp` and `puzzlePoints`
- Applied to team when puzzle solved
- Updated via team WebSocket

## Testing Checklist

- [ ] Puzzles load from API on mount
- [ ] Cached puzzles show immediately
- [ ] Submit answer shows success animation (correct)
- [ ] Submit answer shows error alert (incorrect)
- [ ] Success animation auto-closes after 3s
- [ ] WebSocket updates reflect immediately
- [ ] Multiple team members see same puzzle state
- [ ] Solved puzzles remain solved on refresh
- [ ] No team shows "No team assigned" message
- [ ] Empty puzzle list shows "No puzzles available"

## Future Enhancements

- [ ] Add puzzle images (`puzzlePhotoUrl`)
- [ ] Show remaining attempts before cooldown
- [ ] Cooldown timer UI (`nextCooldown`)
- [ ] Hint system integration
- [ ] Puzzle difficulty indicators
- [ ] Sound effects for correct/incorrect
- [ ] Confetti animation on solve
- [ ] Puzzle categories/filters
