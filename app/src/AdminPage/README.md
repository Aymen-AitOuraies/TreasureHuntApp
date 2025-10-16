# Admin Section

## Overview
The admin section allows administrators to manage puzzles for the Treasure Hunt application.

## Access
Navigate to `/admin` in your browser to access the admin panel.

## Features

### 1. Admin Login
- Email and password authentication
- Simple frontend validation (no API integration yet)
- Any email/password combination will work for now

### 2. Admin Dashboard
- **Add Puzzle Form**: Add new puzzles with:
  - Puzzle Name
  - Answer
  - XP Points
- **Puzzle List**: View all added puzzles
- **Delete Functionality**: Remove puzzles with confirmation dialog
- **Logout**: Return to login screen

## File Structure

```
src/AdminPage/
├── AdminPage.js              # Main admin component (handles auth state)
├── AdminLogin.js             # Login page component
├── AdminDashboard.js         # Dashboard with form and list
└── components/
    ├── AddPuzzleForm.js      # Form to add new puzzles
    └── PuzzleListItem.js     # Individual puzzle display with delete
```

## Components

### AdminPage
- Main wrapper component
- Manages authentication state
- Routes between login and dashboard

### AdminLogin
- Responsive login form
- Email and password inputs
- Form validation
- Styled with decorative title

### AdminDashboard
- Two-column layout (responsive)
- Left: Add puzzle form (sticky on desktop)
- Right: Puzzle list with scroll
- Header with logout button
- Real-time puzzle count

### AddPuzzleForm
- Three input fields: Name, Answer, XP
- Form validation
- Success/error messages
- Auto-clear on successful submission

### PuzzleListItem
- Display puzzle details
- Delete button with confirmation
- Responsive card layout
- Visual XP indicator

## Responsive Design
- Mobile-first approach
- Single column on mobile
- Two-column layout on desktop (lg breakpoint)
- Sticky form on larger screens
- Optimized spacing and typography

## Future Enhancements
- Backend API integration
- Real authentication with JWT
- Puzzle image uploads
- Edit puzzle functionality
- Pagination for large puzzle lists
- Search and filter capabilities
- Role-based access control
