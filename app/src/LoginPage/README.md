# Login/Authentication System

## Overview
Player authentication system with API integration and localStorage persistence.

## API Endpoint

### POST `/api/v1/player`

**Request Body:**
```json
{
  "fullName": "string",
  "username": "string"
}
```

**Response:**
```json
{
  "message": "string",
  "success": true,
  "data": {
    "id": 0,
    "fullName": "string",
    "username": "string",
    "teamId": 0,
    "teamName": "string"
  },
  "metaData": {},
  "fieldsErrors": {
    "fullName": "string",
    "username": "string"
  }
}
```

## File Structure

```
src/LoginPage/
├── LoginMain.js                 # Login page component
└── services/
    └── authService.js          # Authentication API service
```

## Components

### LoginMain.js
The main login component with form handling.

**Props:**
- `onLoginSuccess` - Callback function called after successful login

**Features:**
- Full Name and Username inputs
- Form validation
- Field-specific error display
- Loading state during API call
- Error handling
- Responsive design

### authService.js
Service file containing all authentication-related API calls and localStorage management.

**Functions:**

#### `loginPlayer(playerData)`
Posts player data to the API.
```javascript
const response = await loginPlayer({
  fullName: "John Doe",
  username: "johndoe"
});
```

#### `savePlayerToLocalStorage(playerData)`
Saves player data to localStorage.
```javascript
savePlayerToLocalStorage({
  id: 1,
  fullName: "John Doe",
  username: "johndoe",
  teamId: 5,
  teamName: "Pirates"
});
```

**Stores:**
- `player` - Full player object as JSON
- `playerId` - Player ID as string
- `teamId` - Team ID as string

#### `getPlayerFromLocalStorage()`
Retrieves player data from localStorage.
```javascript
const player = getPlayerFromLocalStorage();
// Returns: { id, fullName, username, teamId, teamName } or null
```

#### `isPlayerLoggedIn()`
Checks if player is logged in.
```javascript
if (isPlayerLoggedIn()) {
  // Player is logged in
}
```

#### `clearPlayerFromLocalStorage()`
Clears all player data (logout).
```javascript
clearPlayerFromLocalStorage();
```

## App.js Integration

The App component manages the authentication flow:

1. **Check login status** on mount
2. **Show Game Not Started** if `gameStarted = false`
3. **Show Login Page** if game started but user not logged in
4. **Show Main App** if user is logged in

```javascript
const [gameStarted, setGameStarted] = useState(true);
const [isLoggedIn, setIsLoggedIn] = useState(false);

// Flow:
// gameStarted = false → GameNotStarted
// gameStarted = true, isLoggedIn = false → LoginPage
// gameStarted = true, isLoggedIn = true → Main App (Puzzles/Leaderboard)
```

## Error Handling

### Network Errors
```javascript
{
  status: 0,
  message: 'Network error. Please check your connection.',
  fieldsErrors: {}
}
```

### API Errors
```javascript
{
  status: 400,
  message: 'Validation failed',
  fieldsErrors: {
    fullName: 'Full name is required',
    username: 'Username already taken'
  }
}
```

### Field-Specific Errors
Field errors are displayed below each input:
- Red border on input
- Error message below field

### General Errors
General errors are displayed above the submit button:
- Red alert box with message

## localStorage Structure

```javascript
{
  "player": "{\"id\":1,\"fullName\":\"John Doe\",\"username\":\"johndoe\",\"teamId\":5,\"teamName\":\"Pirates\"}",
  "playerId": "1",
  "teamId": "5"
}
```

## Configuration

### API Base URL
Set in `.env` file:
```env
REACT_APP_API_URL=http://localhost:8080
```

Or defaults to `http://localhost:8080` if not set.

## Usage Examples

### Get Current Player
```javascript
import { getPlayerFromLocalStorage } from './LoginPage/services/authService';

const player = getPlayerFromLocalStorage();
console.log(player.fullName); // "John Doe"
console.log(player.teamName);  // "Pirates"
```

### Check Auth Status
```javascript
import { isPlayerLoggedIn } from './LoginPage/services/authService';

if (isPlayerLoggedIn()) {
  // Show protected content
} else {
  // Redirect to login
}
```

### Logout
```javascript
import { clearPlayerFromLocalStorage } from './LoginPage/services/authService';

const handleLogout = () => {
  clearPlayerFromLocalStorage();
  window.location.reload(); // Or navigate to login
};
```

## Features

✅ **API Integration** - POST request to `/api/v1/player`  
✅ **localStorage Persistence** - Data saved across sessions  
✅ **Auto-login** - Checks localStorage on app mount  
✅ **Field Validation** - Individual field error display  
✅ **Loading States** - Disabled inputs and button during API call  
✅ **Error Handling** - Network and API errors  
✅ **Responsive Design** - Mobile-first layout  
✅ **Clean Architecture** - Separated service layer  

## Testing

### Test API Integration
1. Start your backend server
2. Set `REACT_APP_API_URL` in `.env`
3. Fill in form and click "Join the Game"
4. Check Network tab for API call
5. Check localStorage for saved data

### Test Persistence
1. Login successfully
2. Refresh the page
3. Should stay logged in (skip login page)

### Test Logout
```javascript
// In browser console
localStorage.clear();
window.location.reload();
```

## Future Enhancements

- [ ] JWT token authentication
- [ ] Token refresh mechanism
- [ ] Session timeout
- [ ] Remember me option
- [ ] Password field (if needed)
- [ ] Social login integration
- [ ] Email verification
- [ ] Password reset flow
