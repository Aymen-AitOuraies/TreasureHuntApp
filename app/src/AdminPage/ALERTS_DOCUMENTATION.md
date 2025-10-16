# Admin Alert System - Documentation

## Overview
Enhanced alert and notification system for the admin panel with beautiful animations and better UX.

## Components

### 1. Toast Notification
**File:** `src/AdminPage/components/Toast.js`

A top-right positioned notification that auto-dismisses.

**Features:**
- 4 types: `success`, `error`, `info`, `warning`
- Auto-dismiss after 3 seconds (configurable)
- Manual close button
- Slide-in animation
- Icon support with color-coded backgrounds

**Usage:**
```javascript
<Toast
  message="Puzzle added successfully!"
  type="success"
  onClose={() => setToast(null)}
  duration={3000}
/>
```

**Types:**
- `success` - Green background, check icon
- `error` - Red background, alert icon
- `info` - Blue background, info icon
- `warning` - Yellow background, warning icon

---

### 2. Confirm Modal
**File:** `src/AdminPage/components/ConfirmModal.js`

A centered modal dialog for dangerous actions (like delete).

**Features:**
- Backdrop overlay (semi-transparent black)
- Warning icon
- Cancel and Delete buttons
- Slide-in animation
- Prevents accidental deletions

**Usage:**
```javascript
<ConfirmModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Puzzle"
  message="Are you sure you want to delete this puzzle?"
/>
```

---

### 3. Inline Alerts
Used in forms for validation errors.

**Features:**
- Left border color indicator
- Icon with message
- Shake animation on error
- Slide-in animation
- Auto-clear capability

**Error Alert:**
```jsx
<div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-md animate-shake">
  <div className="flex items-center gap-2">
    <Icon icon="mdi:alert-circle" className="text-2xl flex-shrink-0" />
    <p className="font-cormorant text-base">{error}</p>
  </div>
</div>
```

---

## Animations

All animations are defined in `src/index.css`:

### Shake Animation
- Duration: 0.5s
- Used for: Error alerts
- Effect: Horizontal shake movement

### Slide In Animation
- Duration: 0.3s
- Used for: Toast, Modal, Success alerts
- Effect: Slide down with fade in

### Fade In Animation
- Duration: 0.2s
- Used for: Modal backdrop
- Effect: Smooth opacity transition

### Fade Out Animation
- Duration: 0.3s
- Used for: Dismissing elements
- Effect: Smooth opacity transition

---

## Implementation in Admin Components

### AdminLogin.js
- **Inline error alerts** for validation
- Red alert with shake animation
- Icon + message layout

### AddPuzzleForm.js
- **Inline error alerts** for form validation
- Removed internal success alert (uses parent Toast)
- Shake animation on errors

### PuzzleListItem.js
- **ConfirmModal** for delete confirmation
- Replaces browser's `window.confirm()`
- Better UX with styled modal

### AdminDashboard.js
- **Toast notifications** for user feedback
- Success toast when puzzle added
- Info toast when puzzle deleted
- Positioned at top-right
- Auto-dismiss after 3 seconds

---

## Color Scheme

| Type    | Background | Border | Icon         |
|---------|-----------|--------|--------------|
| Success | Green-100 | Green-500 | check-circle |
| Error   | Red-100   | Red-500   | alert-circle |
| Info    | Blue-100  | Blue-500  | information  |
| Warning | Yellow-100| Yellow-500| alert        |

---

## User Flow Examples

### Adding a Puzzle
1. User fills form
2. Clicks "Add Puzzle"
3. **If invalid:** Red shake alert shows inline
4. **If valid:** Form clears + Green toast appears (top-right)
5. Toast auto-dismisses after 3 seconds

### Deleting a Puzzle
1. User clicks "Delete" button
2. **Modal appears** with confirmation
3. User can "Cancel" or "Delete"
4. **If confirmed:** Modal closes + Blue info toast appears
5. Toast auto-dismisses after 3 seconds

### Login Error
1. User submits empty form
2. **Red shake alert** appears inline
3. Alert stays until form is resubmitted

---

## Customization

### Change Toast Duration
```javascript
showToast("Message", "success", 5000); // 5 seconds
```

### Change Toast Position
Modify Toast.js positioning classes:
```javascript
// Current: top-4 right-4
// Bottom right: bottom-4 right-4
// Top left: top-4 left-4
```

### Add New Alert Type
Add to Toast.js config object:
```javascript
const config = {
  custom: {
    bgColor: "bg-purple-500",
    icon: "mdi:custom-icon",
    iconColor: "text-white"
  }
};
```

---

## Best Practices

1. **Use Toast for:** 
   - Success confirmations
   - General information
   - Non-critical errors

2. **Use Inline Alerts for:**
   - Form validation errors
   - Field-specific issues

3. **Use Confirm Modal for:**
   - Destructive actions (delete, reset)
   - Actions that can't be undone
   - Critical confirmations

4. **Don't:**
   - Stack multiple toasts (replace instead)
   - Use alerts for normal UI flow
   - Show toasts for every minor action
