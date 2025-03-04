
import React, { useEffect, useState } from "react";
import { useGame } from "./GameContext";
import { formatNumber } from "../utils/gameLogic";
import { SymbolType } from "../types/game";
import SlotReel from "./SlotReel";
import GameControls from "./GameControls";
import WinDisplay from "./WinDisplay";
import MainMenu from "./MainMenu";
import { toast } from "sonner";
import { Coins, Volume2, VolumeX, Menu, RefreshCcw, Trophy } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import AboutModal from "./modals/AboutModal";
import SettingsModal from "./modals/SettingsModal";
import { playSound, toggleSound, isSoundEnabled, initSounds } from "../utils/soundUtils";

const SlotMachine: React.FC = () => {
  const { state } = useGame();
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  
  // Initialize sounds on component mount
  useEffect(() => {
    initSounds();
  }, []);
  
  // Create an effect that triggers win animation when a win occurs
  useEffect(() => {
    if (state.lastWin > 0) {
      setShowWinAnimation(true);
      
      if (state.lastWin >= 5000) {
        playSound('jackpot');
      } else if (state.lastWin > 0) {
        playSound('win');
      }
      
      // Clear win animation after 3 seconds
      const timer = setTimeout(() => {
        setShowWinAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [state.lastWin]);
  
  // Handle menu toggle
  const handleMenuToggle = () => {
    if (!showMenu) {
      playSound('menuOpen');
    }
    setShowMenu(!showMenu);
  };
  
  // Handle sound toggle
  const handleSoundToggle = () => {
    const newSoundState = toggleSound();
    setSoundOn(newSoundState);
    toast.success(newSoundState ? "Sound enabled" : "Sound muted");
  };
  
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
        <div className="absolute top-0 left-0 w-full h-full bg-pi-network-pattern bg-contain opacity-5"></div>
        <div className="absolute top-[15%] -left-[10%] w-[300px] h-[300px] bg-donut-pink rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute top-[40%] -right-[10%] w-[350px] h-[350px] bg-donut-purple rounded-full blur-[180px] opacity-20"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] bg-donut-yellow rounded-full blur-[200px] opacity-20"></div>
      </div>
      
      {/* Main container */}
      <div className="candy-panel w-full max-w-4xl">
        {/* Header bar with menu and sound buttons */}
        <div className="flex justify-between items-center mb-4">
          <button 
            className="w-10 h-10 bg-candy-button-primary rounded-full flex items-center justify-center text-white shadow-md z-10 hover:bg-purple-600 transition-colors"
            onClick={handleMenuToggle}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          
          <div className="jackpot-display flex items-center bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2 rounded-full shadow-lg">
            <Trophy className="mr-2 text-white" size={22} />
            <div className="text-white font-bold text-xl">
              π{formatNumber(state.jackpot)}
            </div>
          </div>
          
          <button 
            className="w-10 h-10 bg-candy-button-secondary rounded-full flex items-center justify-center shadow-md z-10 hover:bg-amber-400 transition-colors"
            onClick={handleSoundToggle}
            aria-label={soundOn ? "Mute sound" : "Enable sound"}
          >
            {soundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
        
        {/* Game title */}
        <h1 className="text-center text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-candy-button-primary to-pink-500">
          Pi Jackpot
        </h1>
        
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
        <GameControls playSounds={soundOn} />
        
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
        
        {/* Free spins display */}
        {state.freeSpinsRemaining > 0 && (
          <div className="mt-4 bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 rounded-full text-white font-bold shadow-lg text-center">
            <RefreshCcw className="inline-block mr-1" size={16} />
            Free Spins: {state.freeSpinsRemaining}
          </div>
        )}
      </div>
      
      {/* Menu */}
      <MainMenu 
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        soundEnabled={soundOn}
        onToggleSound={handleSoundToggle}
        onShowAbout={() => setShowAbout(true)}
        onShowSettings={() => setShowSettings(true)}
      />
      
      {/* Modals */}
      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </div>
  );
};

export default SlotMachine;
