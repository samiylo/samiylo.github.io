// Game Physics Constants
export const PHYSICS = {
    GRAVITY: 0.02,
    JUMP_VELOCITY: 0.35,
    MOVEMENT_SPEED: 0.12,
    PLAYER_BOUNDS: {
        MIN_X: -3.5,
        MAX_X: 3.5
    },
    PLAYER_ROTATION: {
        MAX: 0.4,
        DAMPING: 0.88
    }
};

// Game Speed Constants
export const SPEED = {
    BASE: 0.3,
    MAX: 1.5,
    INCREASE_RATE: 0.00012
};

// Scoring Constants
export const SCORING = {
    BASE_MULTIPLIER: 0.6,
    TRICK_BONUS_MULTIPLIER: 50,
    COMBO_TIMEOUT: 2000
};

// Road Generation Constants
export const ROAD = {
    WIDTH: 8,
    SEGMENT_LENGTH: 8,
    INITIAL_SEGMENTS: 25,
    MAX_SEGMENTS: 100,
    OBSTACLE_SPAWN_CHANCE: 0.45,
    TREE_SPAWN_CHANCE: 0.35
};

// Obstacle Types
export const OBSTACLE_TYPES = ['cone', 'crystal', 'barrier'];

// Trick Names
export const TRICK_NAMES = [
    'KICKFLIP!',
    'HEELFLIP!',
    '360 FLIP!',
    'OLLIE!',
    'SHUVIT!'
];

// Particle System Constants
export const PARTICLES = {
    COUNT: 100,
    COLORS: [0x00F5FF, 0xFF006E],
    VELOCITY: {
        MIN: 0.2,
        MAX: 0.7
    },
    OSCILLATION_SPEED: 0.05
};

// Speed Lines Constants
export const SPEED_LINES = {
    COUNT: 50,
    SPEED: {
        MIN: 5,
        MAX: 15
    },
    LENGTH: {
        MIN: 20,
        MAX: 60
    },
    OPACITY: {
        MIN: 0.3,
        MAX: 0.8
    },
    COLOR: 'rgba(0, 245, 255, '
};

// Camera Settings
export const CAMERA = {
    FOV: 75,
    NEAR: 0.1,
    FAR: 1000,
    POSITION: { x: 0, y: 6, z: 10 },
    LOOK_AT: { x: 0, y: 2, z: -10 }
};

// Lighting Colors
export const COLORS = {
    NEON_PINK: 0xFF006E,
    NEON_CYAN: 0x00F5FF,
    NEON_YELLOW: 0xFFBE0B,
    NEON_PURPLE: 0x8338EC,
    DARK_BG: 0x0A0E27,
    ROAD_DARK: 0x1A1D2E,
    GRASS: 0x1A4D2E,
    TRUNK: 0x4A2C2A
};
