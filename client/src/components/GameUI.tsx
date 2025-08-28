import { VoltManGameState } from '../lib/stores/useVoltManGame';
import { useVoltManGame } from '../lib/stores/useVoltManGame';

interface GameUIProps {
  gameState: VoltManGameState;
}

const GameUI = ({ gameState }: GameUIProps) => {
  const { togglePause } = useVoltManGame();

  if (gameState.phase !== 'playing') {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      {/* Top HUD */}
      <div className="flex justify-between items-center bg-black bg-opacity-60 rounded-lg p-4 text-white border border-cyan-400" style={{
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Score */}
        <div className="text-left">
          <div className="text-sm text-cyan-300 uppercase tracking-wider">Score</div>
          <div className="text-2xl font-bold text-yellow-400" style={{
            textShadow: '0 0 10px #ffff00'
          }}>
            {gameState.score.toLocaleString()}
          </div>
        </div>

        {/* Level */}
        <div className="text-center">
          <div className="text-sm text-cyan-300 uppercase tracking-wider">Level</div>
          <div className="text-2xl font-bold text-cyan-400" style={{
            textShadow: '0 0 10px #00ffff'
          }}>
            {gameState.level}
          </div>
        </div>

        {/* Lives */}
        <div className="text-right">
          <div className="text-sm text-cyan-300 uppercase tracking-wider">Lives</div>
          <div className="flex space-x-1 justify-end">
            {Array.from({ length: gameState.lives }, (_, i) => (
              <div 
                key={i}
                className="w-6 h-6 bg-red-500 rounded border border-red-300"
                style={{
                  boxShadow: '0 0 10px #ff0000'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Power-up indicator */}
      {gameState.powerUpTimeLeft > 0 && (
        <div className="mt-4 text-center">
          <div className="bg-yellow-500 bg-opacity-90 text-black px-4 py-2 rounded-lg font-bold text-lg" style={{
            boxShadow: '0 0 20px #ffff00',
            animation: 'pulse 0.5s infinite alternate'
          }}>
            POWER MODE: {Math.ceil(gameState.powerUpTimeLeft / 1000)}s
          </div>
        </div>
      )}

      {/* Pause indicator */}
      {gameState.isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-cyan-400 mb-4" style={{
              textShadow: '0 0 20px #00ffff'
            }}>
              PAUSED
            </h2>
            <p className="text-xl text-white">Press SPACEBAR to continue</p>
          </div>
        </div>
      )}

      {/* Pause button for mobile */}
      <button
        onClick={togglePause}
        className="absolute top-4 right-4 bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded border border-cyan-400 md:hidden"
        style={{
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
        }}
      >
        {gameState.isPaused ? '▶️' : '⏸️'}
      </button>
    </div>
  );
};

export default GameUI;
