export interface Position {
  x: number;
  y: number;
}

export interface GameConfig {
  tileSize: number;
  moveSpeed: number;
  enemySpeed: number;
  powerUpDuration: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  tileSize: 20,
  moveSpeed: 0.1,
  enemySpeed: 0.08,
  powerUpDuration: 10000
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export const DIRECTION_VECTORS: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};
