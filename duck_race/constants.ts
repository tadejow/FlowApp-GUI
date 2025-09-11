

// --- Simulation Constants ---
export const SIM_HEIGHT = 1.1;
export const CANVAS_HEIGHT = 300;
export const CANVAS_WIDTH = 1200;
export const C_SCALE = CANVAS_HEIGHT / SIM_HEIGHT;
export const SIM_WIDTH = CANVAS_WIDTH / C_SCALE;

// --- Fluid Simulation Parameters ---
export const RESOLUTION = 30; // Lowered for better performance
export const DT = 1.0 / 60.0;
export const NUM_ITERS = 20;
export const OVER_RELAXATION = 1.9;
export const FLOW_VELOCITY = 0.5;

// --- Gameplay Constants ---
export const NUM_PLAYERS = 3;
export const DUCK_SIZE = 12;
export const FINISH_LINE_X = 0.95; // 95% of the canvas width
export const SPLASH_STRENGTH = 1.0; // Impulse strength from a splash
export const SPLASH_EFFECT_RADIUS = 0.5; // The range of a splash's effect in simulation units.
export const BOT_SPLASH_STRENGTH = 1.0; // Impulse strength for bot splash
export const SPLASH_COOLDOWN = 1.0; // seconds
export const STUN_DURATION = 1.5; // seconds
export const FLUID_FORCE_FACTOR = 0.1; // How strongly the fluid affects the duck
export const DAMPING_FACTOR = 0.80; // General velocity damping
export const SPLASH_RADIUS_RATE = 60; // pixels per second
export const SPLASH_OPACITY_RATE = 1.2; // opacity decrease per second

// --- Obstacle Constants ---
export const MAX_OBSTACLES = 20;
export const OBSTACLE_SPAWN_RATE = 500; // milliseconds
export const OBSTACLE_FLUID_FORCE_FACTOR = DT; // How strongly the fluid affects an obstacle