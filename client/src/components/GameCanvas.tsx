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

  // Render game state
  useEffect(() => {
    if (rendererRef.current && gameState.phase === 'playing') {
      rendererRef.current.render(gameState);
    }
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        imageRendering: 'pixelated',
      }}
    />
  );
};

export default GameCanvas;
