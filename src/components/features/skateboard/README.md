# Skateboard Game - Refactored Architecture

This directory contains a refactored 3D skateboard endless runner game built with React and Three.js.

## 📁 Directory Structure

```
skateboard/
├── SkateboardGame.js          # Main component (orchestrates everything)
├── SkateboardGame.css         # Styles
├── index.js                   # Export entry point
│
├── constants/
│   └── gameConstants.js       # All game constants (physics, scoring, etc.)
│
├── hooks/
│   ├── useThreeScene.js       # Three.js scene initialization
│   ├── useGameLoop.js         # Main game loop and physics
│   ├── useInputHandlers.js    # Keyboard input handling
│   ├── useMobileControls.js   # Touch/mobile input handling
│   ├── useMobileDetection.js  # Mobile device detection
│   └── useCustomCursor.js     # Custom cursor management
│
├── components/
│   ├── GameUI.js              # Score/Speed/Tricks display
│   ├── ComboDisplay.js        # Combo text animation
│   ├── GameOver.js            # Game over screen
│   ├── MobileControls.js      # Mobile control buttons
│   └── Instructions.js        # Control instructions
│
└── utils/
    ├── sceneFactory.js        # Three.js object creation functions
    ├── collisionDetection.js  # Collision detection logic
    └── speedLines.js          # Speed lines canvas animation
```

## 🏗️ Architecture Overview

### **Main Component (`SkateboardGame.js`)**
- Orchestrates all hooks and components
- Manages React state for UI updates
- Handles game lifecycle (restart, game over)

### **Hooks**

#### `useThreeScene`
- Initializes Three.js scene, camera, renderer
- Creates player, road segments, particles
- Returns gameRef and sceneState

#### `useGameLoop`
- Main animation loop using `requestAnimationFrame`
- Handles physics (movement, jumping, gravity)
- Updates game entities (obstacles, road, trees, particles)
- Calls callbacks for score updates and game over

#### `useInputHandlers`
- Keyboard input (Arrow keys, Space)
- Updates gameRef.keys state

#### `useMobileControls`
- Touch and mouse events for mobile buttons
- Handles left/right/jump button interactions

#### `useMobileDetection`
- Detects mobile devices
- Manages UI visibility (mobile controls, cursor)

#### `useCustomCursor`
- Custom cursor animation (desktop only)

### **Components**

All UI components are now React components using props instead of DOM manipulation:
- `GameUI` - Displays score, speed, tricks
- `ComboDisplay` - Shows combo text with animation
- `GameOver` - Game over screen with restart button
- `MobileControls` - Touch control buttons
- `Instructions` - Control instructions

### **Utils**

#### `sceneFactory.js`
Factory functions for creating Three.js objects:
- `createScene()` - Scene, camera, renderer setup
- `createPlayer()` - Player character with skateboard
- `createRoadSegment()` - Road with barriers, grass, obstacles
- `createObstacle()` - Obstacle creation (cone, crystal, barrier)
- `createTree()` - Tree creation
- `createParticle()` - Particle creation

#### `collisionDetection.js`
- `checkCollision()` - Box3-based collision detection

#### `speedLines.js`
- `initSpeedLines()` - Canvas-based speed lines animation

### **Constants**

All magic numbers and configuration values are centralized in `gameConstants.js`:
- Physics constants (gravity, movement speed, bounds)
- Speed settings (base, max, increase rate)
- Scoring (multipliers, combo timeout)
- Road generation (width, segment length, spawn chances)
- Colors, camera settings, particle settings

## 🔄 Key Improvements

### **Before Refactoring**
- ❌ Single 942-line file
- ❌ Direct DOM manipulation (`getElementById`, `textContent`)
- ❌ Magic numbers scattered throughout
- ❌ Tightly coupled code
- ❌ Difficult to test

### **After Refactoring**
- ✅ Modular structure (16 focused files)
- ✅ React state for UI updates
- ✅ Constants file for configuration
- ✅ Separated concerns (hooks, components, utils)
- ✅ Easier to test and maintain
- ✅ Reusable hooks and components

## 🎮 Usage

```jsx
import SkateboardGame from './components/features/skateboard';

// In your route
<Route path='/skateboarding' element={<SkateboardGame />} />
```

## 🔧 Customization

### Changing Game Constants
Edit `constants/gameConstants.js`:
```javascript
export const PHYSICS = {
    GRAVITY: 0.02,        // Adjust gravity
    JUMP_VELOCITY: 0.35,  // Adjust jump height
    // ...
};
```

### Adding New Obstacles
1. Add type to `OBSTACLE_TYPES` in `gameConstants.js`
2. Add creation logic in `utils/sceneFactory.js` → `createObstacle()`

### Modifying UI Components
Edit individual component files in `components/` directory.

## 📝 Notes

- Game state is stored in `gameRef.current` to avoid unnecessary re-renders
- UI state uses React `useState` for reactive updates
- All Three.js resources are properly disposed on unmount
- Mobile detection handles responsive UI automatically
