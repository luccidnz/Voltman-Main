import { VoltManGameState } from '../stores/useVoltManGame';
import { DEFAULT_CONFIG } from './GameState';

export class GameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileSize: number = DEFAULT_CONFIG.tileSize;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private images: Record<string, HTMLImageElement> = {};
  private imagesLoaded: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
    this.loadImages();
  }

  private async loadImages() {
    const imageUrls = {
      'voltman-normal': '/images/voltman-normal.png',
      'voltman-powerup': '/images/voltman-powerup.png',
      'mutant-rabbits': '/images/mutant-rabbits.png',
      'power-ups': '/images/power-ups.png',
      'bonus-items': '/images/bonus-items.png',
      'hazards': '/images/hazards.png'
    };

    const loadPromises = Object.entries(imageUrls).map(([key, url]) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.images[key] = img;
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${url}`);
          resolve(); // Continue even if image fails to load
        };
        img.src = url;
      });
    });

    await Promise.all(loadPromises);
    this.imagesLoaded = true;
    console.log('Game images loaded');
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

    // Only render if we're not already rendering to prevent flickering
    this.ctx.save();
    
    // Clear canvas with dark background
    this.ctx.fillStyle = '#000011';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render maze
    this.renderMaze(gameState.maze);
    
    // Render treats
    this.renderTreats(gameState.treats);
    
    // Render player with pixel art
    this.renderPlayer(gameState.player, gameState.powerUpTimeLeft > 0);
    
    // Render enemies with pixel art
    this.renderEnemies(gameState.enemies);
    
    // Render particle effects
    this.renderParticleEffects(gameState.particleEffects);
    
    this.ctx.restore();
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
    const pixelX = this.offsetX + player.x * this.tileSize;
    const pixelY = this.offsetY + player.y * this.tileSize;
    const size = this.tileSize;

    // Use pixel art images if loaded, otherwise fall back to simple shapes
    if (this.imagesLoaded) {
      const imageKey = isPoweredUp ? 'voltman-powerup' : 'voltman-normal';
      const image = this.images[imageKey];
      
      if (image) {
        // Disable smoothing for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        
        // Draw the pixel art image scaled to tile size
        this.ctx.drawImage(image, pixelX, pixelY, size, size);
        return;
      }
    }

    // Fallback: simple colored circle
    const centerX = pixelX + size / 2;
    const centerY = pixelY + size / 2;
    const radius = size * 0.4;

    this.ctx.fillStyle = isPoweredUp ? '#00ffff' : '#4a90e2';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderEnemies(enemies: any[]): void {
    enemies.forEach((enemy, index) => {
      const pixelX = this.offsetX + enemy.x * this.tileSize;
      const pixelY = this.offsetY + enemy.y * this.tileSize;
      const size = this.tileSize;

      // Use pixel art from the mutant rabbits image if available
      if (this.imagesLoaded && this.images['mutant-rabbits']) {
        this.ctx.imageSmoothingEnabled = false;
        
        // The mutant rabbits image has 4 rabbits in a 2x2 grid
        // Calculate which rabbit to use based on enemy index and state
        let rabbitIndex = index % 4; // Use different rabbit for each enemy
        if (enemy.isFrightened) {
          rabbitIndex = 0; // Use first rabbit (top-left) for frightened state
        }
        
        const sourceSize = this.images['mutant-rabbits'].width / 2; // 2x2 grid
        const sourceX = (rabbitIndex % 2) * sourceSize;
        const sourceY = Math.floor(rabbitIndex / 2) * sourceSize;
        
        // Apply blue tint if frightened
        if (enemy.isFrightened) {
          this.ctx.save();
          this.ctx.globalCompositeOperation = 'multiply';
          this.ctx.fillStyle = '#4444ff';
          this.ctx.fillRect(pixelX, pixelY, size, size);
          this.ctx.globalCompositeOperation = 'source-over';
          this.ctx.restore();
        }
        
        this.ctx.drawImage(
          this.images['mutant-rabbits'],
          sourceX, sourceY, sourceSize, sourceSize,
          pixelX, pixelY, size, size
        );
        return;
      }

      // Fallback: simple colored rectangles
      const centerX = pixelX + size / 2;
      const centerY = pixelY + size / 2;
      const radius = size * 0.4;

      let bodyColor = enemy.color;
      if (enemy.isFrightened) {
        bodyColor = '#0000ff';
      }

      this.ctx.fillStyle = bodyColor;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.fill();
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
