


export enum ObjectType {
    // Trash
    Bottle,
    Can,
    Bag,
    OilSpill,
    Barrel,
    Microplastic,
    // Organisms
    Fish,
    Spawn,
    Plant,
    Frog,
    // Neutral
    Leaf,
    Branch,
}

export enum ObjectCategory {
    Trash,
    Organism,
    Neutral,
}

export interface GameObject {
    id: number;
    type: ObjectType;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    vx: number;
    vy: number;
    health: number;
    maxHealth: number;
}

export enum GamePhase {
    Countdown,
    Learning,
    RampUp,
    Flood,
    NormalLoop,
}

export type PowerUp = 'net';

export interface GameResult {
    score: number;
    longestStreak: number;
    trashCollected: number;
    organismsHit: number;
    survivalTime: number;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    type: 'shard' | 'spark' | 'implode' | 'rust' | 'plastic_bit' | 'smoke' | 'bubble' | 'leaf_bit' | 'gel' | 'heal';
    rotation?: number;
    rotationSpeed?: number;
    gravityFactor?: number;
}

export interface ExpandingRingEffect {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    life: number;
    maxLife: number;
    color: string;
    lineWidth: number;
}

export interface MultiplierEffect {
  text: string;
  life: number;
  maxLife: number;
  x: number;
  y: number;
}

export interface DebugInfo {
  phase: string;
  speed: number;
  spawnRate: number;
  mix: string;
}

export interface FloodNotification {
  text: string;
  life: number;
  maxLife: number;
  type: 'start' | 'end';
}