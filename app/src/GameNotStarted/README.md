# Game Not Started Feature

## Overview
A blocking page that prevents users from accessing the game until it officially starts. Only admins can still access the admin panel.

## How It Works

### Current Setup
In `App.js`, there's a state variable that controls game access:

```javascript
const [gameStarted, setGameStarted] = useState(false);
```

- **`false`** - Shows "Game Not Started" page (blocks all users)
- **`true`** - Allows normal game access (shows login/main app)

### To Start the Game

**Option 1: Manually change the code**
```javascript
const [gameStarted, setGameStarted] = useState(true); // Change to true
```

**Option 2: Schedule automatic start (recommended)**
```javascript
useEffect(() => {
  // Set the game start date/time
  const gameStartTime = new Date('2025-10-20T09:00:00');
  const now = new Date();
  
  if (now >= gameStartTime) {
    setGameStarted(true);
  } else {
    // Check every minute if game should start
    const interval = setInterval(() => {
      if (new Date() >= gameStartTime) {
        setGameStarted(true);
        clearInterval(interval);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }
}, []);
```

**Option 3: Control from API (when backend is ready)**
```javascript
useEffect(() => {
  // Fetch game status from backend
  fetch('/api/game-status')
    .then(res => res.json())
    .then(data => setGameStarted(data.isStarted))
    .catch(err => console.error(err));
}, []);
```

## Admin Access
Admins can **always** access `/admin` regardless of game status:
- Navigate to `http://localhost:3000/admin`
- Admin panel is available even when game hasn't started

## File Structure
```
src/
├── GameNotStarted/
│   └── GameNotStarted.js    # The blocking page component
└── App.js                    # Contains game state logic
```

## Page Features

### GameNotStarted Component
- **Responsive design** - Mobile to desktop
- **Animated clock icon** - Pulse effect
- **Clear messaging** - Tells users game hasn't started
- **Pirate theme** - Matches your treasure hunt aesthetic
- **Info box** - "Stay tuned for updates"

### Styling
- Gradient background (primary → background → secondary)
- Centered card layout
- Glass-morphism effect (semi-transparent white)
- Responsive text sizes
- Decorative elements (pirate flag icon)

## Customization

### Change the Message
Edit `GameNotStarted.js`:
```javascript
<h1>Your Custom Title</h1>
<p>Your custom description</p>
```

### Change the Icon
Replace the clock icon:
```javascript
<Icon icon="mdi:treasure-chest" />  // Treasure chest
<Icon icon="game-icons:ship" />     // Ship
<Icon icon="mdi:compass" />         // Compass
```

### Add Countdown Timer
```javascript
const [timeLeft, setTimeLeft] = useState('');

useEffect(() => {
  const startTime = new Date('2025-10-20T09:00:00');
  
  const interval = setInterval(() => {
    const now = new Date();
    const diff = startTime - now;
    
    if (diff <= 0) {
      setTimeLeft('Starting now!');
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    setTimeLeft(`${days}d ${hours}h ${minutes}m`);
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
```

## Testing

### Test Game Not Started
1. Set `gameStarted = false` in App.js
2. Navigate to `http://localhost:3000`
3. Should see "Game Not Started" page

### Test Game Started
1. Set `gameStarted = true` in App.js
2. Navigate to `http://localhost:3000`
3. Should see normal app (puzzle page)

### Test Admin Access
1. Set `gameStarted = false` in App.js
2. Navigate to `http://localhost:3000/admin`
3. Should see admin login (bypasses game not started)

## Production Deployment

### Environment Variable Approach
Create `.env` file:
```
REACT_APP_GAME_START_TIME=2025-10-20T09:00:00
REACT_APP_GAME_STARTED=false
```

In App.js:
```javascript
const [gameStarted, setGameStarted] = useState(
  process.env.REACT_APP_GAME_STARTED === 'true'
);
```

### API Approach (Recommended)
Control game state from backend admin panel:
- Admin can toggle game start/stop from dashboard
- Backend stores game state in database
- Frontend checks game state on load and periodically
- Real-time updates possible with WebSockets

## Tips

1. **Always test before event** - Make sure the toggle works
2. **Set reminders** - Don't forget to start the game!
3. **Have a backup plan** - Keep admin access always available
4. **Communicate clearly** - Tell users when game will start
5. **Consider timezones** - Use UTC or be clear about timezone

## Future Enhancements

- Real-time countdown timer
- Email notifications when game starts
- Push notifications
- Social media integration
- Live chat for waiting users
- Teaser content while waiting
- Registration during waiting period
