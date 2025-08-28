import { Direction, DIRECTION_VECTORS, DEFAULT_CONFIG } from './GameState';
import { Maze } from './Maze';

export class Player {
  public x: number;
  public y: number;
  public targetX: number;
  public targetY: number;
  public direction: Direction | null = null;
  public nextDirection: Direction | null = null;
  private moveSpeed = DEFAULT_CONFIG.moveSpeed;
  private startX: number;
  private startY: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.startX = x;
    this.startY = y;
  }

  public setDirection(direction: Direction, maze: Maze): void {
    // Try to move in the new direction immediately if possible
    const vector = DIRECTION_VECTORS[direction];
    const newX = Math.round(this.x) + vector.x;
    const newY = Math.round(this.y) + vector.y;

    if (maze.isPath(newX, newY)) {
      this.direction = direction;
      this.targetX = newX;
      this.targetY = newY;
    } else {
      // Store as next direction to try later
      this.nextDirection = direction;
    }
  }

  public update(deltaTime: number, maze: Maze): void {
    // Move towards target
    if (this.direction) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 0.1) {
        // Reached target
        this.x = this.targetX;
        this.y = this.targetY;

        // Try to continue in current direction
        if (this.direction) {
          const vector = DIRECTION_VECTORS[this.direction];
          const newX = this.x + vector.x;
          const newY = this.y + vector.y;

          if (maze.isPath(newX, newY)) {
            this.targetX = newX;
            this.targetY = newY;
          } else {
            this.direction = null;
          }
        }

        // Try pending direction change
        if (this.nextDirection && (!this.direction || this.nextDirection !== this.direction)) {
          const vector = DIRECTION_VECTORS[this.nextDirection];
          const newX = this.x + vector.x;
          const newY = this.y + vector.y;

          if (maze.isPath(newX, newY)) {
            this.direction = this.nextDirection;
            this.targetX = newX;
            this.targetY = newY;
            this.nextDirection = null;
          }
        }
      } else {
        // Move towards target
        const moveDistance = this.moveSpeed * deltaTime;
        this.x += (dx / distance) * moveDistance;
        this.y += (dy / distance) * moveDistance;
      }
    }

    // Handle tunnel wrapping
    if (this.x < 0) {
      this.x = maze.width - 1;
      this.targetX = maze.width - 1;
    } else if (this.x >= maze.width) {
      this.x = 0;
      this.targetX = 0;
    }
  }

  public reset(x?: number, y?: number): void {
    this.x = x ?? this.startX;
    this.y = y ?? this.startY;
    this.targetX = this.x;
    this.targetY = this.y;
    this.direction = null;
    this.nextDirection = null;
  }
}
