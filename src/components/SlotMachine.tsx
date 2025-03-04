
import React, { useEffect, useState } from "react";
import { useGame } from "./GameContext";
import { formatNumber } from "../utils/gameLogic";
import { SymbolType } from "../types/game";
import SlotReel from "./SlotReel";
import GameControls from "./GameControls";
import WinDisplay from "./WinDisplay";
import { toast } from "sonner";
import { Coins, FolderCog, RefreshCcw, Trophy } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import AboutModal from "./modals/AboutModal";
import SettingsModal from "./modals/SettingsModal";
import MainMenu from "./MainMenu";
import PayTable from "./PayTable";
import { playSoundIfEnabled, initAudio } from "../utils/soundUtils";
import { PAYLINE_COLORS } from "../data/symbols";

const SlotMachine: React.FC = () => {
  const { state } = useGame();
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPayTable, setShowPayTable] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [highlightedPositions, setHighlightedPositions] = useState<{[key: number]: number[]}>({});
  const [activePayline, setActivePayline] = useState<number | null>(null);
  const [paylineIndex, setPaylineIndex] = useState(0);
  
  // Initialize audio system on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);
  
  // Create an effect that triggers win animation when a win occurs
  useEffect(() => {
    if (state.lastWin > 0) {
      setShowWinAnimation(true);
      
      // Clear win animation after 3 seconds
      const timer = setTimeout(() => {
        setShowWinAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [state.lastWin]);
  
  // Handle payline visualization
  useEffect(() => {
    // Only show paylines when not spinning and there are win lines
    if (!state.isSpinning && state.lastResult?.winLines.length) {
      const winLines = state.lastResult.winLines;
      
      // Start cycling through win lines
      const interval = setInterval(() => {
        if (winLines.length > 0) {
          const idx = paylineIndex % winLines.length;
          const line = winLines[idx];
          
          // Create highlighted positions for each reel
          const positions: {[key: number]: number[]} = {};
          
          line.positions.forEach((pos, idx) => {
            const col = Math.floor(idx % 5);
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
      // Clear all highlights when spinning
      setHighlightedPositions({});
      setActivePayline(null);
    }
  }, [state.isSpinning, state.lastResult, paylineIndex]);
  
  // Create initial grid with empty slots
  const initialGrid: SymbolType[][] = Array(3).fill(null).map(() => 
    Array(5).fill('donut-white')
  );
  
  // Use the last result if available, otherwise use initial grid
  const displayGrid = state.lastResult?.grid || initialGrid;
  
  // Get payline color based on active payline
  const getPaylineColor = () => {
    if (activePayline !== null && activePayline > 0 && activePayline <= PAYLINE_COLORS.length) {
      return PAYLINE_COLORS[activePayline - 1];
    }
    return '#FFFFFF';
  };
  
  return (
    <div className="slot-machine-container flex flex-col items-center justify-center min-h-screen py-6 px-4 relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-pi-pattern bg-repeat opacity-10"></div>
        <div className="absolute top-[15%] -left-[10%] w-[300px] h-[300px] bg-[#9b87f5] rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute top-[40%] -right-[10%] w-[350px] h-[350px] bg-[#7E69AB] rounded-full blur-[180px] opacity-20"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] bg-[#FFDB58] rounded-full blur-[200px] opacity-20"></div>
      </div>
      
      {/* Main container */}
      <div className="candy-panel w-full max-w-4xl relative">
        {/* Menu Button */}
        <MainMenu 
          onOpenSettings={() => setShowSettings(true)}
          onOpenPayTable={() => setShowPayTable(true)}
          onOpenAbout={() => setShowAbout(true)}
        />
        
        {/* Jackpot display */}
        <div className="jackpot-panel mb-4 relative">
          <div className="flex items-center justify-center space-x-3">
            <Trophy size={24} className="text-[#FDCC0D]" />
            <h2 className="text-2xl font-bold">JACKPOT</h2>
          </div>
          <div className="jackpot-counter text-center">π {formatNumber(state.jackpot)}</div>
        </div>
        
        {/* Active payline indicator */}
        {activePayline !== null && (
          <div 
            className="payline-indicator flex items-center justify-center mb-2 py-1 font-medium animate-pulse"
            style={{ color: getPaylineColor() }}
          >
            Winning Line #{activePayline}
          </div>
        )}
        
        {/* Game grid */}
        <div className="game-grid grid grid-cols-5 gap-2 mb-4 overflow-hidden">
          {Array(5).fill(null).map((_, colIndex) => (
            <SlotReel 
              key={colIndex} 
              symbols={displayGrid.map(row => row[colIndex])} 
              isSpinning={state.isSpinning} 
              delay={colIndex * 200} // Stagger the spin stops
              highlightPositions={highlightedPositions[colIndex] || []}
            />
          ))}
        </div>
        
        {/* Win display */}
        {(state.lastWin > 0 || showWinAnimation) && <WinDisplay winAmount={state.lastWin} />}
        
        {/* Game controls */}
        <GameControls onOpenPayTable={() => setShowPayTable(true)} />
        
        {/* Bottom info bar */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-center">
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <div className="text-sm font-semibold mb-1">BALANCE</div>
            <div className="flex items-center justify-center">
              <span className="pi-coin">π</span>
              <span className="font-bold">{formatNumber(state.balance)}</span>
            </div>
          </div>
          
          <div className="hidden md:block bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <div className="text-sm font-semibold mb-1">TOTAL BET</div>
            <div className="flex items-center justify-center">
              <span className="pi-coin">π</span>
              <span className="font-bold">{formatNumber(state.totalBet)}</span>
            </div>
          </div>
          
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <div className="text-sm font-semibold mb-1">WIN</div>
            <div className="flex items-center justify-center">
              <span className="pi-coin">π</span>
              <span className="font-bold">{formatNumber(state.lastWin)}</span>
            </div>
          </div>
        </div>
        
        {/* Free spins display */}
        {state.freeSpinsRemaining > 0 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 rounded-full text-white font-bold shadow-lg animate-pulse">
            <RefreshCcw className="inline-block mr-1" size={16} />
            Free Spins: {state.freeSpinsRemaining}
          </div>
        )}
      </div>
      
      {/* Modals */}
      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <PayTable open={showPayTable} onOpenChange={setShowPayTable} />
    </div>
  );
};

export default SlotMachine;
