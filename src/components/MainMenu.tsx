
import React from "react";
import { 
  Home, Info, Volume2, VolumeX, Trophy, Settings, Coins, RefreshCcw, 
  HelpCircle, Users, BarChart3, LogOut
} from "lucide-react";
import { useGame } from "./GameContext";
import { toast } from "sonner";

interface MainMenuProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onShowAbout: () => void;
  onShowSettings: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  isOpen, 
  onClose, 
  soundEnabled, 
  onToggleSound,
  onShowAbout,
  onShowSettings
}) => {
  const { state } = useGame();
  
  if (!isOpen) return null;
  
  const menuItems = [
    { 
      icon: <Home size={20} />, 
      label: "Home", 
      onClick: () => {
        toast.info("You're already home!");
        onClose();
      } 
    },
    { 
      icon: <Info size={20} />, 
      label: "About Pi Jackpot", 
      onClick: () => {
        onShowAbout();
        onClose();
      }
    },
    { 
      icon: soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />, 
      label: soundEnabled ? "Sound On" : "Sound Off", 
      onClick: onToggleSound 
    },
    { 
      icon: <Trophy size={20} />, 
      label: "Jackpot", 
      onClick: () => {
        toast.info(`Current jackpot: π${state.jackpot.toLocaleString()}`);
        onClose();
      }
    },
    { 
      icon: <Settings size={20} />, 
      label: "Settings", 
      onClick: () => {
        onShowSettings();
        onClose();
      }
    },
    { 
      icon: <Coins size={20} />, 
      label: "Deposit Pi", 
      onClick: () => {
        toast.info("Pi deposit functionality coming soon!");
        onClose();
      }
    },
    { 
      icon: <Users size={20} />, 
      label: "Recent Winners", 
      onClick: () => {
        toast.info("Leaderboard coming soon!");
        onClose();
      }
    },
    { 
      icon: <BarChart3 size={20} />, 
      label: "Statistics", 
      onClick: () => {
        toast.info("Statistics coming soon!");
        onClose();
      }
    },
    { 
      icon: <HelpCircle size={20} />, 
      label: "How to Play", 
      onClick: () => {
        toast.info("Tutorial coming soon!");
        onClose();
      }
    },
    { 
      icon: <LogOut size={20} />, 
      label: "Exit Game", 
      onClick: () => {
        toast.info("Thanks for playing!");
        onClose();
      }
    }
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Menu panel */}
      <div className="candy-panel w-64 h-full max-h-screen overflow-auto animate-slide-in-right ml-0 rounded-r-3xl rounded-l-none z-10">
        <div className="flex items-center justify-center mb-6 pt-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            π
          </div>
          <h2 className="text-xl font-bold ml-3">Pi Jackpot</h2>
        </div>
        
        <div className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center w-full py-3 px-4 rounded-xl transition-colors hover:bg-white/30"
              onClick={item.onClick}
            >
              <span className="mr-3 text-candy-button-primary">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500 px-4">
          <p>Pi Jackpot v1.0</p>
          <p className="mt-1">© 2023 Pi Network</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
