
import React, { useEffect, useState, useCallback } from "react";
import { useGame } from "../context/gameContext";
import { playSoundIfEnabled, initAudio } from "../utils/soundUtils";
import { Dialog } from "@/components/ui/dialog";

// Import refactored components
import JackpotDisplay from "./JackpotDisplay";
import PaylineIndicator from "./PaylineIndicator";
import GameGrid from "./GameGrid";
import WinDisplay from "./WinDisplay";
import StatsDisplay from "./StatsDisplay";
import GameControls from "./GameControls";
import SpinButton from "./SpinButton";
import FreeSpinsIndicator from "./FreeSpinsIndicator";
import BackgroundEffects from "./BackgroundEffects";
import MainMenu from "./MainMenu";
import PayTable from "./PayTable";
import AboutModal from "./modals/AboutModal";
import SettingsModal from "./modals/SettingsModal";
import AdminPanel from "./AdminPanel";

const SlotMachine: React.FC = () => {
  const { state, spin, toggleAdminMode } = useGame();
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPayTable, setShowPayTable] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [highlightedPositions, setHighlightedPositions] = useState<{[key: number]: number[]}>({});
  const [activePayline, setActivePayline] = useState<number | null>(null);
  const [paylineIndex, setPaylineIndex] = useState(0);
  const [adminKeySequence, setAdminKeySequence] = useState<string[]>([]);
  
  // Secret key sequence to enable admin mode: 'a', 'd', 'm', 'i', 'n'
  const SECRET_SEQUENCE = ['a', 'd', 'm', 'i', 'n'];
  
  // Handle key presses for admin mode
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    
    setAdminKeySequence(prev => {
      const newSequence = [...prev, key].slice(-SECRET_SEQUENCE.length);
      
      // Check if the sequence matches
      if (newSequence.join('') === SECRET_SEQUENCE.join('')) {
        toggleAdminMode();
        return [];
      }
      
      return newSequence;
    });
  }, [toggleAdminMode]);
  
  useEffect(() => {
    // Add key listener for admin mode activation
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  useEffect(() => {
    const handleInteraction = () => {
      console.log("User interaction detected, initializing audio");
      initAudio();
      playSoundIfEnabled('buttonClick', 0.3);
      document.removeEventListener('click', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);
  
  useEffect(() => {
    if (state.lastWin > 0) {
      setShowWinAnimation(true);
      playSoundIfEnabled('win', 0.5);
      
      const timer = setTimeout(() => {
        setShowWinAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [state.lastWin]);
  
  useEffect(() => {
    if (!state.isSpinning && state.lastResult?.winLines.length) {
      const winLines = state.lastResult.winLines;
      
      const interval = setInterval(() => {
        if (winLines.length > 0) {
          const idx = paylineIndex % winLines.length;
          const line = winLines[idx];
          
          const positions: {[key: number]: number[]} = {};
          
          line.positions.forEach((pos, idx) => {
            const col = Math.floor(idx % 3);
            const row = Math.floor(pos % 3);
            
            if (!positions[col]) {
              positions[col] = [];
            }
            
            positions[col].push(row);
          });
          
          setHighlightedPositions(positions);
          setActivePayline(line.line);
          setPaylineIndex(prev => prev + 1);
        }
      }, 2000);
      
      return () => {
        clearInterval(interval);
      };
    } else {
      setHighlightedPositions({});
      setActivePayline(null);
    }
  }, [state.isSpinning, state.lastResult, paylineIndex]);
  
  const initialGrid = Array(3).fill(null).map(() => Array(3).fill('pi-logo'));
  const displayGrid = state.lastResult?.grid || initialGrid;

  // Handle spin button
  const handleSpin = () => {
    if (!state.isSpinning && (state.balance >= state.totalBet || state.freeSpinsRemaining > 0)) {
      spin();
    }
  };
  
  return (
    <div className="slot-machine-container compact-ui">
      <BackgroundEffects />
      <AdminPanel />
      
      <div className="candy-panel compact-panel relative">
        <MainMenu 
          onOpenSettings={() => {
            playSoundIfEnabled('buttonClick');
            setShowSettings(true);
          }}
          onOpenPayTable={() => {
            playSoundIfEnabled('buttonClick');
            setShowPayTable(true);
          }}
          onOpenAbout={() => {
            playSoundIfEnabled('buttonClick');
            setShowAbout(true);
          }}
        />
        
        <JackpotDisplay 
          jackpot={state.jackpot} 
          isActive={state.isJackpotActive} 
        />
        
        <PaylineIndicator activePayline={activePayline} />
        
        <GameGrid 
          displayGrid={displayGrid} 
          isSpinning={state.isSpinning} 
          highlightedPositions={highlightedPositions} 
        />
        
        {(state.lastWin > 0 || showWinAnimation) && <WinDisplay winAmount={state.lastWin} />}
        
        <StatsDisplay 
          balance={state.balance} 
          totalBet={state.totalBet} 
          lastWin={state.lastWin} 
        />
        
        <GameControls 
          onOpenPayTable={() => {
            playSoundIfEnabled('buttonClick');
            setShowPayTable(true);
          }} 
        />
        
        <SpinButton 
          onSpin={handleSpin} 
          disabled={state.isSpinning || (state.balance < state.totalBet && state.freeSpinsRemaining <= 0)} 
          freeSpinsRemaining={state.freeSpinsRemaining} 
        />
        
        <FreeSpinsIndicator freeSpinsRemaining={state.freeSpinsRemaining} />
      </div>
      
      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <PayTable open={showPayTable} onOpenChange={setShowPayTable} />
    </div>
  );
};

export default SlotMachine;
