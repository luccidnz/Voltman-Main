import { useState, useEffect } from "react";
import VoltManGame from "./components/VoltManGame";
import "@fontsource/inter";

function App() {
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    setShowGame(true);
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      {showGame && <VoltManGame />}
    </div>
  );
}

export default App;
