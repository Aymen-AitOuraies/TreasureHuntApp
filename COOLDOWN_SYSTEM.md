# Puzzle Cooldown System

## Overview
Implemented a cooldown system for puzzle attempts that uses the game settings API to control failed attempt limits and cooldown duration.

## Game Settings API Structure
```json
{
  "message": "string",
  "success": true,
  "data": {
    "id": 0,
    "state": "NOT_STARTED",
    "stateDisplayName": "string",
    "playersPerTeam": 0,
    "attemptsUntilCooldown": 0,  // Number of failed attempts before cooldown
    "cooldownDuration": 0,        // Cooldown duration in seconds
    "xpperLevel": 0
  }
}
```

## Features

### 1. **Dynamic Settings from API**
- Fetches `attemptsUntilCooldown` and `cooldownDuration` from the game settings API
- Falls back to default values (3 attempts, 60 seconds) if API fails
- Settings are passed down to each puzzle card

### 2. **Failed Attempt Tracking**
- Tracks the number of failed attempts per puzzle
- Shows remaining attempts warning when user starts failing
- Example: "2 attempts remaining" after first wrong answer

### 3. **Cooldown Activation**
- When failed attempts reach the limit, cooldown is triggered
- Cooldown timer displays in MM:SS format
- Input field and submit button are disabled during cooldown

### 4. **Persistent Cooldown State**
- Cooldown state is saved in localStorage per puzzle
- Survives page refreshes
- Automatically clears when cooldown expires

### 5. **Visual Feedback**
- **Error Message**: Red alert showing the error when answer is wrong
- **Attempts Warning**: Yellow alert showing remaining attempts
- **Cooldown Alert**: Red alert with clock icon and countdown timer
- **Success**: Clears all error states and resets attempts

## Implementation Details

### Modified Files

#### 1. **PuzzlesMain.js**
```javascript
// Fetches game settings and passes to PuzzleCard
const [gameSettings, setGameSettings] = useState(null);

// Pass cooldown settings to each puzzle card
<PuzzleCard
  attemptsUntilCooldown={gameSettings?.attemptsUntilCooldown || 3}
  cooldownDuration={gameSettings?.cooldownDuration || 60}
/>

// Error handling to trigger cooldown
const handleSubmitAnswer = async (puzzleId, answer) => {
  // Throws error on wrong answer to let PuzzleCard track it
  if (!response.success) {
    throw new Error(response.message || 'Incorrect answer');
  }
};
```

#### 2. **PuzzleCard.js**
New state variables:
- `failedAttempts`: Counter for wrong answers
- `isOnCooldown`: Boolean flag for cooldown state
- `cooldownTimeLeft`: Remaining seconds in cooldown
- `errorMessage`: Display error messages to user

Key functions:
- `handleSubmit`: Tracks attempts and triggers cooldown
- `startCooldown`: Activates cooldown and saves to localStorage
- `formatTime`: Formats seconds to MM:SS display

## User Experience Flow

1. **Normal State**
   - User can submit answers freely
   - Each wrong answer shows an error message

2. **Warning State** (1+ failed attempts)
   - Yellow banner appears showing "X attempts remaining"
   - Error message displays the specific error

3. **Cooldown State** (max attempts reached)
   - Red cooldown banner appears with timer
   - Input field is disabled
   - Submit button is hidden
   - Timer counts down: "Try again in 2:30"

4. **Recovery**
   - After cooldown expires, attempts reset to 0
   - User can try again
   - If user answers correctly, all counters reset immediately

## localStorage Keys

Each puzzle stores its cooldown state independently:
- Key: `puzzle_cooldown_${puzzleNumber}`
- Value: `{ endTime: timestamp, attempts: number }`

## Benefits

1. **Prevents Spam**: Limits brute-force attempts on puzzles
2. **Fair Play**: Encourages thoughtful answers
3. **Configurable**: Admins can adjust settings via game settings API
4. **User-Friendly**: Clear visual feedback on state
5. **Persistent**: Cooldown survives page refreshes
6. **Per-Puzzle**: Each puzzle has independent cooldown tracking

## Testing Scenarios

1. **Wrong Answer**: Submit wrong answer → See error + attempts warning
2. **Multiple Failures**: Submit wrong answer 3 times → Cooldown activates
3. **Page Refresh**: Refresh during cooldown → Timer continues from where it left off
4. **Correct Answer**: Answer correctly after failures → Resets all states
5. **Different Puzzles**: Cooldown on one puzzle doesn't affect others
6. **Timer Expiry**: Wait for cooldown to finish → Attempts reset and can try again

## Configuration

Default values (used if API fails):
- `attemptsUntilCooldown`: 3
- `cooldownDuration`: 60 seconds

To change these values, update the game settings via your admin API.
