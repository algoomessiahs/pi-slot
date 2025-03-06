
import React, { useEffect, useState } from "react";
import { useGame } from "./GameContext";
import { formatNumber } from "../utils/gameLogic";
import { SymbolType } from "../types/game";
import SlotReel from "./SlotReel";
import GameControls from "./GameControls";
import WinDisplay from "./WinDisplay";
import { Trophy } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import AboutModal from "./modals/AboutModal";
import SettingsModal from "./modals/SettingsModal";
import MainMenu from "./MainMenu";
import PayTable from "./PayTable";
import { playSoundIfEnabled, initAudio } from "../utils/soundUtils";
import { PAYLINE_COLORS } from "../data/symbols";

const SlotMachine: React.FC = () => {
  const { state, spin } = useGame();
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPayTable, setShowPayTable] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [highlightedPositions, setHighlightedPositions] = useState<{[key: number]: number[]}>({});
  const [activePayline, setActivePayline] = useState<number | null>(null);
  const [paylineIndex, setPaylineIndex] = useState(0);
  
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
  
  const initialGrid: SymbolType[][] = Array(3).fill(null).map(() => 
    Array(3).fill('pi-logo')
  );
  
  const displayGrid = state.lastResult?.grid || initialGrid;
  
  const getPaylineColor = () => {
    if (activePayline !== null && activePayline > 0 && activePayline <= PAYLINE_COLORS.length) {
      return PAYLINE_COLORS[activePayline - 1];
    }
    return '#FFFFFF';
  };

  // Handle spin button
  const handleSpin = () => {
    if (!state.isSpinning && state.balance >= state.totalBet) {
      playSoundIfEnabled('buttonClick');
      spin();
    }
  };
  
  return (
    <div className="slot-machine-container compact-ui">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-pi-pattern bg-repeat opacity-10"></div>
        <div className="absolute top-[15%] -left-[10%] w-[300px] h-[300px] bg-[#9b87f5] rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute top-[40%] -right-[10%] w-[350px] h-[350px] bg-[#7E69AB] rounded-full blur-[180px] opacity-20"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] bg-[#FFDB58] rounded-full blur-[200px] opacity-20"></div>
      </div>
      
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
        
        <div className="jackpot-panel mb-2 relative bg-gradient-to-r from-purple-900/80 to-purple-900/80 backdrop-blur-sm border-2 border-[#FDCC0D] rounded-xl shadow-[0_0_10px_rgba(253,204,13,0.6)] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/assets/images/pi-pattern.png')] opacity-5"></div>
          <div className="relative py-1.5">
            <div className="flex items-center justify-center space-x-2">
              <Trophy size={20} className="text-[#FDCC0D]" />
              <h2 className="text-lg md:text-xl font-bold text-white">JACKPOT</h2>
            </div>
            <div className="jackpot-counter text-center text-xl md:text-2xl py-0.5">π {formatNumber(state.jackpot)}</div>
          </div>
        </div>
        
        {activePayline !== null && (
          <div 
            className="payline-indicator flex items-center justify-center mb-1 py-1 font-medium animate-pulse"
            style={{ color: getPaylineColor() }}
          >
            Winning Line #{activePayline}
          </div>
        )}
        
        <div className="game-grid grid grid-cols-3 gap-2 mb-2 overflow-hidden rounded-xl bg-gradient-to-b from-transparent to-white/20 backdrop-blur-sm p-2 border border-white/30">
          {Array(3).fill(null).map((_, colIndex) => (
            <SlotReel 
              key={colIndex} 
              symbols={displayGrid.map(row => row[colIndex])} 
              isSpinning={state.isSpinning} 
              delay={colIndex * 200}
              highlightPositions={highlightedPositions[colIndex] || []}
            />
          ))}
        </div>
        
        {(state.lastWin > 0 || showWinAnimation) && <WinDisplay winAmount={state.lastWin} />}
        
        <div className="grid grid-cols-3 gap-2 text-center mb-2">
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <div className="text-xs font-semibold">BALANCE</div>
            <div className="flex items-center justify-center text-sm">
              <span className="pi-coin">π</span>
              <span className="font-bold">{formatNumber(state.balance)}</span>
            </div>
          </div>
          
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <div className="text-xs font-semibold">TOTAL BET</div>
            <div className="flex items-center justify-center text-sm">
              <span className="pi-coin">π</span>
              <span className="font-bold">{formatNumber(state.totalBet)}</span>
            </div>
          </div>
          
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <div className="text-xs font-semibold">WIN</div>
            <div className="flex items-center justify-center text-sm">
              <span className="pi-coin">π</span>
              <span className="font-bold">{formatNumber(state.lastWin)}</span>
            </div>
          </div>
        </div>
        
        <GameControls 
          onOpenPayTable={() => {
            playSoundIfEnabled('buttonClick');
            setShowPayTable(true);
          }} 
        />
        
        <button 
          className="candy-button w-full py-3 text-xl mt-2 z-10 relative"
          onClick={handleSpin}
          disabled={state.isSpinning || state.balance < state.totalBet}
        >
          {state.freeSpinsRemaining > 0 ? 'FREE SPIN' : 'SPIN'}
        </button>
        
        {state.freeSpinsRemaining > 0 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 rounded-full text-white font-bold shadow-lg animate-pulse text-sm">
            Free Spins: {state.freeSpinsRemaining}
          </div>
        )}
      </div>
      
      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <PayTable open={showPayTable} onOpenChange={setShowPayTable} />
    </div>
  );
};

export default SlotMachine;
