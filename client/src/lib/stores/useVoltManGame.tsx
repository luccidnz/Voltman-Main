import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Direction } from '../gameEngine/GameState';
import { Maze } from '../gameEngine/Maze';
import { Player } from '../gameEngine/Player';
import { Enemy } from '../gameEngine/Enemy';
import { AudioManager } from '../gameEngine/AudioManager';

export interface VoltManGameState {
  phase: 'menu' | 'playing' | 'gameOver';
  score: number;
  level: number;
  lives: number;
  isPaused: boolean;
  powerUpTimeLeft: number;
  maze: Maze | null;
  player: Player | null;
  enemies: Enemy[];
  treats: Array<{ x: number; y: number; isPowerUp: boolean }>;
  particleEffects: Array<{ x: number; y: number; type: string; life: number }>;
}

interface VoltManGameStore extends VoltManGameState {
  initializeGame: () => void;
  startGame: () => void;
  restartGame: () => void;
  updateGame: (deltaTime: number) => void;
  handleKeyPress: (key: string) => void;
  handleKeyRelease: (key: string) => void;
  togglePause: () => void;
}

const INITIAL_STATE: VoltManGameState = {
  phase: 'menu',
  score: 0,
  level: 1,
  lives: 3,
  isPaused: false,
  powerUpTimeLeft: 0,
  maze: null,
  player: null,
  enemies: [],
  treats: [],
  particleEffects: []
};

export const useVoltManGame = create<VoltManGameStore>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_STATE,

    initializeGame: () => {
      console.log('Initializing Volt-Man game...');
      AudioManager.initialize();
      set(INITIAL_STATE);
    },

    startGame: () => {
      console.log('Starting new game...');
      const maze = new Maze(19, 21); // Classic Pac-Man size
      const player = new Player(9, 15); // Start position
      
      // Create enemies
      const enemies = [
        new Enemy(9, 9, 'red'),
        new Enemy(8, 9, 'pink'),
        new Enemy(10, 9, 'cyan'),
        new Enemy(9, 10, 'orange')
      ];

      // Generate treats
      const treats = maze.generateTreats();

      set({
        phase: 'playing',
        score: 0,
        level: 1,
        lives: 3,
        isPaused: false,
        powerUpTimeLeft: 0,
        maze,
        player,
        enemies,
        treats,
        particleEffects: []
      });

      AudioManager.playBackgroundMusic();
    },

    restartGame: () => {
      get().startGame();
    },

    togglePause: () => {
      const state = get();
      if (state.phase === 'playing') {
        set({ isPaused: !state.isPaused });
        if (state.isPaused) {
          AudioManager.resumeBackgroundMusic();
        } else {
          AudioManager.pauseBackgroundMusic();
        }
      }
    },

    handleKeyPress: (key: string) => {
      const state = get();
      
      console.log('Key pressed:', key);

      if (key === 'Space') {
        get().togglePause();
        return;
      }

      if (state.phase !== 'playing' || state.isPaused || !state.player) {
        return;
      }

      // Handle movement
      let direction: string | null = null;
      switch (key) {
        case 'ArrowUp':
        case 'KeyW':
          direction = 'up';
          break;
        case 'ArrowDown':
        case 'KeyS':
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'KeyA':
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'KeyD':
          direction = 'right';
          break;
      }

      if (direction && state.maze) {
        state.player.setDirection(direction as Direction, state.maze);
      }
    },

    handleKeyRelease: (key: string) => {
      // Handle key release if needed for continuous movement
    },

    updateGame: (deltaTime: number) => {
      const state = get();
      
      if (state.phase !== 'playing' || state.isPaused) {
        return;
      }

      if (!state.player || !state.maze) {
        return;
      }

      let newState: Partial<VoltManGameState> = {};

      // Update power-up timer
      if (state.powerUpTimeLeft > 0) {
        const newPowerUpTime = Math.max(0, state.powerUpTimeLeft - deltaTime);
        newState.powerUpTimeLeft = newPowerUpTime;
        
        if (newPowerUpTime === 0 && state.powerUpTimeLeft > 0) {
          // Power-up ended
          state.enemies.forEach(enemy => enemy.setFrightened(false));
        }
      }

      // Update player
      state.player.update(deltaTime, state.maze);

      // Update enemies
      state.enemies.forEach(enemy => {
        if (state.maze && state.player) {
          enemy.update(deltaTime, state.maze, state.player);
        }
      });

      // Check treat collection
      const treatIndex = state.treats.findIndex(treat => 
        Math.floor(state.player!.x) === treat.x && Math.floor(state.player!.y) === treat.y
      );

      if (treatIndex !== -1) {
        const treat = state.treats[treatIndex];
        const newTreats = [...state.treats];
        newTreats.splice(treatIndex, 1);
        
        if (treat.isPowerUp) {
          // Power-up collected
          newState.score = state.score + 50;
          newState.powerUpTimeLeft = 10000; // 10 seconds
          newState.treats = newTreats;
          
          // Make enemies frightened
          state.enemies.forEach(enemy => enemy.setFrightened(true));
          AudioManager.playSuccess();
        } else {
          // Regular treat
          newState.score = state.score + 10;
          newState.treats = newTreats;
          AudioManager.playHit();
        }

        // Check level completion
        if (newTreats.length === 0) {
          // Level completed
          newState.level = state.level + 1;
          
          // Generate new level
          const maze = new Maze(19, 21);
          const player = new Player(9, 15);
          const enemies = [
            new Enemy(9, 9, 'red'),
            new Enemy(8, 9, 'pink'),
            new Enemy(10, 9, 'cyan'),
            new Enemy(9, 10, 'orange')
          ];
          
          newState.maze = maze;
          newState.player = player;
          newState.enemies = enemies;
          newState.treats = maze.generateTreats();
          newState.powerUpTimeLeft = 0;
        }
      }

      // Check enemy collisions
      const collidingEnemy = state.enemies.find(enemy => {
        const dx = Math.abs(state.player!.x - enemy.x);
        const dy = Math.abs(state.player!.y - enemy.y);
        return dx < 0.8 && dy < 0.8;
      });

      if (collidingEnemy) {
        if (state.powerUpTimeLeft > 0 && collidingEnemy.isFrightened) {
          // Eat enemy
          const points = state.score < 200 ? 200 : Math.min(1600, state.score * 2);
          newState.score = state.score + points;
          
          // Reset enemy to home
          collidingEnemy.resetToHome();
          AudioManager.playSuccess();
        } else if (!collidingEnemy.isFrightened) {
          // Player hit by enemy
          const newLives = state.lives - 1;
          newState.lives = newLives;
          
          if (newLives <= 0) {
            // Game over
            newState.phase = 'gameOver';
            AudioManager.stopBackgroundMusic();
          } else {
            // Reset positions
            state.player.reset(9, 15);
            state.enemies.forEach(enemy => enemy.resetToHome());
            newState.powerUpTimeLeft = 0;
          }
        }
      }

      // Update particle effects
      const newParticleEffects = state.particleEffects
        .map(particle => ({ ...particle, life: particle.life - deltaTime }))
        .filter(particle => particle.life > 0);
      
      if (newParticleEffects.length !== state.particleEffects.length) {
        newState.particleEffects = newParticleEffects;
      }

      set(newState);
    }
  }))
);
