
export enum GameState {
  StartScreen,
  Playing,
  GameOver,
  LevelComplete,
}

export enum PlayerType {
    Human,
    Bot,
}

export enum ObstacleType {
    Log,
    Garbage,
}

export interface Duck {
    id: number;
    name: string;
    x: number;
    y: number;
    startX: number;
    startY: number;
    vx: number;
    vy: number;
    color: string;
    type: PlayerType;
    splashCooldown: number;
    stunned: number;
}

export interface Obstacle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    angle: number;
    type: ObstacleType;
}

export interface Splash {
    x: number;
    y: number;
    radius: number;
    opacity: number;
}