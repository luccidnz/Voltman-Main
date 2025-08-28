export class Maze {
  public width: number;
  public height: number;
  public walls: boolean[][];
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.walls = this.generateClassicMaze();
  }

  private generateClassicMaze(): boolean[][] {
    // Create a classic Pac-Man style maze
    const maze: boolean[][] = [];
    
    // Initialize with all walls
    for (let y = 0; y < this.height; y++) {
      maze[y] = [];
      for (let x = 0; x < this.width; x++) {
        maze[y][x] = true; // true = wall, false = path
      }
    }

    // Create the classic Pac-Man layout pattern
    // Outer walls are kept, create paths inside
    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        // Create corridors and rooms
        if (
          // Horizontal corridors
          (y === 3 || y === 9 || y === 15 || y === this.height - 4) ||
          // Vertical corridors
          (x === 3 || x === 9 || x === this.width - 4) ||
          // Center area paths
          (y >= 7 && y <= 11 && x >= 7 && x <= 11) ||
          // Corner paths
          (y <= 5 && x <= 5) ||
          (y <= 5 && x >= this.width - 6) ||
          (y >= this.height - 6 && x <= 5) ||
          (y >= this.height - 6 && x >= this.width - 6)
        ) {
          maze[y][x] = false; // Create path
        }
      }
    }

    // Create specific openings and connections
    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        // Add connecting paths
        if (
          (y === 6 && (x >= 5 && x <= 13)) ||
          (y === 12 && (x >= 5 && x <= 13)) ||
          (x === 6 && (y >= 4 && y <= 14)) ||
          (x === 12 && (y >= 4 && y <= 14))
        ) {
          maze[y][x] = false;
        }
      }
    }

    // Ensure spawn areas are clear
    // Player spawn area
    maze[15][9] = false;
    maze[14][9] = false;
    maze[16][9] = false;
    
    // Ghost spawn area
    for (let y = 8; y < 12; y++) {
      for (let x = 8; x < 11; x++) {
        maze[y][x] = false;
      }
    }

    // Create tunnel on sides (optional)
    maze[9][0] = false;
    maze[9][this.width - 1] = false;

    return maze;
  }

  public isWall(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return true;
    }
    return this.walls[y][x];
  }

  public isPath(x: number, y: number): boolean {
    return !this.isWall(x, y);
  }

  public generateTreats(): Array<{ x: number; y: number; isPowerUp: boolean }> {
    const treats: Array<{ x: number; y: number; isPowerUp: boolean }> = [];
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.isWall(x, y)) {
          // Skip ghost spawn area
          if (x >= 8 && x <= 10 && y >= 8 && y <= 11) {
            continue;
          }
          
          // Skip player spawn area
          if (x === 9 && (y >= 14 && y <= 16)) {
            continue;
          }

          // Power-ups in corners
          const isPowerUp = (
            (x === 1 && y === 3) ||
            (x === this.width - 2 && y === 3) ||
            (x === 1 && y === this.height - 4) ||
            (x === this.width - 2 && y === this.height - 4)
          );

          treats.push({ x, y, isPowerUp });
        }
      }
    }
    
    return treats;
  }

  public getValidMoves(x: number, y: number): string[] {
    const moves: string[] = [];
    
    if (this.isPath(x, y - 1)) moves.push('up');
    if (this.isPath(x, y + 1)) moves.push('down');
    if (this.isPath(x - 1, y)) moves.push('left');
    if (this.isPath(x + 1, y)) moves.push('right');
    
    return moves;
  }
}
