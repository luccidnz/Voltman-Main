import { Direction, DIRECTION_VECTORS, DEFAULT_CONFIG } from './GameState';
import { Maze } from './Maze';

export class Player {
  public x: number;
  public y: number;
  public targetX: number;
  public targetY: number;
  public direction: Direction | null = null;
  public nextDirection: Direction | null = null;
  private moveSpeed = 0.08; // Balanced speed for better control
  private startX: number;
  private startY: number;
  private isMoving: boolean = false;
  private animationFrame: number = 0;

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
      this.isMoving = true;
      this.nextDirection = null; // Clear any pending direction
    } else {
      // Store as next direction to try later
      this.nextDirection = direction;
    }
  }

  public update(deltaTime: number, maze: Maze): void {
    this.animationFrame += deltaTime * 0.01;
    
    // Handle pending direction change first
    if (this.nextDirection && this.canChangeDirection(maze)) {
      const vector = DIRECTION_VECTORS[this.nextDirection];
      const newX = Math.round(this.x) + vector.x;
      const newY = Math.round(this.y) + vector.y;

      if (maze.isPath(newX, newY)) {
        this.direction = this.nextDirection;
        this.targetX = newX;
        this.targetY = newY;
        this.nextDirection = null;
        this.isMoving = true;
      }
    }

    // Move towards target with smooth interpolation
    if (this.direction && this.isMoving) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 0.08) {
        // Snap to target when very close
        this.x = this.targetX;
        this.y = this.targetY;
        this.isMoving = false;

        // Try to continue in current direction
        const vector = DIRECTION_VECTORS[this.direction];
        const newX = this.x + vector.x;
        const newY = this.y + vector.y;

        if (maze.isPath(newX, newY)) {
          this.targetX = newX;
          this.targetY = newY;
          this.isMoving = true;
        } else {
          this.direction = null;
        }
      } else {
        // Smooth movement with easing
        const moveDistance = this.moveSpeed * deltaTime;
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        this.x += normalizedDx * moveDistance;
        this.y += normalizedDy * moveDistance;
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

  private canChangeDirection(maze: Maze): boolean {
    // Allow direction change when close to grid position
    const gridX = Math.round(this.x);
    const gridY = Math.round(this.y);
    const distanceToGrid = Math.sqrt(
      Math.pow(this.x - gridX, 2) + Math.pow(this.y - gridY, 2)
    );
    return distanceToGrid < 0.15; // Reduced threshold for more responsive direction changes
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
