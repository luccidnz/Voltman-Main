import { Direction, DIRECTION_VECTORS, DEFAULT_CONFIG } from './GameState';
import { Maze } from './Maze';
import { Player } from './Player';

export class Enemy {
  public x: number;
  public y: number;
  public targetX: number;
  public targetY: number;
  public direction: Direction | null = null;
  public color: string;
  public isFrightened: boolean = false;
  private homeX: number;
  private homeY: number;
  private moveSpeed = DEFAULT_CONFIG.enemySpeed;
  private pathfindingCooldown: number = 0;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.homeX = x;
    this.homeY = y;
    this.color = color;
  }

  public setFrightened(frightened: boolean): void {
    this.isFrightened = frightened;
    if (frightened) {
      // Reverse direction when becoming frightened
      this.reverseDirection();
    }
  }

  private reverseDirection(): void {
    if (this.direction) {
      const opposites: Record<Direction, Direction> = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
      };
      this.direction = opposites[this.direction];
      
      // Set new target based on reversed direction
      const vector = DIRECTION_VECTORS[this.direction];
      this.targetX = Math.round(this.x) + vector.x;
      this.targetY = Math.round(this.y) + vector.y;
    }
  }

  public update(deltaTime: number, maze: Maze, player: Player): void {
    // Update pathfinding cooldown
    this.pathfindingCooldown -= deltaTime;

    // Move towards target with smooth interpolation
    if (this.direction) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 0.08) {
        // Snap to target when very close
        this.x = this.targetX;
        this.y = this.targetY;
        this.direction = null;
      } else {
        // Smooth movement
        const speed = this.isFrightened ? this.moveSpeed * 0.7 : this.moveSpeed;
        const moveDistance = speed * deltaTime;
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        this.x += normalizedDx * moveDistance;
        this.y += normalizedDy * moveDistance;
      }
    }

    // Choose new direction when not moving and cooldown expired
    if (!this.direction && this.pathfindingCooldown <= 0) {
      this.chooseDirection(maze, player);
      this.pathfindingCooldown = 200; // Reduced frequency for smoother movement
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

  private chooseDirection(maze: Maze, player: Player): void {
    const currentX = Math.round(this.x);
    const currentY = Math.round(this.y);
    const validMoves = maze.getValidMoves(currentX, currentY);

    if (validMoves.length === 0) return;

    let targetDirection: Direction;

    if (this.isFrightened) {
      // Run away from player (choose direction that increases distance)
      targetDirection = this.getDirectionAwayFromPlayer(validMoves, player);
    } else {
      // Chase player (choose direction that decreases distance)
      targetDirection = this.getDirectionTowardsPlayer(validMoves, player);
    }

    this.direction = targetDirection;
    const vector = DIRECTION_VECTORS[targetDirection];
    this.targetX = currentX + vector.x;
    this.targetY = currentY + vector.y;
  }

  private getDirectionTowardsPlayer(validMoves: string[], player: Player): Direction {
    const currentX = Math.round(this.x);
    const currentY = Math.round(this.y);

    let bestDirection = validMoves[0] as Direction;
    let bestDistance = Infinity;

    for (const move of validMoves) {
      const vector = DIRECTION_VECTORS[move as Direction];
      const newX = currentX + vector.x;
      const newY = currentY + vector.y;
      
      const distance = Math.sqrt(
        Math.pow(newX - player.x, 2) + Math.pow(newY - player.y, 2)
      );

      if (distance < bestDistance) {
        bestDistance = distance;
        bestDirection = move as Direction;
      }
    }

    return bestDirection;
  }

  private getDirectionAwayFromPlayer(validMoves: string[], player: Player): Direction {
    const currentX = Math.round(this.x);
    const currentY = Math.round(this.y);

    let bestDirection = validMoves[0] as Direction;
    let bestDistance = -1;

    for (const move of validMoves) {
      const vector = DIRECTION_VECTORS[move as Direction];
      const newX = currentX + vector.x;
      const newY = currentY + vector.y;
      
      const distance = Math.sqrt(
        Math.pow(newX - player.x, 2) + Math.pow(newY - player.y, 2)
      );

      if (distance > bestDistance) {
        bestDistance = distance;
        bestDirection = move as Direction;
      }
    }

    return bestDirection;
  }

  public resetToHome(): void {
    this.x = this.homeX;
    this.y = this.homeY;
    this.targetX = this.homeX;
    this.targetY = this.homeY;
    this.direction = null;
    this.isFrightened = false;
  }
}
