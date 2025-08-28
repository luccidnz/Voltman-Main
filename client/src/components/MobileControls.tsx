import { useEffect, useRef } from 'react';

interface MobileControlsProps {
  onDirectionPress: (key: string) => void;
  onDirectionRelease: (key: string) => void;
}

const MobileControls = ({ onDirectionPress, onDirectionRelease }: MobileControlsProps) => {
  const activeKeys = useRef(new Set<string>());

  const handleTouchStart = (direction: string) => {
    const keyCode = getKeyCodeForDirection(direction);
    if (!activeKeys.current.has(keyCode)) {
      activeKeys.current.add(keyCode);
      onDirectionPress(keyCode);
    }
  };

  const handleTouchEnd = (direction: string) => {
    const keyCode = getKeyCodeForDirection(direction);
    if (activeKeys.current.has(keyCode)) {
      activeKeys.current.delete(keyCode);
      onDirectionRelease(keyCode);
    }
  };

  const getKeyCodeForDirection = (direction: string): string => {
    switch (direction) {
      case 'up': return 'ArrowUp';
      case 'down': return 'ArrowDown';
      case 'left': return 'ArrowLeft';
      case 'right': return 'ArrowRight';
      default: return '';
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      activeKeys.current.forEach(key => onDirectionRelease(key));
      activeKeys.current.clear();
    };
  }, [onDirectionRelease]);

  const buttonStyle = {
    background: 'rgba(0, 255, 255, 0.3)',
    border: '2px solid rgba(0, 255, 255, 0.6)',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)',
    backdropFilter: 'blur(10px)'
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
      <div className="flex justify-between items-end h-32 pointer-events-auto">
        {/* D-Pad */}
        <div className="relative">
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-32 h-32">
            {/* Top row */}
            <div></div>
            <button
              onTouchStart={() => handleTouchStart('up')}
              onTouchEnd={() => handleTouchEnd('up')}
              onMouseDown={() => handleTouchStart('up')}
              onMouseUp={() => handleTouchEnd('up')}
              onMouseLeave={() => handleTouchEnd('up')}
              className="w-10 h-10 text-white font-bold text-xl flex items-center justify-center active:scale-95 transition-transform"
              style={buttonStyle}
            >
              ↑
            </button>
            <div></div>

            {/* Middle row */}
            <button
              onTouchStart={() => handleTouchStart('left')}
              onTouchEnd={() => handleTouchEnd('left')}
              onMouseDown={() => handleTouchStart('left')}
              onMouseUp={() => handleTouchEnd('left')}
              onMouseLeave={() => handleTouchEnd('left')}
              className="w-10 h-10 text-white font-bold text-xl flex items-center justify-center active:scale-95 transition-transform"
              style={buttonStyle}
            >
              ←
            </button>
            <div></div>
            <button
              onTouchStart={() => handleTouchStart('right')}
              onTouchEnd={() => handleTouchEnd('right')}
              onMouseDown={() => handleTouchStart('right')}
              onMouseUp={() => handleTouchEnd('right')}
              onMouseLeave={() => handleTouchEnd('right')}
              className="w-10 h-10 text-white font-bold text-xl flex items-center justify-center active:scale-95 transition-transform"
              style={buttonStyle}
            >
              →
            </button>

            {/* Bottom row */}
            <div></div>
            <button
              onTouchStart={() => handleTouchStart('down')}
              onTouchEnd={() => handleTouchEnd('down')}
              onMouseDown={() => handleTouchStart('down')}
              onMouseUp={() => handleTouchEnd('down')}
              onMouseLeave={() => handleTouchEnd('down')}
              className="w-10 h-10 text-white font-bold text-xl flex items-center justify-center active:scale-95 transition-transform"
              style={buttonStyle}
            >
              ↓
            </button>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;
