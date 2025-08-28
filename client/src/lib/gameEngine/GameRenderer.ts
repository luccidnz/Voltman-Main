import { VoltManGameState } from '../stores/useVoltManGame';
import { DEFAULT_CONFIG } from './GameState';

export class GameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileSize: number = DEFAULT_CONFIG.tileSize;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Calculate tile size and offsets to center the maze
    const mazePixelWidth = 19 * this.tileSize;
    const mazePixelHeight = 21 * this.tileSize;
    
    const scaleX = width / mazePixelWidth;
    const scaleY = height / mazePixelHeight;
    const scale = Math.min(scaleX, scaleY) * 0.9; // Leave some padding
    
    this.tileSize = DEFAULT_CONFIG.tileSize * scale;
    this.offsetX = (width - (19 * this.tileSize)) / 2;
    this.offsetY = (height - (21 * this.tileSize)) / 2;
  }

  public render(gameState: VoltManGameState): void {
    if (!gameState.maze || !gameState.player) return;

    // Clear canvas
    this.ctx.fillStyle = '#000011';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render maze
    this.renderMaze(gameState.maze);
    
    // Render treats
    this.renderTreats(gameState.treats);
    
    // Render player
    this.renderPlayer(gameState.player, gameState.powerUpTimeLeft > 0);
    
    // Render enemies
    this.renderEnemies(gameState.enemies);
    
    // Render particle effects
    this.renderParticleEffects(gameState.particleEffects);
  }

  private renderMaze(maze: any): void {
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#00ffff';
    this.ctx.shadowBlur = 10;

    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        if (maze.isWall(x, y)) {
          const pixelX = this.offsetX + x * this.tileSize;
          const pixelY = this.offsetY + y * this.tileSize;
          
          this.ctx.strokeRect(pixelX + 2, pixelY + 2, this.tileSize - 4, this.tileSize - 4);
        }
      }
    }
    
    this.ctx.shadowBlur = 0;
  }

  private renderTreats(treats: Array<{ x: number; y: number; isPowerUp: boolean }>): void {
    treats.forEach(treat => {
      const pixelX = this.offsetX + treat.x * this.tileSize + this.tileSize / 2;
      const pixelY = this.offsetY + treat.y * this.tileSize + this.tileSize / 2;

      if (treat.isPowerUp) {
        // Power-up treat (larger, glowing)
        this.ctx.fillStyle = '#ffff00';
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.arc(pixelX, pixelY, this.tileSize * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      } else {
        // Regular treat
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#ffffff';
        this.ctx.shadowBlur = 5;
        this.ctx.beginPath();
        this.ctx.arc(pixelX, pixelY, this.tileSize * 0.1, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    });
  }

  private renderPlayer(player: any, isPoweredUp: boolean): void {
    const pixelX = this.offsetX + player.x * this.tileSize + this.tileSize / 2;
    const pixelY = this.offsetY + player.y * this.tileSize + this.tileSize / 2;
    const radius = this.tileSize * 0.4;

    if (isPoweredUp) {
      // Power-up mode - electric aura
      this.ctx.shadowColor = '#00ffff';
      this.ctx.shadowBlur = 20;
      this.ctx.fillStyle = '#00ffff';
      this.ctx.beginPath();
      this.ctx.arc(pixelX, pixelY, radius * 1.3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Main body
    this.ctx.fillStyle = isPoweredUp ? '#ffffff' : '#4a90e2';
    this.ctx.shadowColor = isPoweredUp ? '#ffffff' : '#4a90e2';
    this.ctx.shadowBlur = isPoweredUp ? 15 : 10;
    this.ctx.beginPath();
    this.ctx.arc(pixelX, pixelY, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Eyes
    this.ctx.fillStyle = '#000000';
    this.ctx.shadowBlur = 0;
    this.ctx.beginPath();
    this.ctx.arc(pixelX - radius * 0.3, pixelY - radius * 0.2, radius * 0.15, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(pixelX + radius * 0.3, pixelY - radius * 0.2, radius * 0.15, 0, Math.PI * 2);
    this.ctx.fill();

    // Lightning bolt on forehead (if powered up)
    if (isPoweredUp) {
      this.ctx.fillStyle = '#ffff00';
      this.ctx.shadowColor = '#ffff00';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.moveTo(pixelX, pixelY - radius * 0.6);
      this.ctx.lineTo(pixelX - radius * 0.2, pixelY - radius * 0.2);
      this.ctx.lineTo(pixelX + radius * 0.1, pixelY - radius * 0.2);
      this.ctx.lineTo(pixelX, pixelY + radius * 0.2);
      this.ctx.lineTo(pixelX + radius * 0.2, pixelY - radius * 0.1);
      this.ctx.lineTo(pixelX - radius * 0.1, pixelY - radius * 0.1);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.ctx.shadowBlur = 0;
  }

  private renderEnemies(enemies: any[]): void {
    enemies.forEach(enemy => {
      const pixelX = this.offsetX + enemy.x * this.tileSize + this.tileSize / 2;
      const pixelY = this.offsetY + enemy.y * this.tileSize + this.tileSize / 2;
      const radius = this.tileSize * 0.4;

      // Enemy body color
      let bodyColor = enemy.color;
      if (enemy.isFrightened) {
        bodyColor = '#0000ff'; // Blue when frightened
      }

      this.ctx.fillStyle = bodyColor;
      this.ctx.shadowColor = bodyColor;
      this.ctx.shadowBlur = 10;

      // Body (rounded rectangle for rabbit shape)
      this.ctx.beginPath();
      this.ctx.roundRect(pixelX - radius, pixelY - radius, radius * 2, radius * 1.5, radius * 0.3);
      this.ctx.fill();

      // Ears
      this.ctx.beginPath();
      this.ctx.ellipse(pixelX - radius * 0.5, pixelY - radius * 1.2, radius * 0.2, radius * 0.4, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(pixelX + radius * 0.5, pixelY - radius * 1.2, radius * 0.2, radius * 0.4, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Eyes
      this.ctx.fillStyle = enemy.isFrightened ? '#ffffff' : '#ff0000';
      this.ctx.shadowBlur = 0;
      this.ctx.beginPath();
      this.ctx.arc(pixelX - radius * 0.3, pixelY - radius * 0.3, radius * 0.1, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(pixelX + radius * 0.3, pixelY - radius * 0.3, radius * 0.1, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.shadowBlur = 0;
    });
  }

  private renderParticleEffects(effects: Array<{ x: number; y: number; type: string; life: number }>): void {
    effects.forEach(effect => {
      const pixelX = this.offsetX + effect.x * this.tileSize;
      const pixelY = this.offsetY + effect.y * this.tileSize;
      const alpha = effect.life / 1000; // Assuming 1000ms max life

      this.ctx.save();
      this.ctx.globalAlpha = alpha;

      switch (effect.type) {
        case 'collect':
          this.ctx.fillStyle = '#ffff00';
          this.ctx.shadowColor = '#ffff00';
          this.ctx.shadowBlur = 10;
          this.ctx.beginPath();
          this.ctx.arc(pixelX, pixelY, this.tileSize * 0.2 * alpha, 0, Math.PI * 2);
          this.ctx.fill();
          break;
        
        case 'power':
          this.ctx.fillStyle = '#00ffff';
          this.ctx.shadowColor = '#00ffff';
          this.ctx.shadowBlur = 15;
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = pixelX + Math.cos(angle) * this.tileSize * 0.5 * alpha;
            const y = pixelY + Math.sin(angle) * this.tileSize * 0.5 * alpha;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.tileSize * 0.1, 0, Math.PI * 2);
            this.ctx.fill();
          }
          break;
      }

      this.ctx.restore();
    });
  }
}
