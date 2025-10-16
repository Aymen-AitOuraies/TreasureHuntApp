# Quick Setup - WebSocket Integration

## Step 1: Install Dependencies

Run this command in your project root:

```bash
npm install @stomp/stompjs sockjs-client
```

## Step 2: Configure Environment

Create/update `.env` file in project root:

```env
REACT_APP_WS_URL=http://localhost:8080
```

## Step 3: Enable Waiting Page

In `App.js`, uncomment the WaitingPage:

```javascript
return (
  <div className="block lg:hidden">
    <WaitingPage />  // Uncomment this
    {/* {renderCurrentPage()} */}
  </div>
);
```

## Step 4: Test

1. Start your backend server with WebSocket enabled
2. Start React app: `npm start`
3. Navigate to the app
4. Check browser console for WebSocket logs
5. Look for green dot (🟢) indicating connection

## Verification Checklist

- [ ] Dependencies installed
- [ ] `.env` file configured
- [ ] Backend WebSocket endpoint `/ws` available
- [ ] Backend has `/topic/players` and `/app/players` configured
- [ ] Green connection indicator shows in UI
- [ ] Players appear when others join

## Troubleshooting

**Red dot / Not connecting?**
- Check backend is running
- Verify `REACT_APP_WS_URL` is correct
- Check browser console for errors

**No players showing?**
- Check backend is broadcasting to `/topic/players`
- Verify message format matches expected structure
- Check browser Network tab for WebSocket frames

**Need help?**
- See full documentation in `README.md`
- Check browser console for debug logs
- Verify backend WebSocket configuration
