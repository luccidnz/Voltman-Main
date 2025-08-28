import { useEffect, useRef, useState } from 'react';
import { useVoltManGame } from '../lib/stores/useVoltManGame';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import MobileControls from './MobileControls';
import { useIsMobile } from '../hooks/use-is-mobile';

const VoltManGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const gameState = useVoltManGame();
  const { initializeGame, updateGame, handleKeyPress, handleKeyRelease } = useVoltManGame();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (gameContainerRef.current) {
        const container = gameContainerRef.current;
        const rect = container.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default browser behavior for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(event.code)) {
        event.preventDefault();
      }
      handleKeyPress(event.code);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      handleKeyRelease(event.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyPress, handleKeyRelease]);

  // Game loop
  useEffect(() => {
    let animationFrame: number;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= frameInterval) {
        updateGame(deltaTime);
        lastTime = currentTime - (deltaTime % frameInterval);
      }
      
      if (gameState.phase === 'playing' && !gameState.isPaused) {
        animationFrame = requestAnimationFrame(gameLoop);
      }
    };

    if (gameState.phase === 'playing' && !gameState.isPaused) {
      animationFrame = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [gameState.phase, gameState.isPaused, updateGame]);

  return (
    <div 
      ref={gameContainerRef}
      className="w-full h-full relative overflow-hidden"
      style={{ 
        background: 'radial-gradient(circle at center, #001122 0%, #000011 100%)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Game Canvas */}
      <GameCanvas 
        gameState={gameState}
        width={dimensions.width}
        height={dimensions.height}
      />

      {/* Game UI Overlay */}
      <GameUI gameState={gameState} />

      {/* Mobile Controls */}
      {isMobile && (
        <MobileControls 
          onDirectionPress={handleKeyPress}
          onDirectionRelease={handleKeyRelease}
        />
      )}

      {/* Game Title and Instructions */}
      {gameState.phase === 'menu' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold text-cyan-400 mb-4" style={{
              textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff',
              fontFamily: 'Inter, monospace'
            }}>
              VOLT-MAN
            </h1>
            <div className="text-xl text-cyan-200 space-y-2">
              <p>Guide Volt-Man through the electric maze!</p>
              <p>Collect all treats while avoiding mutant rabbits</p>
              <p>Power-ups let you eat enemies for bonus points</p>
            </div>
            <div className="text-lg text-gray-300 space-y-1">
              <p>Use Arrow Keys or WASD to move</p>
              <p>Spacebar to pause</p>
            </div>
            <button 
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl rounded-lg border-2 border-cyan-400 transition-colors"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
              }}
              onClick={() => useVoltManGame.getState().startGame()}
            >
              START GAME
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.phase === 'gameOver' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-white">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-red-400 mb-4" style={{
              textShadow: '0 0 20px #ff0000, 0 0 40px #ff0000',
            }}>
              GAME OVER
            </h1>
            <div className="text-2xl text-yellow-400">
              Final Score: {gameState.score.toLocaleString()}
            </div>
            <div className="text-lg text-gray-300">
              Level Reached: {gameState.level}
            </div>
            <button 
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl rounded-lg border-2 border-cyan-400 transition-colors"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
              }}
              onClick={() => useVoltManGame.getState().restartGame()}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoltManGame;
