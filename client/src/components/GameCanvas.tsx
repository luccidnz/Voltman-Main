import { useEffect, useRef } from 'react';
import { GameRenderer } from '../lib/gameEngine/GameRenderer';
import { VoltManGameState } from '../lib/stores/useVoltManGame';

interface GameCanvasProps {
  gameState: VoltManGameState;
  width: number;
  height: number;
}

const GameCanvas = ({ gameState, width, height }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GameRenderer | null>(null);

  // Initialize renderer
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new GameRenderer(canvasRef.current);
    }
  }, []);

  // Update canvas size
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      if (rendererRef.current) {
        rendererRef.current.resize(width, height);
      }
    }
  }, [width, height]);

  // Optimized rendering for mobile performance
  useEffect(() => {
    if (rendererRef.current && gameState.phase === 'playing') {
      // Use RAF for smooth 60fps rendering
      let animationId: number;
      let lastRenderTime = 0;
      const targetFPS = 60;
      const frameInterval = 1000 / targetFPS;
      
      const animate = (currentTime: number) => {
        if (currentTime - lastRenderTime >= frameInterval) {
          rendererRef.current?.render(gameState);
          lastRenderTime = currentTime;
        }
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
      
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }
  }, [gameState.phase]);
  
  // Separate effect for game state changes to minimize re-renders
  useEffect(() => {
    // Only trigger re-render for significant state changes
    if (rendererRef.current && gameState.phase === 'playing') {
      rendererRef.current.render(gameState);
    }
  }, [gameState.player?.x, gameState.player?.y, gameState.enemies, gameState.treats, gameState.powerUpTimeLeft]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        imageRendering: 'pixelated',
        touchAction: 'none', // Prevent scrolling and zooming
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    />
  );
};

export default GameCanvas;
