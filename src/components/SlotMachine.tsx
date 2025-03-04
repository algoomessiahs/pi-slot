
import React, { useEffect, useState } from "react";
import { useGame } from "./GameContext";
import { formatNumber } from "../utils/gameLogic";
import { SymbolType } from "../types/game";
import SlotReel from "./SlotReel";
import GameControls from "./GameControls";
import WinDisplay from "./WinDisplay";
import { toast } from "sonner";
import { Coins, FolderCog, Menu, RefreshCcw, Trophy, Volume2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import AboutModal from "./modals/AboutModal";
import SettingsModal from "./modals/SettingsModal";

const SlotMachine: React.FC = () => {
  const { state } = useGame();
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  
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
  
  // Create initial grid with empty slots
  const initialGrid: SymbolType[][] = Array(3).fill(null).map(() => 
    Array(5).fill('donut-white')
  );
  
  // Use the last result if available, otherwise use initial grid
  const displayGrid = state.lastResult?.grid || initialGrid;
  
  return (
    <div className="slot-machine-container flex flex-col items-center justify-center min-h-screen py-10 px-4 relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-candy-pattern bg-repeat opacity-10"></div>
        <div className="absolute top-[15%] -left-[10%] w-[300px] h-[300px] bg-donut-pink rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute top-[40%] -right-[10%] w-[350px] h-[350px] bg-donut-purple rounded-full blur-[180px] opacity-20"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] bg-donut-yellow rounded-full blur-[200px] opacity-20"></div>
      </div>
      
      {/* Main container */}
      <div className="candy-panel w-full max-w-4xl">
        {/* Menu button */}
        <button 
          className="absolute top-4 left-4 w-10 h-10 bg-candy-button-primary rounded-full flex items-center justify-center text-white shadow-md z-10"
          onClick={() => toast.info("Menu coming soon!")}
        >
          <Menu size={24} />
        </button>
        
        {/* Jackpot display with awning decoration */}
        <div className="relative mb-6 mt-2">
          <div className="donut-awning">
            <div className="awning-scallop">
              <div className="awning-scallop-item"></div>
              <div className="awning-scallop-item"></div>
              <div className="awning-scallop-item"></div>
              <div className="awning-scallop-item"></div>
              <div className="awning-scallop-item"></div>
            </div>
          </div>
          
          <div className="text-center pt-4 pb-2">
            <h2 className="text-2xl font-bold mb-1">JACKPOT</h2>
            <div className="jackpot-counter">{formatNumber(state.jackpot)}</div>
          </div>
        </div>
        
        {/* Game grid */}
        <div className="game-grid grid grid-cols-5 gap-2 mb-6">
          {Array(5).fill(null).map((_, colIndex) => (
            <SlotReel 
              key={colIndex} 
              symbols={displayGrid.map(row => row[colIndex])} 
              isSpinning={state.isSpinning} 
              delay={colIndex * 200} // Stagger the spin stops
            />
          ))}
        </div>
        
        {/* Win display */}
        {(state.lastWin > 0 || showWinAnimation) && <WinDisplay winAmount={state.lastWin} />}
        
        {/* Game controls */}
        <GameControls />
        
        {/* Bottom info bar */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <div className="text-sm font-semibold mb-1">BALANCE</div>
            <div className="flex items-center justify-center">
              <span className="pi-coin">π</span>
              <span className="font-bold">{formatNumber(state.balance)}</span>
            </div>
          </div>
          
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
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
        
        {/* Button Bar */}
        <div className="mt-6 flex justify-between">
          <button 
            className="secondary-button"
            onClick={() => setShowAbout(true)}
          >
            <Coins className="inline-block mr-1" size={18} /> About Pi
          </button>
          
          <div className="flex gap-2">
            <button className="secondary-button">
              <Volume2 className="inline-block mr-1" size={18} />
            </button>
            <button 
              className="secondary-button"
              onClick={() => setShowSettings(true)}
            >
              <FolderCog className="inline-block mr-1" size={18} />
            </button>
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
    </div>
  );
};

export default SlotMachine;
